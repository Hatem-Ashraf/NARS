const express = require("express");
const programController = require("../controllers/programController");
const { protect } = require("../shared/middlewares/protectMiddleware");
const { restrictTo } = require("../shared/middlewares/restrictMiddleware");
const router = express.Router();

router
  .route("/programSpcs")
  .post(programController.uploadProgramSpcs, programController.addProgramSpcs);
router.route("/programSpcs/:id").get(programController.getProgramSpcs);

router.get("/getProgramSummary/:id", programController.getProgramSummary);
router.route("/viewComp/:id").get(protect, programController.viewComp);
// router
//   .route("/")
//   .post(protect, programController.addProgram)
//   .get(protect, programController.getAllPrograms);

router
  .route("/:facultyId/department/:departmentId")
  .post(protect, programController.addProgram)
  .get(protect, programController.getAllPrograms);

  router
  .route("/getOneProgram/:id")
  .get(protect, programController.getOneProgram)

router
  .route("/:facultyId/department/:departmentId/program/:programId")
  .patch(protect, programController.updateProgram)
  .delete(protect, programController.deleteProgram)
  .get(protect, programController.getProgramById);


router
.route("/facultyPrograms/:facultyId")
.get(protect, programController.getAllProgramsInFaculty);

// router
//   .route("/:id")
// .get(protect, programController.getProgram)
//   .patch(protect, programController.updateProgram)
//   .delete(protect, programController.deleteProgram);

router
  .route("/:id/directAssessment")
  .get(programController.getProgramDirectAssessment);

router.route("/:id/LOS").get(programController.getProgramLOs);

router.route("/program-count").get(programController.getAllProgramsCount);

module.exports = router;
