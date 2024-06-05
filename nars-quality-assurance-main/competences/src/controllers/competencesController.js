const { promisify } = require("util");
const Competences = require("../models/competencesModel");
const catchAsync = require("../shared/utils/catchAsync");
const AppError = require("../shared/utils/appError");
const factory = require("./../shared/controllers/handlerFactory");

// exports.addCompetences = catchAsync(async (req, res, next) => {
    
//     const code =req.body.code;
//     const competences=req.body.competences;
//     let cnt=1
//     const arr=[];
//     for(let i=0;i<competences.length;i++) arr[i]=await Competences.create({code:code+`${cnt++}`,description:competences[i]})
//     const arrid=[]
//     for(let i=0;i<arr.length;i++) arrid[i]=arr[i]._id
//    res.status(201).json({
//     status: "success",
//     ids:arrid
// });
// })
// exports.getAll=catchAsync(async (req, res, next) => {
    
//     const ids=req.body.ids;
//     const view=[]
//     for(let i=0;i<ids.length;i++){
//     const one =await Competences.findById(ids[i]);
//     if(!one){
//    return next(new AppError(`No document found with that ${ids[i]}`, 404))
//     }
//     view[i]=one
//     }
//    res.status(201).json({
//     status: "success",
//     data:view
// });
// })
// exports.updateCompetences = factory.updateOne(Competences)
// exports.deleteOne=factory.deleteOne(Competences)

exports.getAll = catchAsync(async (req, res, next) => {
    if (!req.params.facultyId) {
      return next(new AppError("Please provide a faculty id", 400));
    }
        const competences = await Competences.find({ faculty: req.params.facultyId });
  res.status(200).json({
    status: "success",
    data: competences,
  });
});

//Get one competence
exports.getOne = catchAsync(async (req, res, next) => {

  const doc = await Competences.findById(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: doc,
  });
})

//Add new competences
exports.addCompetences = catchAsync( async (req, res, next) => {

    if (!req.params.facultyId) {
      return next(new AppError("Please provide a faculty id", 400));
    }
    if (!req.body) {
      return next(new AppError("Please provide a body", 400));
    }
    const competences = req.body.map(facultyComp => ({
        code: facultyComp.code,
        description: facultyComp.description,
        level: facultyComp.level,
        faculty: req.params.facultyId
    }));
    const docs = await Competences.insertMany(competences);

    res.status(201).json({
    status: "success",
    data: docs,
    });

});

//update competence
exports.updateOne = catchAsync(async (req, res, next) => {
  const doc = await Competences.findByIdAndUpdate(req.params.id, req.body, {
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

//delete one competence
exports.deleteOne = catchAsync(async (req, res, next) => {
  const doc = await Competences.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
