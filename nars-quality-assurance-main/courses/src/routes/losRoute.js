const express = require("express");
const losController = require("../controllers/los");
const router = express.Router({ mergeParams: true });

// Route for retrieving all topics for a given course and adding a new topic to the course
router.route("/")
.post(losController.createLos)
.get(losController.getAllLosByDomain);

router.route("/mulLos").get(losController.getMulLoById);
router.route("/courses/:courseId").get(losController.getLosByCourseId);
router.route("/all").get(losController.getAllLos);
router.route("/:id")
.put(losController.updateLos)
.get(losController.getLosById)
.delete(losController.deleteLos);
module.exports = router;
