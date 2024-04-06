const catchAsync = require("../shared/utils/catchAsync");
const AppError = require("./../shared/utils/appError");
const Course = require("../models/courseModel");

// Function to retrieve all topics for a given course
exports.getAllTopics = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId).populate('topics.competences');
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: course.topics,
  });
});

// Function to create a new topic for a course
exports.createTopic = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  const newTopic = {
    courseCode: req.body.courseCode,
    courseTitle: req.body.courseTitle,
    courseAims: req.body.courseAims,
    courseInformation: req.body.courseInformation,
    competences: req.body.competences,
    learningOutcomes: req.body.learningOutcomes
  };

  course.topics.push(newTopic);
  await course.save();

  res.status(201).json({
    status: "success",
    data: newTopic,
  });
});

// Function to retrieve a specific topic of a course
exports.getTopic = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  const topic = course.topics.id(req.params.topicId);
  if (!topic) {
    return next(new AppError("No topic found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: topic,
  });
});

// Function to update a specific topic of a course
exports.updateTopic = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  let topic = course.topics.id(req.params.topicId);
  if (!topic) {
    return next(new AppError("No topic found with that id", 404));
  }

  topic.set({
    courseCode: req.body.courseCode || topic.courseCode,
    courseTitle: req.body.courseTitle || topic.courseTitle,
    courseAims: req.body.courseAims || topic.courseAims,
    courseInformation: req.body.courseInformation || topic.courseInformation,
    competences: req.body.competences || topic.competences,
    learningOutcomes: req.body.learningOutcomes || topic.learningOutcomes
  });

  await course.save();

  res.status(200).json({
    status: "success",
    data: topic,
  });
});

// Function to delete a specific topic of a course
exports.deleteTopic = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError("No course found with that id", 404));
  }

  course.topics.pull(req.params.topicId);
  await course.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
