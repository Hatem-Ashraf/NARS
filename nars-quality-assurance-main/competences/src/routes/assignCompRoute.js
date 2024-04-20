const express = require('express');
const router = express.Router();
const assignCompController = require('../controllers/assignCompetencesController');



router.post('/competences', assignCompController.getSpecificCompetences);

module.exports = router;
