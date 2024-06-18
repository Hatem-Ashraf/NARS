const Program = require("../models/programModel");
const Course = require("../models/courseModel");
exports.addProgram = async (req, res) => {
  try {
    // Extract name and competences from the request body
    const { name, competences } = req.body;

    const facultyId = req.params.facultyId;
    const departmentId = req.params.departmentId;

    if (!facultyId || !departmentId || !name) {
      return res.status(400).json({
        status: "fail",
        message: "Program must have a name, facultyId, departmentId",
      });
    }

    // Create a new program instance with only name and competences
    const newProgram = new Program({
      name,
      faculty: facultyId,
      department: departmentId,
      competences,
    });

    // Save the program to the database
    const savedProgram = await newProgram.save();

    res.status(201).json({
      status: "success",
      data: {
        program: savedProgram,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllPrograms = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const departmentId = req.params.departmentId;

    if (!facultyId || !departmentId) {
      return res.status(400).json({
        status: "fail",
        message: "Program must have a name, facultyId, departmentId",
      });
    }

    // Fetch all programs from the database in a specific faculty and department
    const allPrograms = await Program.find({
      faculty: facultyId,
      department: departmentId,
    });

    res.status(200).json({
      status: "success",
      data: {
        programs: allPrograms,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Error retrieving programs from the database",
    });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const departmentId = req.params.departmentId;
    const programId = req.params.programId; // Assuming you have programId in the URL

    if (!facultyId || !departmentId || !programId) {
      return res.status(400).json({
        status: "fail",
        message: "Faculty ID, Department ID, and Program ID must be provided",
      });
    }

    const deletedProgram = await Program.findByIdAndDelete(programId);

    if (!deletedProgram) {
      return res.status(404).json({
        status: "fail",
        message: "Program not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Program deleted successfully",
      data: {
        program: deletedProgram,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.updateProgram = async (req, res) => {
  try {
    const { name, competences, programHead, qualityCoordinator } = req.body;
    const facultyId = req.params.facultyId;
    const departmentId = req.params.departmentId;
    const programId = req.params.programId; // Assuming you have programId in the URL

    if (!facultyId || !departmentId || !programId) {
      return res.status(400).json({
        status: "fail",
        message: "Program must have a facultyId, departmentId, and programId",
      });
    }

    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      {
        name,
        faculty: facultyId,
        department: departmentId,
        competences,
        programHead,
        qualityCoordinator,
      },
      { new: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({
        status: "fail",
        message: "Program not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        program: updatedProgram,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const departmentId = req.params.departmentId;
    const programId = req.params.programId; // Assuming you have programId in the URL

    if (!facultyId || !departmentId || !programId) {
      return res.status(400).json({
        status: "fail",
        message: "Faculty ID, Department ID, and Program ID must be provided",
      });
    }

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({
        status: "fail",
        message: "Program not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        program: program,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllProgramsCount = async (req, res, next) => {
  try {
    // Query the database for all programs
    const count = await Program.countDocuments();

    // Send the count as a response
    res.status(200).json({
      status: "success",
      count: count,
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.calculateLOCoverage = async (req, res) => {
  try {
    const { programId } = req.params;

    // Fetch the program
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Fetch courses related to the program
    const courses = await Course.find({ program: programId });

    // Aggregated coverage map for LOs
    const loCoverageMap = new Map();

    // Iterate through each course to gather LO coverages
    courses.forEach((course) => {
      course.learningOutcomeTotalCoverage.forEach((loCoverage) => {
        const loId = loCoverage.id.toString();
        if (!loCoverageMap.has(loId)) {
          loCoverageMap.set(loId, { totalCoverage: 0, count: 0 });
        }
        const currentCoverage = loCoverageMap.get(loId);
        currentCoverage.totalCoverage += loCoverage.coverage;
        currentCoverage.count += 1;
      });
    });

    // Calculate average coverage for each LO and store results
    const aggregatedLOs = [];
    loCoverageMap.forEach((value, key) => {
      aggregatedLOs.push({
        id: key,
        coverage: value.totalCoverage / value.count,
      });
    });

    // Update the program with the new aggregated LOs
    program.totalLOs = aggregatedLOs;
    await program.save();

    res
      .status(200)
      .json({
        message: "LO coverage calculated successfully",
        totalLOs: aggregatedLOs,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
