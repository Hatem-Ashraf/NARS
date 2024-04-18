const mongoose = require("mongoose");
const validator = require("validator");

const programCompetencesSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "program Competences must have a code"],
  },
  description: {
    type: String,
    required: [true, "program Competences must have a description"],
  },
  level: {
    type: String,
    required: [true, "program Competences must have a level"],
    enum: ["A", "B", "C", "D"],
  },
});

const programCompetences = mongoose.model(
  "programCompetences",
  programCompetencesSchema
);

module.exports = programCompetences;
