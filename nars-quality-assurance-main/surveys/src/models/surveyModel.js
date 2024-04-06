const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Survey must have a name"],
  },
  description: String,
  questions: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dueTo: {
    type: Date,
    required: [true, "Survey must have a due-to date"],
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Survey must belong to a course"],
  },
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
