const mongoose = require("mongoose");
const validator = require("validator");

const programObjsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "program Objective must have a code"],
  },
  description: {
    type: String,
    required: [true, "program Objective must have a description"],
  },
});

const programObjective = mongoose.model("programObjective", programObjsSchema);

module.exports = programObjective;
