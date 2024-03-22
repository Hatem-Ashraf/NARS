const ProgramObjective = require("../models/programObjective");

exports.createProgramObjective = async (req, res) => {
  try {
    const objData = req.body;
    const programObjectives = [];

    for (const obj of objData) {
      const { code, description } = obj;
      const programObj = new ProgramObjective({ code, description });
      await programObj.save();
      programObjectives.push(programObj);
    }

    res.status(201).json({ programObjectives });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProgramObjectives = async (req, res) => {
  try {
    const objectives = await ProgramObjective.find();
    res.status(200).json({ objectives });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProgramObjective = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedObjective = await ProgramObjective.findByIdAndDelete(id);
    if (!deletedObjective) {
      return res.status(404).json({ error: "Objective not found" });
    }
    res.status(200).json({ message: "Objective deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProgramObjective = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description } = req.body;
    const updatedObjective = await ProgramObjective.findByIdAndUpdate(
      id,
      { code, description },
      { new: true }
    );
    if (!updatedObjective) {
      return res.status(404).json({ error: "Objective not found" });
    }
    res.status(200).json({ objective: updatedObjective });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProgramObjectiveById = async (req, res) => {
  try {
    const { id } = req.params;
    const objective = await ProgramObjective.findById(id);
    if (!objective) {
      return res.status(404).json({ error: "Objective not found" });
    }
    res.status(200).json({ objective });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
