const express = require('express');
const router = express.Router();
const dispLos = require('../controllers/dispLos');

// Route to get LOs by Course ID
router.get('/los/program/:programId', getLosByProgramId);

module.exports = router;