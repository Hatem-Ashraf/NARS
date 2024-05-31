const mongoose = require('mongoose');

// Learning Outcome Schema
const LOSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  domain: {
    type: String,
    enum: ['Cognitive', 'Psychomotor', 'Affective'],
    required: true
  },
  competencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competence'
  }]
});

const LO = mongoose.model('LO', LOSchema);

// Competence Schema
const competenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

const Competence = mongoose.model('Competence', competenceSchema);

// Course Schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Course must have a Name"],
  },
  code: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Course must have a code"]
  },
  hours: {
    type: Number,
    required: [true, "Course must have hours"],
  },
  academicYear: {
    type: String,
  },
  courseAims: {
    type: String,
    // required: [true, 'Please provide course aims']
  },
  courseInformation: {
    type: String,
    // required: [true, 'Please provide course info']
  },
  competences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competence',
    required: true
  }],
  learningOutcomes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LO',
    required: true
  }],
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: [true, "Course must be in a program"]
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  exams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  }],
  fullMark: {
    type: Number,
  },
  materialsPaths: [
    {
      path: String,
      name: String,
      description: String,
      date: Date,
    },
  ],
  minTarget: {
    type: Number,
    default: 50,
  },
  maxTarget: {
    type: Number,
    default: 70,
  },
  competencesModel: {
    type: String,
    enum: ['departmentCompetences', 'facultyCompetences', 'programCompetences']
  }
});

courseSchema.pre(/^find/, function (next) {
  if (this.competencesModel) {
    this.populate({
      path: 'competences',
      model: this.competencesModel
    });
  } else {
    this.populate('competences');
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

module.exports = { Course, LO, Competence };
