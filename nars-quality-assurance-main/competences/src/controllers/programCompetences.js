const ProgramComp = require("../models/programCompetences");

exports.createProgramComp = async (req, res) => {
  try {
    const compData = req.body;
    const programComps = [];

    for (const comp of compData) {
      const { code, description, level } = comp;
      const programComp = new ProgramComp({ code, description, level });
      await programComp.save();
      programComps.push(programComp);
    }

    res.status(201).json({ programComps });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProgramCompetences = async (req, res) => {
  try {
    const competences = await ProgramComp.find();
    res.status(200).json({ competences });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProgramCompetence = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCompetence = await ProgramComp.findByIdAndDelete(id);
    if (!deletedCompetence) {
      return res.status(404).json({ error: "Competence not found" });
    }
    res.status(200).json({ message: "Competence deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProgramCompetence = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, level } = req.body;
    const updatedCompetence = await ProgramComp.findByIdAndUpdate(
      id,
      { code, description, level },
      { new: true }
    );
    if (!updatedCompetence) {
      return res.status(404).json({ error: "Competence not found" });
    }
    res.status(200).json({ competence: updatedCompetence });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgramCompetenceById = async (req, res) => {
  try {
    const { id } = req.params;
    const competence = await ProgramComp.findById(id);
    if (!competence) {
      return res.status(404).json({ error: "Competence not found" });
    }
    res.status(200).json({ competence });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
