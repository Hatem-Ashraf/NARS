const Student = require("../models/student");
const Course = require("../models/courseModel");
const assessmentMethod = require("../models/assessmentMethod");
const mongoose = require("mongoose");
exports.createStudent = async (req, res) => {
  try {
    const { name, program, faculty, department, courses } = req.body;

    // Fetch all assessment methods related to the given courses
    const assessmentMethods = await assessmentMethod.find({
      courses: { $in: courses },
    });

    // Create a student with assessment methods initialized to grade 0
    const newStudent = await Student.create({
      name,
      program,
      faculty,
      department,
      courses, // Assign the provided course IDs directly
      assessmentMethods: assessmentMethods.map((method) => ({
        courses: method.courses, // Ensure the course ID is included
        assessment: method.assessment,
        grade: 0,
        LO: method.LO,
        weight: method.weight,
      })),
      coursesGrades: courses.map((courseId) => ({
        courseId,
        totalGrade: 0,
        grade: "F",
      })),
    });

    res.status(201).json({
      status: "success",
      data: {
        student: newStudent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      status: "success",
      data: {
        students,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateFields = req.body; // New data to update

    const allowedFields = [
      "name",
      "program",
      "faculty",
      "department",
      "courses",
    ];
    const filteredFields = Object.keys(updateFields).filter((field) =>
      allowedFields.includes(field)
    );

    const updatedData = {};
    for (const field of filteredFields) {
      updatedData[field] = updateFields[field];
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        student: updatedStudent,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateAssessmentGradesForCourse = async (req, res) => {
  try {
    const updatedAssessmentData = req.body.assessments;

    // Iterate over each assessment
    for (const updatedAssessment of updatedAssessmentData) {
      const { assessment, grades } = updatedAssessment;

      // Iterate over each grade for the assessment
      for (const gradeData of grades) {
        const { studentId, grade } = gradeData;

        // Find the student by ID
        const student = await Student.findById(studentId);

        if (!student) {
          return res.status(404).json({
            status: "fail",
            message: `Student with ID ${studentId} not found`,
          });
        }

        // Find the assessment method for the student
        const studentAssessment = student.assessmentMethods.find(
          (method) => method.assessment === assessment
        );

        if (studentAssessment) {
          // Update the grade for the assessment
          studentAssessment.grade = grade;
          // Save the updated student document
          await student.save();
        } else {
          return res.status(404).json({
            status: "fail",
            message: `Assessment ${assessment} not found for student ${studentId}`,
          });
        }
      }

      // Recalculate and save total grade for each student
      await updateTotalGrades();
    }

    res.status(200).json({
      status: "success",
      message: "Assessment grades updated for all students",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
const updateTotalGrades = async () => {
  try {
    const students = await Student.find();

    for (const student of students) {
      // Initialize an object to store total grades for each course
      const courseTotalGrades = {};

      // Iterate through each course associated with the student
      for (const courseId of student.courses) {
        let totalGradeForCourse = 0;
        let courseFullMark = 0;

        // Find the course
        const course = await Course.findById(courseId);

        // Calculate the total grade for the assessments within the course
        student.assessmentMethods.forEach((assessment) => {
          // Check if the assessment belongs to the current course
          if (assessment.courses.includes(courseId)) {
            totalGradeForCourse += assessment.grade;
            courseFullMark += assessment.fullMark; // Assuming you have a field named fullMark in assessment
          }
        });

        // Calculate percentage and grade for the course
        const percentage = (totalGradeForCourse / courseFullMark) * 100;
        const grade = getGrade(percentage);

        // Update the course grade for the student
        courseTotalGrades[courseId] = {
          totalGrade: totalGradeForCourse,
          grade,
        };

        // Update the total grade for the student
        student.totalGrade += totalGradeForCourse;
      }

      // Update the student's coursesGrades array with the calculated grades for each course
      student.coursesGrades = student.courses.map((courseId) => {
        return {
          courseId,
          totalGrade: courseTotalGrades[courseId].totalGrade,
          grade: courseTotalGrades[courseId].grade,
        };
      });

      // Save the updated student document
      await student.save();
    }
  } catch (error) {
    console.error("Error updating total grades:", error);
    throw new Error("Error updating total grades");
  }
};
const getGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 55) return "C";
  if (percentage >= 50) return "C-";
  if (percentage >= 45) return "D+";
  if (percentage >= 40) return "D";
  return "F";
};

exports.assignGrades = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Retrieve the student by ID
    const student = await Student.findById(studentId).populate("courses");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Iterate through each course the student is enrolled in
    for (const courseId of student.courses) {
      const course = await Course.findById(courseId);

      if (course && course.fullMark) {
        // Calculate the percentage
        const percentage = (student.totalGrade / course.fullMark) * 100;

        // Get the grade based on the percentage
        const grade = getGrade(percentage);

        // Find or create the course grade entry
        let courseGrade = student.coursesGrades.find((cg) =>
          cg.courseId.equals(courseId)
        );
        if (!courseGrade) {
          courseGrade = { courseId, totalGrade: 0, grade: "F" };
          student.coursesGrades.push(courseGrade);
        }

        // Update the course grade entry
        courseGrade.totalGrade = student.totalGrade;
        courseGrade.grade = grade;
      }
    }

    // Save the updated student record
    await student.save();

    res.status(200).json({
      message: "Grades assigned successfully.",
      coursesGrades: student.coursesGrades,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while assigning grades." });
  }
};

exports.calculateGradeDistributionForCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Retrieve all students enrolled in the given course
    const students = await Student.find({ courses: courseId });

    // Initialize an object to store grade distribution
    const gradeDistribution = {
      "A+": 0,
      A: 0,
      "A-": 0,
      "B+": 0,
      B: 0,
      "B-": 0,
      "C+": 0,
      C: 0,
      "C-": 0,
      "D+": 0,
      D: 0,
      F: 0,
    };

    // Iterate through each student
    students.forEach((student) => {
      // Find the course grade entry for the given course
      const courseGrade = student.coursesGrades.find((course) =>
        course.courseId.equals(courseId)
      );

      if (courseGrade) {
        // Calculate the percentage for the student
        const percentage = (courseGrade.totalGrade / 100) * 100;

        // Determine the grade based on the percentage
        const grade = getGrade(percentage);

        // Increment the count for the corresponding grade
        gradeDistribution[grade]++;
      }
    });

    res.status(200).json({
      status: "success",
      data: {
        gradeDistribution,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "An error occurred while calculating grade distribution.",
      });
  }
};
