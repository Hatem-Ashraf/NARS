const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Course = require('../models/Course');

exports.lo_coverage_by_program = async (req, res) => {
  try {
    const programId = req.params.programId;
    const { coverageResults, totalCoveragePercentage } = await Topic.calculateLearningOutcomeCoverageByProgram(programId);

    // Update all courses in the program with the calculated coverage results
    await Course.updateMany(
      { program: programId },
      { $set: { learningOutcomeCoverage: coverageResults } }
    );

    res.json({ coverageResults, totalCoveragePercentage });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while calculating coverage.');
  }
};

// Define the route
//router.get('/programs/:programId/learning-outcome-coverage', exports.lo_coverage_by_program);

module.exports = router;

const express = require('express');
const { getLOCoverageByProgram } = require('../controllers/los'); // Adjust the path as necessary

// Define the route for getting LO coverage by program ID
router.get('/:programId/lo-coverage', getLOCoverageByProgram);

module.exports = router;
