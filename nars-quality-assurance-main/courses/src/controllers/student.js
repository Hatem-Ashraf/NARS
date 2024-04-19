const Student = require("../models/student");
const assessmentMethod = require("../models/assessmentMethod");

exports.createStudent = async (req, res) => {
  try {
    const { name, program, faculty, department, courses } = req.body;

    // Fetch all assessment methods
    const assessmentMethods = await assessmentMethod.find({
      course: { $in: courses },
    });
    // Create a student with assessment methods
    const newStudent = await Student.create({
      name,
      program,
      faculty,
      department,
      courses,
      assessmentMethods: assessmentMethods.map((method) => ({
        assessment: method.assessment,
        grade: 0,
        LO: method.LO,
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
    const updatedAssessmentData = req.body.assessments; // Assuming assessments is an array of updated assessment data

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
