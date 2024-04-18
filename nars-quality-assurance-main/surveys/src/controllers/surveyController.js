const Survey = require("../models/surveyModel");
const Submission = require("../models/submissionModel");
const catchAsync = require("../shared/utils/catchAsync");
const axios = require("axios");
const AppError = require("./../shared/utils/appError");



exports.createSurvey = async (req, res) => {
  try {
    const { courseId, courseName, questions, overallRating } = req.body;
    const surveyQuestions = questions.map(questionData => ({
      text: questionData.text,
      rating: questionData.rating, 
    }));
    const newSurvey = new Survey({
      courseId,
      courseName,
      questions: surveyQuestions,
      overallRating,
    });
    const savedSurvey = await newSurvey.save();
    res.status(201).json({ surveyId: savedSurvey._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

exports.getAllSurveys = catchAsync(async (req, res, next) => {
  const surveys = await Survey.find();
  res.status(200).json({
    status: "success",
    data: surveys,
  });
});


exports.updateSurvey = async (req, res) => {
  try {
    const surveyId  = req.params.id;
    const { courseId, courseName, questions, overallRating } = req.body;
    const existingSurvey = await Survey.findById(surveyId);
    if (!existingSurvey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    existingSurvey.courseId = courseId;
    existingSurvey.courseName = courseName;
    existingSurvey.questions = questions.map(questionData => ({
      text: questionData.text,
      rating: questionData.rating,
    }));
    existingSurvey.overallRating = overallRating;
    const updatedSurvey = await existingSurvey.save();
    res.status(200).json(updatedSurvey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.submitSurvey = async (req, res) => {
  try {
    const { surveyId, responses, overallRating } = req.body;
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    const newSubmission = new Submission({
      surveyId,
      responses,
      overallRating,
    });
    const savedSubmission = await newSubmission.save();

    res.status(201).json({ submissionId: savedSubmission._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSurveyResponses = async (req, res) => {
  try {
    const surveyId = req.params.surveyId;
    const responses = await Submission.find({ surveyId });

    res.status(200).json({ responses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    await Submission.findByIdAndDelete(submissionId);

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.calculateAverageRatings = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const submissions = await Submission.find({ surveyId });
    const questionStats = {};
    submissions.forEach(submission => {
      submission.responses.forEach(response => {
        const { questionId, response: rating } = response; 
        if (!questionStats[questionId]) {
          questionStats[questionId] = { sum: 0, count: 0 };
        }
        questionStats[questionId].sum += rating;
        questionStats[questionId].count++;
      });
    });
    const averageRatings = {};
    for (const questionId in questionStats) {
      const { sum, count } = questionStats[questionId];
      averageRatings[questionId] = sum / count;
    }
    res.status(200).json({ averageRatings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.calculateAverageOverallRating = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const submissions = await Submission.find({ surveyId });
    let totalOverallRating = 0;
    let submissionCount = 0;

    submissions.forEach(submission => {
      totalOverallRating += submission.overallRating;
      submissionCount++;
    });
    const averageOverallRating = submissionCount > 0 ? totalOverallRating / submissionCount : 0;
    res.status(200).json({ averageOverallRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
