
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey', 
    required: true,
  },
  responses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    response: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  }],
  overallRating: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
});

module.exports = mongoose.model('Submission', submissionSchema);
