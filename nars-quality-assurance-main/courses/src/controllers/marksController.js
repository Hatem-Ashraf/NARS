const catchAsync = require("../shared/utils/catchAsync");
const factory = require("./../shared/controllers/handlerFactory");
const AppError = require("./../shared/utils/appError");
const Course = require("../models/courseModel");
const axios = require("axios");

// Function to retrieve all marks for a given course
exports.getAllMarks = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  const allMarks = course.students.map(student => ({
    studentId: student.studentId,
    mark: student.mark
  }));

  res.status(200).json({
    status: "success",
    data: allMarks,
  });
});

// Function to add marks for all students in a course
exports.addAllStudentMarks = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  course.students.forEach(student => {
    student.mark = req.body.find(item => item.studentId === student.studentId).mark;
  });

  await course.save();

  res.status(200).json({
    status: "success",
    data: course,
  });
});

// Function to retrieve marks for a specific student in a course
exports.getStudentMarks = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  const student = course.students.find(student => student.studentId === req.params.studentId);
  if (!student) {
    return next(new AppError("No marks found for this student in the course", 404));
  }

  res.status(200).json({
    status: "success",
    data: student.mark,
  });
});

// Function to update marks for a specific student in a course
exports.updateStudentMarks = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  const student = course.students.find(student => student.studentId === req.params.studentId);
  if (!student) {
    return next(new AppError("No marks found for this student in the course", 404));
  }

  student.mark = req.body.mark;
  await course.save();

  res.status(200).json({
    status: "success",
    data: student.mark,
  });
});
