const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Faculty must have a name"],
  },
  dean: {
    type: String,
    required: [true, "Faculty must have a dean"],
  },
  about: {
    type: String,
    required: [true, "Faculty must have about"],
  },
  competences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competence",
  }],
});

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
