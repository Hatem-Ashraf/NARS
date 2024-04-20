const DepartmentComp = require("../models/departmentcompetences");
const FacultyComp = require("../models/facultyCompetences");
const ProgramComp = require("../models/programCompetences");

exports.getSpecificCompetences = async (req, res) => {
  try {
    const { departmentIds, facultyIds, programIds } = req.body; // Assuming IDs are sent in the request body

    
    const departmentCompetences = await DepartmentComp.find({ _id: { $in: departmentIds } });
    const facultyCompetences = await FacultyComp.find({ _id: { $in: facultyIds } });
    const programCompetences = await ProgramComp.find({ _id: { $in: programIds } });

    
    const selectedCompetences = {
      departmentCompetences,
      facultyCompetences,
      programCompetences
    };

    res.status(200).json({ selectedCompetences });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
