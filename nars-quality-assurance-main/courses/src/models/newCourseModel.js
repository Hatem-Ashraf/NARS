const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Course must have a name"],
  },
  code: {
    type: String,
    required: [true, "Course must have a code"],
    unique: true,
  },
  hours: {
    type: Number,
    required: [true, "Course must have hours"],
  },
  information: {
    type: String,
    required: [true, "Course must have information"],
  },
  goals: {
    type: String,
    required: [true, "Course must have goals"],
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program', 
    required: true,
  }
});

const Newcourse = mongoose.model("Newcourse", courseSchema);

module.exports = Newcourse;
