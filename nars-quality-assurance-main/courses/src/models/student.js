const mongoose = require("mongoose");
const assessmentMethods = require("./assessmentMethod");
const studentAssessmentMethodSchema = new mongoose.Schema({
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
  assessment: { type: String, required: true },
  grade: { type: Number, default: 0 }, // Default grade to 0
  LO: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LO",
    },
  ],
  weight: { type: Number },
});

const courseGradeSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  totalGrade: {
    type: Number,
    default: 0,
  },
  grade: {
    type: String,
    enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"],
    default: "F",
  },
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Student must have a name"],
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
  program: {
    type: mongoose.Schema.ObjectId,
    ref: "Program",
  },
  faculty: {
    type: mongoose.Schema.ObjectId,
    ref: "Faculty",
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: "Department",
  },
  assessmentMethods: [studentAssessmentMethodSchema],
  coursesGrades: [courseGradeSchema],
});

const student2 = mongoose.model("Student2", studentSchema);

module.exports = student2;
