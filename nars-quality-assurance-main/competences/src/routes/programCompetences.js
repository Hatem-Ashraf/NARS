const express = require("express");
const programCompetencesController = require("../controllers/programCompetences");

const router = express.Router();
router.post("/programComp", programCompetencesController.createProgramComp);
router.route("/programComp").get(programCompetencesController.getAllProgramCompetences);

router.get("/allComp", programCompetencesController.getAllCompetences);
router.get(
  "/programComp/:id",
  programCompetencesController.getProgramCompetenceById
);
router.delete(
  "/deleteProComp/:id",
  programCompetencesController.deleteProgramCompetence
);
router.put(
  "/updateProComp/:id",
  programCompetencesController.updateProgramCompetence
);
module.exports = router;
