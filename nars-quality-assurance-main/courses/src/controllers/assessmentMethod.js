const AssessmentMethod = require("../models/assessmentMethod");
const mongoose = require("mongoose");

exports.createAssessmentMethod = async (req, res) => {
  try {
    const { assessment, grade, LO, courses, weight } = req.body;
    const newAssessmentMethod = new AssessmentMethod({
      assessment,
      grade,
      LO,
      courses,
      weight,
    });
    const savedAssessmentMethod = await newAssessmentMethod.save();
    res.status(201).json(savedAssessmentMethod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAssessmentsByCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      console.log("courseId is undefined");
      return res
        .status(400)
        .json({ message: "courseId parameter is required" });
    }

    console.log(`Received courseId: ${id}`);
    const courseObjectId = mongoose.Types.ObjectId(id);

    // Find assessments where the course ID matches the provided course ID
    const assessments = await AssessmentMethod.find({
      courses: courseObjectId,
    }).populate("LO");

    console.log(`Assessments found: ${assessments.length}`);

    if (assessments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assessments found for this course" });
    }

    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Controller function to get all assessment methods
exports.getAllAssessmentMethods = async (req, res) => {
  try {
    const assessmentMethods = await AssessmentMethod.find();
    res.json(assessmentMethods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a single assessment method by ID
exports.getAssessmentMethodById = async (req, res) => {
  try {
    const assessmentMethod = await AssessmentMethod.findById(req.params.id);
    if (!assessmentMethod) {
      return res.status(404).json({ message: "Assessment method not found" });
    }
    res.json(assessmentMethod);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to update an existing assessment method
exports.updateAssessmentMethod = async (req, res) => {
  try {
    const { assessment, grade, LO, courses, weight } = req.body;
    const updatedAssessmentMethod = await AssessmentMethod.findByIdAndUpdate(
      req.params.id,
      { assessment, grade, LO, courses, weight },
      { new: true }
    );
    res.json(updatedAssessmentMethod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller function to delete an assessment method
exports.deleteAssessmentMethod = async (req, res) => {
  try {
    await AssessmentMethod.findByIdAndDelete(req.params.id);
    res.json({ message: "Assessment method deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
