const express = require("express");
const marksController = require("../controllers/marksController");
const router = express.Router({ mergeParams: true });

// Route for retrieving all marks for a given course
router.route("/")
  .get(marksController.getAllMarks)
  .post(marksController.addAllStudentMarks);

// Route for retrieving marks for a specific student in a course and adding marks for a specific student
router.route("/:studentId")
  .get(marksController.getStudentMarks)
  //.post(marksController.addStudentMarks)
  .patch(marksController.updateStudentMarks);

module.exports = router;
