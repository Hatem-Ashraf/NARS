const express = require('express');
const router = express.Router();
const dispLos = require('../controllers/dispLos');

// Route to get LOs by program ID
router.get('/los/program/:programId', dispLos.getLosByProgramId);

module.exports = router;