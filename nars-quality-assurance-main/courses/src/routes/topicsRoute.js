const express = require("express");
const topicsController = require("../controllers/topicsController");
const router = express.Router({ mergeParams: true });

// Route for retrieving all topics for a given course and adding a new topic to the course
router.route("/")
  .get(topicsController.getAllTopics)
  .post(topicsController.createTopic);

// Route for retrieving details of a specific topic and updating/deleting a specific topic
router.route("/:topicId")
  .get(topicsController.getTopic)
  .patch(topicsController.updateTopic)
  .delete(topicsController.deleteTopic);

module.exports = router;
