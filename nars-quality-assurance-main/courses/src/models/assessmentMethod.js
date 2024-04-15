const mongoose = require("mongoose");

const assessmentMethodSchema = new mongoose.Schema({
  assessment: { type: String, required: true },
  grade: { type: Number, required: true },
  LO: { type: [String] },
});

const assessmentMethod = mongoose.model(
  "assessmentMethod",
  assessmentMethodSchema
);

module.exports = assessmentMethod;
