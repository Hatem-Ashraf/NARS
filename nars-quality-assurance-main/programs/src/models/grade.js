const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GradeSchema = new Schema({
    grade: String,
    numberOfStudents: Number,
    percentage: Number,
});
const GradingSchema = new Schema({
    programId: String,
    academicYear: String,
    grades: [GradeSchema],
});

// Create model
const Grading = mongoose.model('Grading', GradingSchema);

module.exports = Grading;
