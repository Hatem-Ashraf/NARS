const express = require("express");
const surveyController = require("../controllers/surveyController");
const { protect } = require("../shared/middlewares/protectMiddleware");

const router = express.Router();

router
  .route("/")
  .get(surveyController.getAllSurveys)
  .post(surveyController.addSurvey);

router
  .route("/:id")
  .get(surveyController.getSurveyById)
  .delete(surveyController.deleteSurvey);

router
  .route("/submissions")
  .post(surveyController.addSubmission);

router
  .route("/submissions/:id")
  .get(surveyController.getSurveySubmissions)
  .delete(surveyController.deleteSubmission);

router
  .route("/student-submissions")
  .get(surveyController.getStudentSubmissions);

module.exports = router;
