const mongoose = require("mongoose");

const assessmentMethodSchema = new mongoose.Schema({
  courses: [mongoose.Schema.ObjectId],
  assessment: { type: String, required: true },
  grade: { type: Number, required: true },
  LO: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LO",
    },
  ],
  weight: { type: Number },
});

const assessmentMethod = mongoose.model(
  "assessmentMethod",
  assessmentMethodSchema
);

module.exports = assessmentMethod;
