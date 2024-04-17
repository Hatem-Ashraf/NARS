const mongoose = require("mongoose");
const assessmentMethods = require("./assessmentMethod");
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "student must have a name"],
  },

  courses: [mongoose.Schema.ObjectId],
  program: mongoose.Schema.ObjectId,
  faculty: mongoose.Schema.ObjectId,
  department: mongoose.Schema.ObjectId,

  assessmentMethods: [
    {
      type: assessmentMethods.schema,
      default: [],
    },
  ],
});

const student2 = mongoose.model("Student2", studentSchema);

module.exports = student2;
