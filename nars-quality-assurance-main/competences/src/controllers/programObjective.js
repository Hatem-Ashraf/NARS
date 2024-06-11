const ProgramObjective = require("../models/programObjective");
const catchAsync = require("../shared/utils/catchAsync");

//add program competence
exports.createProgramObjective = catchAsync( async (req, res, next) => {
  if (!req.params.facultyId) {
    return next(new AppError("Please provide a faculty id", 400));
  }
  if (!req.body) {
    return next(new AppError("Please provide a body", 400));
  }

  const programObjectives = req.body.map(proObj => ({
      code: proObj.code,
      description: proObj.description,
      faculty: req.params.facultyId
  }));

  const docs = await ProgramObjective.insertMany(programObjectives);

  res.status(201).json({
  status: "success",
  data: docs,
  });

} )

exports.getAllProgramObjectives = catchAsync( async(req, res, next) => {
  if (!req.params.facultyId) {
    return next(new AppError("Please provide a faculty id", 400));
  }
  const programObjectives = await ProgramObjective.find({ faculty: req.params.facultyId });
  res.status(200).json({
  status: "success",
  data: programObjectives,
  });
} )

exports.deleteOne = catchAsync(async (req, res, next) => {
  const doc = await ProgramObjective.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const doc = await ProgramObjective.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.getOne = catchAsync(async (req, res, next) => {

  const doc = await ProgramObjective.findById(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: doc,
  });
})
