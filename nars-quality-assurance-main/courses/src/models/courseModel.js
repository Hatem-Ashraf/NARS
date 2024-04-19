const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Newcourse',
    required: [true, 'Please provide a course ID']
  },
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
    refPath: 'competencesModel',
    required: [true, "course must have Competences"],

  }],
  learningOutcomes: [{
    code: { type: String, required: true },
    name: { type: String, required: true },
    required: true
  }],
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
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
  const populateOptions = {
    path: 'competences',
    populate: { path: 'competencesModel' } 
  };

  if (this.competencesModel) {
    populateOptions.populate.refPath = this.competencesModel;
  }

  this.populate(populateOptions);
  next();
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
