const mongoose = require("mongoose");

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

  academicYear: {
    type: String,
  },
  program: mongoose.Schema.ObjectId,
  courseAims: {
    type: String
  },
  competences: {
    type: [
      {
        type: String,
      },
    ],
    required: [true, "course must have Competences"],
  },
  department: mongoose.Schema.ObjectId,
  faculty: mongoose.Schema.ObjectId,
  exams: [mongoose.Schema.ObjectId],
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
});
// courseSchema.pre(/^find/, function (next) {
//   this.populate({ path: "currentInstance", select: "-course courseSpecs" });

//   next();
// });

const Course = mongoose.model("course", courseSchema);

module.exports = Course;
