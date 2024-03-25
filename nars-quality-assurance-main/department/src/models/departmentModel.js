const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Department must have a name"],
  },
  code: {
    type: String,
    required: [true, "Department must have a code"],
    unique: true 
  },
  about: {
    type: String,
    required: [true, "Department must have about"],
  },
  departmentHead: {
    type: String,
    required: [true, "Department must have a department head"],
  },
  competences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Competence",
    required: [true, "Department have a competences"], 
  }],
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: [true, "Department must belong to a faculty"],
  },
  vision: {
    type: String,
  },
  mission: {
    type: String,
  }
});


const Department = mongoose.model("department", departmentSchema);

module.exports = Department;
