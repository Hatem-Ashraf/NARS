const DepartmentComp = require("../models/departmentcompetences");

exports.createDepartmentComp = async(req,res)=>{
try {
    const compData = req.body;
    const competences = compData.map(compData => ({
      code: compData.code,
      description: compData.description,
      level: compData.level
    }));
    const insertedCompetences = await DepartmentComp.insertMany(competences);
    res.status(201).json({ competences: insertedCompetences });
} catch (error) {
    res.status(400).json({error:error.message});
}
}

exports.getAllDepartmentCompetences = async (req, res) => {
    try {
      const competences = await DepartmentComp.find();
      res.status(200).json({ competences });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.deleteDepartmentCompetence = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCompetence = await DepartmentComp.findByIdAndDelete(id);
      if (!deletedCompetence) {
        return res.status(404).json({ error: "Competence not found" });
      }
      res.status(200).json({ message: "Competence deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


exports.updateDepartmentCompetence = async (req, res) => {
    try {
      const { id } = req.params;
      const { code, description,level } = req.body;
      const updatedCompetence = await DepartmentComp.findByIdAndUpdate(id, { code, description,level }, { new: true });
      if (!updatedCompetence) {
        return res.status(404).json({ error: "Competence not found" });
      }
      res.status(200).json({ competence: updatedCompetence });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getDepartmentCompetenceById = async (req, res) => {
    try {
      const { id } = req.params;
      const competence = await DepartmentComp.findById(id);
      if (!competence) {
        return res.status(404).json({ error: "Competence not found" });
      }
      res.status(200).json({ competence });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };