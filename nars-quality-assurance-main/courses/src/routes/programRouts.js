const express = require("express");
const programController = require("../controllers/programController");

const router = express.Router();

router
  .route("/:facultyId/department/:departmentId")
  .post(programController.addProgram)
  .get(programController.getAllPrograms);

router
  .route("/:facultyId/department/:departmentId/program/:programId")
  .patch(programController.updateProgram)
  .delete(programController.deleteProgram)
  .get(programController.getProgramById);
router
  .route("/calculate-lo-coverage/:programId")
  .get(programController.calculateLOCoverage);
module.exports = router;
