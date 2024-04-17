const studentController = require("../controllers/student");
const express = require("express");
const router = express.Router();
router
  .route("/student")
  .post(studentController.createStudent)
  .get(studentController.getAllStudents);
router
  .route("/student/:id")
  .get(studentController.getStudentById)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

router
  .route("/studentGrade")
  .patch(studentController.updateAssessmentGradesForCourse);

module.exports = router;
