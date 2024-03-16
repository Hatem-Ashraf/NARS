const mongoose = require("mongoose");
const validator = require("validator");

const facultyCompetencesSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Faculty Competences must have a code"],
  },
  description: {
    type: String,
    required: [true, "Faculty Competences must have a description"],
  },
  level: {
    type: String,
    required: [true, "Faculty Competences must have a level"],
    enum: ['A', 'B', 'C','D'],
  }
});

const facultyCompetences = mongoose.model("facultyCompetences", facultyCompetencesSchema);

module.exports = facultyCompetences;
