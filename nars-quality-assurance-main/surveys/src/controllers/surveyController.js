const Survey = require("../models/surveyModel");
const Submission = require("../models/submissionModel");
const catchAsync = require("../shared/utils/catchAsync");
const axios = require("axios");
const AppError = require("./../shared/utils/appError");

// Surveys
exports.getAllSurveys = catchAsync(async (req, res, next) => {
  const surveys = await Survey.find();
  res.status(200).json({
    status: "success",
    data: surveys,
  });
});

exports.addSurvey = catchAsync(async (req, res, next) => {
  const doc = await Survey.create(req.body);
  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.deleteSurvey = catchAsync(async (req, res, next) => {
  const survey = await Survey.findByIdAndDelete(req.params.id);
  if (!survey) {
    return next(new AppError("No survey found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getSurveyById = catchAsync(async (req, res, next) => {
  const survey = await Survey.findById(req.params.id);
  if (!survey) {
    return next(new AppError("No survey found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: survey,
  });
});

// Submissions
exports.addSubmission = catchAsync(async (req, res, next) => {
  const { surveyId, studentId, answers } = req.body;
  
  // Check if dueTo date is passed or not
  const survey = await Survey.findById(surveyId);
  const currentDate = Date.now();
  if (survey.dueTo && currentDate > survey.dueTo) {
    return next(new AppError("This survey is over, you can't add any submission", 400));
  }
  
  // Check if submission already exists
  const existingSubmission = await Submission.findOne({ survey: surveyId, studentId: studentId });
  if (existingSubmission) {
    return next(new AppError("You've already added your submission to this survey", 400));
  }
  
  // Calculate averages
  // Add your logic to calculate averages based on the provided answers
  
  // Create submission
  const submission = await Submission.create({
    survey: surveyId,
    studentId: studentId,
    answers: answers,
  });
  
  res.status(201).json({
    status: "success",
    data: submission,
  });
});

exports.deleteSubmission = catchAsync(async (req, res, next) => {
  const submission = await Submission.findByIdAndDelete(req.params.id);
  if (!submission) {
    return next(new AppError("No submission found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getSurveySubmissions = catchAsync(async (req, res, next) => {
  const submissions = await Submission.find({ survey: req.params.id });
  res.status(200).json({
    length: submissions.length,
    status: "success",
    data: submissions,
  });
});

exports.getStudentSubmissions = catchAsync(async (req, res, next) => {
  const submissions = await Submission.find({ studentId: req.body.studentId });
  res.status(200).json({
    status: "success",
    data: submissions,
  });
});
