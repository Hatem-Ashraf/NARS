const express = require("express");
const programObjectiveController = require("../controllers/programObjective");

const router = express.Router();
router.post("/programObj", programObjectiveController.createProgramObjective);
router.get("/programObj", programObjectiveController.getAllProgramObjectives);
router.get(
  "/programObj/:id",
  programObjectiveController.getProgramObjectiveById
);
router.delete(
  "/deleteProObj/:id",
  programObjectiveController.deleteProgramObjective
);
router.put(
  "/updateProObj/:id",
  programObjectiveController.updateProgramObjective
);
module.exports = router;
