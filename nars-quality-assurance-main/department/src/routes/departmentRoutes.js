const express = require("express");
const departmentController = require("../controllers/departmentController");
const { protect } = require("../shared/middlewares/protectMiddleware");
const { restrictTo } = require("../shared/middlewares/restrictMiddleware");
const router = express.Router();
router
  .route("/getDepartmentSummary/:id")
  .get(departmentController.getDepartmentSummary);

router
  .route("/")
  .get(departmentController.getAllDepartments)
  .post(protect, departmentController.createDepartment);

router
  .route("/getDepartmentsByFaculty/:facultyId")
  .get(protect, departmentController.getDepartmentsByFaculty);
router
  .route("/searchDep")
  .get(protect, departmentController.searchDepartmentByCode);

router
  .route("/department-count")
  .get(departmentController.getAllDepartmentsCount);

router
  .route("/:id")
  .get(
    protect,

    departmentController.getDepartment
  )
  .patch(protect, departmentController.updateDepartment)
  .delete(
    protect,

    departmentController.deleteDepartment
  );

module.exports = router;
