const Grading = require("../models/grade");

exports.createGrading = async (req, res) => {
  try {
    const gradingData = req.body;
    const grading = new Grading(gradingData);
    const savedGrading = await grading.save();
    res.status(201).json(savedGrading);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateGrading = async (req, res) => {
  try {
    const id = req.params.gradeId;
    const gradingData = req.body;
    const updatedGrading = await Grading.findByIdAndUpdate(id, gradingData, {
      new: true,
    });
    res.json(updatedGrading);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllGrades = async (req, res) => {
  try {
    const gradings = await Grading.find();
    res.json(gradings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGradeById = async (req, res) => {
  try {
    const grading = await Grading.findById(req.params.gradeId);
    if (!grading) {
      return res.status(404).json({ message: "Grading document not found" });
    }
    res.json(grading);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGradesUnderProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const gradings = await Grading.find({ programId });
    res.json(gradings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const id = req.params.gradeId;
    const deletedGrading = await Grading.findByIdAndDelete(id);

    if (!deletedGrading) {
      return res.status(404).json({ message: "Grading document not found" });
    }

    res.json({ message: "Grading document deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
