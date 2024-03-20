const express = require("express");
const departmentCompetencesController = require("../controllers/departmentCompetences");

const router = express.Router();
router.post("/departmentComp", departmentCompetencesController.createDepartmentComp);
router.get("/departmentComp",departmentCompetencesController.getAllDepartmentCompetences);
router.get("/departmentComp/:id",departmentCompetencesController.getDepartmentCompetenceById);
router.delete("/deleteDepComp/:id",departmentCompetencesController.deleteDepartmentCompetence);
router.put("/updateDepComp/:id",departmentCompetencesController.updateDepartmentCompetence);
module.exports = router;