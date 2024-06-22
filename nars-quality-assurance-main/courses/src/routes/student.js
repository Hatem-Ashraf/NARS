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
  .route("/allStudentUnderCourse/:courseId")
  .get(studentController.getStudentsByCourseId);

router
  .route("/studentGrade")
  .patch(studentController.updateAssessmentGradesForCourse);
router.route("/assign-grades/:id").post(studentController.assignGrades);
router
  .route("/grade-distribution/:id")
  .get(studentController.calculateGradeDistributionForCourse);
router.get(
  "/assessment-results/:courseId",
  studentController.getAssessmentResults
);
router.get(
  "/calculateLOCoverage/:courseId",
  studentController.calculateLOCoverage
);

module.exports = router;
