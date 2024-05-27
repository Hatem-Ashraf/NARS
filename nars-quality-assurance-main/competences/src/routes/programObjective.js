const express = require("express");
const programObjectiveController = require("../controllers/programObjective");

const router = express.Router();
router.post("/programObj/faculty/:facultyId", programObjectiveController.createProgramObjective);
router.get("/programObj/faculty/:facultyId", programObjectiveController.getAllProgramObjectives);
router.get(
  "/programObj/:id",
  programObjectiveController.getOne
);
router.delete(
  "/programObj/:id",
  programObjectiveController.deleteOne
);
router.patch(
  "/programObj/:id",
  programObjectiveController.updateOne
);
module.exports = router;
