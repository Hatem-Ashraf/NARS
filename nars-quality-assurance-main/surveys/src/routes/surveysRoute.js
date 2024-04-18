const express = require("express");
const surveyController = require("../controllers/surveyController");
const { protect } = require("../shared/middlewares/protectMiddleware");

const router = express.Router();


router
  .route("/:id")
  .get(surveyController.getSurveyById)
  .delete(surveyController.deleteSurvey)
  .put(surveyController.updateSurvey);

router
  .route("/submissions")
  .post(surveyController.submitSurvey);

router
  .route("/submissions/:surveyId")
  .get(surveyController.getSurveyResponses);
 
router.route("/submissions/average/:surveyId")
.get(surveyController.calculateAverageRatings);

router.route("/submissions/overAllRatingAverage/:surveyId")
.get(surveyController.calculateAverageOverallRating);

router.route("/submissions/:submissionId")
.delete(surveyController.deleteSubmission);

router.route("/")
.post(surveyController.createSurvey)
.get(surveyController.getAllSurveys);
module.exports = router;
