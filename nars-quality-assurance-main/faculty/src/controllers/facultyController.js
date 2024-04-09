const Faculty = require("../models/facultyModel");
const factory = require("./../shared/controllers/handlerFactory");
const catchAsync = require("./../shared/utils/catchAsync");
const AppError = require("./../shared/utils/appError");
const axios = require("axios");
const faculty = require("../models/facultyModel");

exports.getAllFaculties = factory.getAll(Faculty);
exports.deletefaculty = factory.deleteOne(Faculty);
exports.updateFaculty = factory.updateOne(Faculty);
exports.createFaculty = catchAsync(async (req, res, next) => {
  try {
    const facultyData = {
      name: req.body.name,
      dean: req.body.dean,
      about: req.body.about,
      competences: req.body.competences,
    };

    const doc = await Faculty.create(facultyData);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
exports.getFacultySummary = factory.getOne(Faculty);

exports.getFaculty = catchAsync(async (req, res, next) => {
  const header = `authorization: Bearer ${req.cookies.jwt}`;
  const departments = await axios
    .get(`http://department:8080/?faculty=${req.params.id}`, {
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
  if (departments.status === false) {
    return next(new AppError(departments.message, departments.code));
  }

  const departmentsNames = [];

  departments.data.forEach((department) => {
    departmentsNames.push(department.name);
  });
  // console.log(departmentsNames);
  let query = Faculty.findById(req.params.id);
  const doc = await query;

  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  doc.departments = departmentsNames;

  res.status(200).json({
    status: "success",

    data: doc,
  });
});

exports.getAllFacultiesCount = async (req, res, next) => {
  try {
    // Query the database for all faculties
    const count = await Faculty.countDocuments();

    // Send the count as a response
    res.status(200).json({
      status: "success",
      count: count,
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
