const express = require("express");
const topicsController = require("../controllers/topics");
const router = express.Router({ mergeParams: true });

// Route for retrieving all topics for a given course and adding a new topic to the course
router.route("/:courseId")
  .post(topicsController.createTopic);
router.route("/").get(topicsController.getAllTopics);
// Route for retrieving details of a specific topic and updating/deleting a specific topic
router.route("/:topicId")
  .get(topicsController.getTopicById)
  .patch(topicsController.updateTopic)
  .delete(topicsController.deleteTopic);
router.route("/getTopicsBycourse/:courseId").get(topicsController.getTopicsByCourse);
module.exports = router;
