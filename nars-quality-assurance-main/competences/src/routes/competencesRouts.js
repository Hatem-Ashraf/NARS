const express = require("express");
const competencesController = require("../controllers/competencesController");

const router = express.Router();

router.get("/faculty/:facultyId", competencesController.getAll);
router.post("/faculty/:facultyId", competencesController.addCompetences);
router.get("/:id", competencesController.getOne);
router.patch("/:id", competencesController.updateOne);
router.delete("/:id", competencesController.deleteOne);


module.exports = router;
