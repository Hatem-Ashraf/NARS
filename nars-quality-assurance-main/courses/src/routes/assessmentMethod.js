const express = require("express");
const router = express.Router();
const assessmentMethodController = require("../controllers/assessmentMethod");

// Route to create a new assessment method
router.post(
  "/assessment-methods",
  assessmentMethodController.createAssessmentMethod
);

// Route to get all assessment methods
router.get(
  "/assessment-methods",
  assessmentMethodController.getAllAssessmentMethods
);

// Route to get a single assessment method by ID
router.get(
  "/assessment-methods/:id",
  assessmentMethodController.getAssessmentMethodById
);

// Route to update an existing assessment method
router.put(
  "/assessment-methods/:id",
  assessmentMethodController.updateAssessmentMethod
);

// Route to delete an assessment method
router.delete(
  "/assessment-methods/:id",
  assessmentMethodController.deleteAssessmentMethod
);

module.exports = router;
