const express = require("express");
const competencesController = require("../controllers/competencesController");

const router = express.Router();

router.get("/faculty/:facultyId", competencesController.getAll);

router.post("/faculty/:facultyId", competencesController.addCompetences);

router.get("/faculty/:facultyId/level/:level", competencesController.getAllByLevel);


router.get("/compId/:id", competencesController.getOne)
    .patch("/compId/:id", competencesController.updateOne)
    .delete("/compId/:id", competencesController.deleteOne);



module.exports = router;
