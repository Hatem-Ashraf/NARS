const express = require("express");
const courseController = require("../controllers/courseController");
const directAssesmentController = require("../controllers/directAssesmentController");
const { protect } = require("../shared/middlewares/protectMiddleware");
const { restrictTo } = require("../shared/middlewares/restrictMiddleware");

const router = express.Router();

router
  .route("/specsPdf")
  .post(courseController.uploadSpcsPdf, courseController.addSpcsPdf);
router.route("/specsPdf/:id").get(courseController.getSpecsPdf);

router.route("/viewComp/:id").get(protect, courseController.viewComp);
// #####################################

router.route("/newCourse")
.post(protect,courseController.createNewCourse)
.get(protect,courseController.getAllNewCourses);


router.route("/newCourse/faculty/:facultyId")
.get(protect,courseController.getAllNewCourses);

router.route("/newCourse/:id")
  .patch(protect,courseController.updateNewCourse)
  .get(protect,courseController.getNewCourse)
  .delete(protect,courseController.deleteNewCourse);
  
router.route("/getCoursesByProgramId/:programId").get(protect,courseController.getCoursesByProgramId);
router.route("/newCourseComp/:courseId").put(protect,courseController.addCompetenciesToCourse);
router.route("/getComp/:courseId").get(protect,courseController.getCompUnderCourse);
router.route("/getCoursesByIds").get(protect,courseController.getCoursesByIds);
//##############################################33
router
  .route("/original-courses")
  .get(protect, courseController.getAllCourses)
  .post(protect, courseController.createCourse);
router.route("/checkComp/:id").post(protect, courseController.checkComp);

router
  .route("/created-courses")
  .get(protect, courseController.getAllCourseInstances)
  .post(protect, courseController.createCourseInstance);

router
  .route("/original-courses/getAllMaterials/:id")
  .get(courseController.getAllMaterials);

router
  .route("/original-courses/uploadMaterials")
  .patch(
    protect,
    courseController.uploadMaterials,
    courseController.addMaterials
  );

router
  .route("/original-courses/getMaterials/:id/:id2")
  .get(courseController.getMaterial);
router
  .route("/original-courses/deleteMaterials/:id/:id2")
  .get(courseController.deleteMaterial);
router
  .route("/original-courses/:id")
  .get(protect, courseController.getCourse)
  .patch(protect, courseController.updateCourse)
  .delete(protect, courseController.deleteCourse);

router
  .route("/created-courses/directAssesments/:id")
  .post(protect, directAssesmentController.addDirectAssesment);
router
  .route("/created-courses/:id")
  .get(protect, courseController.getCourseInstance)
  .patch(protect, courseController.updateCourseInstance);

router
  .route("/assign-course-instructor")
  .patch(protect, courseController.assignCourseInstructor);

router.route("/course-count").get(protect, courseController.getAllCoursesCount);
module.exports = router;
