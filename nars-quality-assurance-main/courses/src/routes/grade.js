const express = require("express");
const gradeController = require("../controllers/grade");
const router = express.Router();

router.route("/")
.post(gradeController.createGrading)
.get(gradeController.getAllGrades);
router.route("/:gradeId")
.put(gradeController.updateGrading)
.get(gradeController.getGradeById)
.delete(gradeController.deleteGrade);
router.route("/gradeUnderProgram/:programId").get(gradeController.getGradesUnderProgram);
module.exports = router;