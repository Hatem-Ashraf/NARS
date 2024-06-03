const mongoose = require('mongoose');

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
    required: [true, 'Please provide course aims']
  },
  courseInformation: {
    type: String,
    required: [true, 'Please provide course info']
  },
  competences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'los',
    // required: [true, "course must have Competences"],
  }],
  learningOutcomes: [{
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    ref: 'los' ,
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
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;