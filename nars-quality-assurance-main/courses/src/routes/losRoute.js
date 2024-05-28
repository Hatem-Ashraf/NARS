const express = require("express");
const losController = require("../controllers/los");
const router = express.Router({ mergeParams: true });

// Route for retrieving all topics for a given course and adding a new topic to the course
router.route("/")
.post(losController.createLos)
.get(losController.getAllLos);

router.route("/mulLos").get(losController.getMulLoById);
router.route("/:id")
.put(losController.updateLos)
.get(losController.getLosById)
.delete(losController.deleteLos);
router.route("/:domain")
.get(losController.getAllLosByDomain);
module.exports = router;
