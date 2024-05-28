const express = require('express');
const router = express.Router();
const CompInfoController = require('../controllers/CompInfoController');

// Route to get specific competences based on provided IDs
router.post('/competencesinfo', CompInfoController.getInfoCompetences);

module.exports = router;
