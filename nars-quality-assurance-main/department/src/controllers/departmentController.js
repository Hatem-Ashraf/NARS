const Department = require("../models/departmentModel");
const factory = require("./../shared/controllers/handlerFactory");
const catchAsync = require("./../shared/utils/catchAsync");
const AppError = require("./../shared/utils/appError");
const axios = require("axios");

exports.getAllDepartments = factory.getAll(Department);
exports.deleteDepartment = factory.deleteOne(Department);
exports.getDepartmentSummary = factory.getOne(Department);
// exports.updateDepartment = factory.updateOne(Department);

exports.createDepartment = catchAsync(async (req, res, next) => {
  try {
    const { name, code, about, departmentHead, competences, facultyId, vision, mission } = req.body;
    const department = await Department.create({
      name,
      code,
      about,
      departmentHead,
      competences, 
      facultyId,
      vision,
      mission
    });
    res.status(201).json({
      status: "success",
      data: department,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message 
    });
  }
});


exports.getDepartment = catchAsync(async (req, res, next) => {
  let query = Department.findById(req.params.id);
  const doc = await query;

  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  const header = `authorization: Bearer ${req.cookies.jwt}`;

  const faculty = await axios
    .get(`http://faculty:8080/getFacultySummary/${doc.facultyId}`, {
      headers: header,
    })
    .then((res) => res.data)
    .catch((e) => {
      return {
        status: false,
        message: "something went wrong",
        code: 500,
      };
    });

  doc.faculty = faculty.data.name;

  res.status(200).json({
    status: "success",

    data: doc,
  });
});


exports.getDepartmentsByFaculty = catchAsync(async (req, res, next) => {
  try {
    const { facultyId } = req.params;
    const departments = await Department.find({ facultyId: facultyId });
    if (departments.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No departments found for the given faculty ID.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: departments
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching departments.'
    });
  }
});



exports.searchDepartmentByCode = catchAsync(async (req, res, next) => {
  try {
    const { facultyId, code } = req.query;
    const department = await Department.findOne({ facultyId, code });

    if (!department) {
      return res.status(404).json({
        status: 'error',
        message: 'Department not found in the specified faculty for the given code.'
      });
    }

    res.status(200).json({
      status: 'success',
      data: department
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while searching for the department.'
    });
  }
});

exports.getDepartmentsByFaculties = catchAsync(async (req, res, next) => {
  try {
    const { facultyIds } = req.body;
    
    // Fetch departments for each faculty ID
    const departmentsByFaculty = await Promise.all(facultyIds.map(async (facultyId) => {
      const departments = await Department.find({ facultyId });
      return { facultyId, departments };
    }));

    const response = departmentsByFaculty.map(({ facultyId, departments }) => {
      if (departments.length === 0) {
        return {
          facultyId,
          status: 'error',
          message: 'No departments found for the given faculty ID.'
        };
      } else {
        return {
          facultyId,
          status: 'success',
          data: departments
        };
      }
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching departments.'
    });
  }
});

exports.updateDepartment = catchAsync(async (req, res, next) => {
  const { name, code, about, departmentHead, competences, facultyId, vision, mission } = req.body;
  const department = await Department.findByIdAndUpdate(req.params.id, {
    name,
    code,
    about,
    departmentHead,
    competences,
    facultyId,
    vision,
    mission
  });
  res.status(200).json({
    status: "success",
    data: department,
  });
})
