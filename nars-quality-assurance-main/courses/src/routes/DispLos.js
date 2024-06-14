const express = require('express');
const router = express.Router();
const { getLOCoverageByProgram } = require('../controllers/learningOutcomeController'); // Adjust the path as necessary

// Define the route for getting LO coverage by program ID
router.get('/:programId/lo-coverage', getLOCoverageByProgram);

module.exports = router;
