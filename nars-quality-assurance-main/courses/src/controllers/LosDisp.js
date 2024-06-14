const mongoose = require('mongoose');
const Program = require('../models/Program'); 
const Topic = require('../models/Topic');     

exports.getLOCoverageByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    // Validate programId
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({ error: 'Invalid program ID' });
    }

    // Find the program by ID
    const program = await Program.findById(programId).populate('courses');
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // Iterate over each course and calculate LO coverage
    const courseCoveragePromises = program.courses.map(async (course) => {
      const coverageResult = await Topic.calculateLearningOutcomeCoverage(course._id);
      return {
        courseId: course._id,
        courseName: course.name, // Assuming course model has a name field
        learningOutcomeCoverage: coverageResult
      };
    });

    const courseCoverages = await Promise.all(courseCoveragePromises);

    // Respond with the LO coverage for each course
    res.status(200).json({ programId, courseCoverages });
  } catch (error) {
    console.error('Error fetching LO coverage by program:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
