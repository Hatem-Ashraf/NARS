const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Assuming you have a Student model
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Assuming you have a Course model
    required: true
  },
  quizGrades: [{
    type: Number,
    default: 0
  }],
  midExamGrade: {
    type: Number,
    default: 0
  },
  finalProjectGrade: {
    type: Number,
    default: 0
  },
  finalExamGrade: {
    type: Number,
    default: 0
  }
});

const Mark = mongoose.model('Mark', markSchema);

module.exports = Mark;
