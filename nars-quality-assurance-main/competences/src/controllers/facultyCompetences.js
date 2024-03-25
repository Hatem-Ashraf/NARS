const FacultyComp = require("../models/facultyCompetences");

exports.createFacultyComp = async(req,res)=>{
try {
    const facultyComp = req.body;
    const competences = facultyComp.map(facultyComp => ({
      code: facultyComp.code,
      description: facultyComp.description,
      level: facultyComp.level
    }));
    const insertedCompetences = await FacultyComp.insertMany(competences);
    res.status(201).json({ competences: insertedCompetences });
} catch (error) {
    res.status(400).json({error:error.message});
}
}


exports.getAllFacultyCompetences = async (req, res) => {
    try {
      const competences = await FacultyComp.find();
      res.status(200).json({ competences });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.deleteFacultyCompetence = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCompetence = await FacultyComp.findByIdAndDelete(id);
      if (!deletedCompetence) {
        return res.status(404).json({ error: "Competence not found" });
      }
      res.status(200).json({ message: "Competence deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


exports.updateFacultyCompetence = async (req, res) => {
    try {
      const { id } = req.params;
      const { code, description,level } = req.body;
      const updatedCompetence = await FacultyComp.findByIdAndUpdate(id, { code, description,level }, { new: true });
      if (!updatedCompetence) {
        return res.status(404).json({ error: "Competence not found" });
      }
      res.status(200).json({ competence: updatedCompetence });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getFacultyCompetenceById = async (req, res) => {
    try {
      const { id } = req.params;
      const competence = await FacultyComp.findById(id);
      if (!competence) {
        return res.status(404).json({ error: "Competence not found" });
      }
      res.status(200).json({ competence });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };