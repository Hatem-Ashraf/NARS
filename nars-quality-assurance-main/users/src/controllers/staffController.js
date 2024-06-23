const Staff = require("../models/staffModel");
const Student = require("../models/studentModel");
const factory = require("./../shared/controllers/handlerFactory");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../shared/utils/catchAsync");
const AppError = require("./../shared/utils/appError");
const multer = require("multer");
const { Kafka } = require("kafkajs");
const path = require("path");
const axios = require("axios");
const student = require("../models/studentModel");
const kafka = new Kafka({
  clientId: "my-app",
  brokers: process.env.KAFKA_ZOOKEEPER_CONNECT,
});
const consumer = kafka.consumer({ groupId: "group-1" });

// exports.getAllStaffMembers = factory.getAll(Staff);
exports.deleteStaff = factory.deleteOne(Staff);
exports.updateStaff = factory.updateOne(Staff);
exports.getStaff = factory.getOne(Staff);
exports.createStaff = factory.createOne(Staff);
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `/${__dirname}/../public/photos/`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "about");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await Staff.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

//finds all staff members to a certain role like get all instructors for example
exports.getCertainStaffMembers = catchAsync(async (req, res, next) => {
  const staff = await Staff.find({
    role: req.body.role,
  });

  res.status(200).json({
    status: "success",
    results: staff.length,
    data: staff,
  });
});

exports.updateStaffCourses = catchAsync(async (req, res, next) => {
  const course = req.body.courseId;
  const instructor = req.body.instructorId;
  console.log("HHHHHHHHHHHHHHHHHHHHHHelleo over here " + course);

  var updatedStaff = await Staff.findByIdAndUpdate(
    instructor,
    {
      $addToSet: {
        courses: course,
      },
    },
    {
      new: true, //return updated document
      runValidators: true,
    }
  );

  if (!updatedStaff) {
    res.json({
      status: false,
      message: "Staff member is not found",
      code: 403,
    });
  } else {
    res.json({
      status: true,
      message: "Staff member is updated",
      code: 201,
      staff: updatedStaff,
    });
  }
});
exports.getStaffPhoto = catchAsync(async (req, res, next) => {
  let query = Staff.findById(req.params.id);
  //if (popOptions) query = query.populate(popOptions);
  const staff = await query;

  if (!staff) {
    return next(new AppError("No document found with that id", 404));
  }
  res.download(path.resolve(`/${__dirname}/../public/photos/${staff.photo}`));
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const staff = await Staff.findById(req.params.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (
    !(await staff.correctPassword(req.body.passwordCurrent, staff.password))
  ) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  staff.password = req.body.password;
  staff.passwordConfirm = req.body.passwordConfirm;
  await staff.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(staff, 200, req, res);
});

updateCourseInstructorConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_ASSIGN_COURSE_TOPIC,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message);
      this.updateStaffCourses();
    },
  });
};
exports.addStudentsToProgram = catchAsync(async (req, res, next) => {
  const codes = req.body.codes;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  const header = `authorization: Bearer ${token}`;
  const program = await axios
    .get(`http://programs:8080/getProgramSummary/${req.body.program}`, {
      headers: header,
    })
    .then((res) => res.data)
    .catch((e) => e.response.data);
  if (program.status === "fail") {
    return next(new AppError(program.message, program.code));
  }
  for (let i = 0; i < codes.length; i++) {
    const student = await Student.find({ code: codes[i] });
    if (!student)
      return next(new AppError("No document found with that id", 404));
    await Student.findByIdAndUpdate(
      student[0]._id,
      {
        program: req.body.program,
      },
      {
        new: true, //return updated document
        runValidators: true,
      }
    );
  }
  res.status(200).json({
    status: "success",
  });
});

exports.addStudentsToDepartment = catchAsync(async (req, res, next) => {
  const codes = req.body.codes;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  const header = `authorization: Bearer ${token}`;
  const department = await axios
    .get(
      `http://departments:8080/getDepartmentSummary/${req.body.department}`,
      {
        headers: header,
      }
    )
    .then((res) => res.data)
    .catch((e) => e.response.data);
  if (department.status === "fail") {
    return next(new AppError(department.message, department.code));
  }
  for (let i = 0; i < codes.length; i++) {
    const student = await Student.find({ code: codes[i] });
    if (!student)
      return next(
        new AppError(`No student  found with that code ${codes[i]}`, 404)
      );
    await Student.findByIdAndUpdate(
      student[0]._id,
      {
        department: req.body.department,
      },
      {
        new: true, //return updated document
        runValidators: true,
      }
    );
  }
  res.status(200).json({
    status: "success",
  });
});

updateCourseInstructorConsumer().catch(console.log);

exports.addStaffRole = catchAsync(async (req, res, next) => {
  if (!req.body.roles) {
    return next(new AppError("you should choose role", 404));
  }
  const doc = await Staff.findByIdAndUpdate(
    req.params.id,
    { $push: { roles: req.body.roles } },
    {
      new: true, //return updated document
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }

  res.status(200).json({
    status: "success",

    data: doc,
  });
});
exports.deleteStaffRole = catchAsync(async (req, res, next) => {
  if (!req.body.roles) {
    return next(new AppError("you should choose role", 404));
  }
  const doc = await Staff.findByIdAndUpdate(
    req.params.id,
    {
      $pullAll: {
        roles: req.body.roles,
      },
    },
    {
      new: true, //return updated document
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }

  res.status(200).json({
    status: "success",

    data: doc,
  });
});

exports.getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await Staff.find({ roles: "instructor" });
    res.status(200).json({
      status: "success",
      data: instructors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching instructors.",
    });
  }
};
exports.getStaffMemberById = catchAsync(async (req, res, next) => {
  const doc = await Staff.findById(req.params.id);
  if (!doc) {
    return next(new AppError("No document found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.getCoursesByStaffMemberId = catchAsync(async (req, res, next) => {
  const staffMember = await Staff.findById(req.params.staffId);
  if (!staffMember) {
    return next(new AppError("No staff member found with that id", 404));
  }
  if (!staffMember.courses || staffMember.courses.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No courses found for this staff member",
      data: [],
    });
  }
  res.status(200).json({
    status: "success",
    data: staffMember.courses,
  });
});

exports.newDepartmentAdmin = async (req, res) => {
  try {
    const { name, email, faculty, department, roles } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !faculty || !department || !roles) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide name, email, faculty, roles",
      });
    }

    // Create a new staff member
    const newStaff = await Staff.create({
      name,
      email,
      faculty,
      department,
      roles,
    });

    res.status(201).json({
      status: "success",
      data: {
        staff: newStaff,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.newProgramAdmin = async (req, res) => {
  try {
    const { name, email, faculty, department, program, roles } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !faculty || !department || !program || !roles) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide name, email, faculty, department, roles",
      });
    }

    // Create a new staff member
    const newStaff = await Staff.create({
      name,
      email,
      faculty,
      department,
      program,
      roles,
    });

    res.status(201).json({
      status: "success",
      data: {
        staff: newStaff,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.newInstructor = async (req, res) => {
  try {
    const { name, email, faculty, department, roles, program } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !faculty || !department || !roles || !program) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide name, email, faculty, department, roles, and program.",
      });
    }

    // Create a new staff member
    const newStaff = await Staff.create({
      name,
      email,
      faculty,
      department,
      roles,
      program,
    });

    res.status(201).json({
      status: "success",
      data: {
        staff: newStaff,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

//Program Quality Coordinator
exports.newProgramQualityCoordinator = async (req, res) => {
  try {
    const { name, email, faculty, department, roles, program } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !faculty || !department || !roles || !program) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide name, email, faculty, department, roles, and program.",
      });
    }

    // Create a new staff member
    const newStaff = await Staff.create({
      name,
      email,
      faculty,
      department,
      roles,
      program,
    });

    res.status(201).json({
      status: "success",
      data: {
        staff: newStaff,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.newQualityCoordinator = async (req, res) => {
  try {
    const { name, email, faculty, roles } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !faculty || !roles) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide name, email, faculty, department, roles, and program.",
      });
    }

    // Create a new staff member
    const newStaff = await Staff.create({
      name,
      email,
      faculty,

      roles,
    });

    res.status(201).json({
      status: "success",
      data: {
        staff: newStaff,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

//Create new dean
exports.newDean = catchAsync(async (req, res) => {
  const { name, email, faculty, roles } = req.body;
  const newStaff = await Staff.create({
    name,
    email,
    faculty,
    roles,
  });
  res.status(201).json({
    status: "success",
    data: {
      staff: newStaff,
    },
  });
});

exports.getAllDepartmentAdmins = catchAsync(async (req, res, next) => {
  const { facultyId } = req.body;

  if (!facultyId)
    return next(new AppError("Please provide a valid faculty id", 400));

  const staff = await Staff.find({
    roles: "department admin",
    faculty: facultyId,
  });
  res.status(200).json({
    status: "success",
    results: staff.length,
    data: {
      staff,
    },
  });
});

exports.getAllProgramAdmins = catchAsync(async (req, res, next) => {
  const { facultyId, departmentId } = req.body;
  if (!facultyId || !departmentId)
    return next(
      new AppError("Please provide a valid faculty id and department id", 400)
    );
  const staff = await Staff.find({
    roles: "program admin",
    department: departmentId,
  });
  res.status(200).json({
    status: "success",
    results: staff.length,
    data: {
      staff,
    },
  });
});

exports.getAllStaffMembers = catchAsync(async (req, res, next) => {
  const staff = await Staff.find();
  res.status(200).json({
    status: "success",
    results: staff.length,
    data: {
      staff,
    },
  });
});


exports.DeleteOneStaff = catchAsync(async (req, res, next) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      staff,
    },
  });
  
});



exports.getAllStaffCount = async (req, res, next) => {
  try {
    // Query the database for all staff members
    const count = await Staff.countDocuments();

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
