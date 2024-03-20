const mongoose = require("mongoose");
const validator = require("validator");

const departmentCompetencesSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "department Competences must have a code"],
  },
  description: {
    type: String,
    required: [true, "department Competences must have a description"],
  },
  level: {
    type: String,
    required: [true, "department Competences must have a level"],
    enum: ['A', 'B', 'C','D'],
  }
});

const departmentCompetences = mongoose.model("departmentCompetences", departmentCompetencesSchema);

module.exports = departmentCompetences;
