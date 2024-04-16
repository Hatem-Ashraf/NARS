// surveyModel.js
const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', 
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  questions: [{
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  }],
  overallRating: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  }
});

module.exports = mongoose.model('Survey', surveySchema);
