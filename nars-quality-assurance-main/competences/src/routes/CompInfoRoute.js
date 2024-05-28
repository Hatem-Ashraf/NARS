const express = require('express');
const router = express.Router();
const competencesController = require('../controllers/competencesController');

// Route to get specific competences based on provided IDs
router.post('/competencesinfo', competencesController.getInfoCompetences);

module.exports = router;
