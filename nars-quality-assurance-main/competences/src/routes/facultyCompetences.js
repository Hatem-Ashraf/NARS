const express = require("express");
const facultyCompetencesController = require("../controllers/facultyCompetences");

const router = express.Router();
router.post("/facultyComp", facultyCompetencesController.createFacultyComp);
router.get("/facultyComp",facultyCompetencesController.getAllFacultyCompetences);
router.get("/facultyComp/:id",facultyCompetencesController.getFacultyCompetenceById);
router.delete("/deleteFacultyComp/:id",facultyCompetencesController.deleteFacultyCompetence);
router.put("/updateFacultyComp/:id",facultyCompetencesController.updateFacultyCompetence);
module.exports = router;