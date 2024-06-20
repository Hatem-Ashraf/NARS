const mongoose = require("mongoose");
const validator = require("validator");

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "program must have a name"],
  },
  competences: {
    type: [
      {
        type: String
      },
    ],
    required: [true, "Program must have competences"],
  },
  programHead: {
    type: String,
    // required: [true, "program must have a program head"],
  },
  qualityCoordinator: {
    type: String,
    // required: [true, "program must have a program head"],
  },

  faculty: {
    type: String,
    required: [true, "program must have a faculty"],
  },

  department: {
    type: String,
    required: [true, "program must have a department"],
  },
  programSpcs: {
    type: String,
  },
  report: {
    courseAvgDirect: {
      type: [Object],
    },
    programCompAvgs: {
      type: [Object],
    },
  },
  mission: {
    type: String,
  },
  vision: {
    type: String,
  },
});

const program = mongoose.model("program", programSchema);

module.exports = program;
