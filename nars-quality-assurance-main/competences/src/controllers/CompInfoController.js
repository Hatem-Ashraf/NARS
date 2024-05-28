const DepartmentComp = require("../models/departmentcompetences");
const FacultyComp = require("../models/facultyCompetences");
const ProgramComp = require("../models/programCompetences");

exports.getInfoCompetences = async (req, res) => {
  try {
    const { departmentIds, facultyIds, programIds } = req.body;

    // Validate the input IDs
    if (!departmentIds || !Array.isArray(departmentIds) ||
        !facultyIds || !Array.isArray(facultyIds) ||
        !programIds || !Array.isArray(programIds)) {
      return res.status(400).json({ error: "Invalid input data. Expected arrays of IDs." });
    }

    // Fetch competences based on specific IDs
    const departmentCompetences = await DepartmentComp.find({ _id: { $in: departmentIds } });
    const facultyCompetences = await FacultyComp.find({ _id: { $in: facultyIds } });
    const programCompetences = await ProgramComp.find({ _id: { $in: programIds } });

    // Check if all requested IDs were found
    const missingDepartmentIds = departmentIds.filter(id => !departmentCompetences.some(comp => comp._id.toString() === id));
    const missingFacultyIds = facultyIds.filter(id => !facultyCompetences.some(comp => comp._id.toString() === id));
    const missingProgramIds = programIds.filter(id => !programCompetences.some(comp => comp._id.toString() === id));

    // Combine competences from all models
    const selectedCompetences = {
      departmentCompetences,
      facultyCompetences,
      programCompetences,
      missingCompetences: {
        department: missingDepartmentIds,
        faculty: missingFacultyIds,
        program: missingProgramIds
      }
    };

    res.status(200).json({ selectedCompetences });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
