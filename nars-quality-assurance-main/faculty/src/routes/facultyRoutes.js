const express = require("express");
const facultyController = require("../controllers/facultyController");
const { protect } = require("../shared/middlewares/protectMiddleware");
const { restrictTo } = require("../shared/middlewares/restrictMiddleware");
const router = express.Router();
router.route("/getFacultySummary/:id").get(facultyController.getFacultySummary);

router.route("/faculty-count").get(facultyController.getAllFacultiesCount);

router
  .route("/")
  .get(protect, facultyController.getAllFaculties)
  .post(protect, facultyController.createFaculty);

router
  .route("/:id")
  .get(protect, facultyController.getFaculty)
  .patch(protect, facultyController.updateFaculty)
  .delete(
    protect,

    facultyController.deletefaculty
  );

module.exports = router;
