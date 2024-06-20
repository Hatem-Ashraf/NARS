const crypto = require("crypto");
const { promisify } = require("util");
const JWT = require("jsonwebtoken");
const Student = require("../models/studentModel");
const Staff = require("../models/staffModel");
const catchAsync = require("../shared/utils/catchAsync");
const AppError = require("../shared/utils/appError");
const sendEmail = require("../shared/utils/email");

const signToken = (id, role) => {
  return JWT.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id, user.roles[0]);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user =
    (await Staff.findOne({ email: req.body.email })) ||
    (await Student.findOne({ email: req.body.email }));
  if (!user) {
    return next(new AppError("there is no user with email address", 404));
  }

  const verifyCode = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const message = `forgot your Password? your reset password code is `;
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token (Valid for 10m)",
      message,
      verifyCode,
    });

    res.status(200).json({
      status: "success",
      message: "token sent to mail",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("there aws an error sending the email. try again later", 500)
    );
  }
});

exports.verifyCode = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.verifyCode)
    .digest("hex");

  const user =
    (await Staff.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    })) ||
    (await Student.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    }));

  if (!user) {
    return next(new AppError("code is invalid or has expired", 400));
  }
  res.status(200).json({
    status: "success",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.verifyCode)
    .digest("hex");

  const user =
    (await Staff.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    })) ||
    (await Student.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    }));

  if (!user) {
    return next(new AppError("code is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, req, res);
});

exports.signupWithEmail = catchAsync(async (req, res, next) => {
  // Find the user in either the Staff or Student collection by email
  const user =
    (await Staff.findOne({ email: req.body.email })) ||
    (await Student.findOne({ email: req.body.email }));

  // If no user is found, return an error
  if (!user)
    return next(
      new AppError(
        `There is no user with this => ${req.body.email} email address`,
        404
      )
    );

  // If the user already has a password, it means they have already signed up
  if (user.password) {
    return next(new AppError(`That email is already signed up`, 404));
  }

  // Generate verification code
  const verifyCode = user.createPasswordResetToken();

  // Log verification code in console
  console.log("Verification Code:", verifyCode);

  // Save user without validation
  await user.save({ validateBeforeSave: false });

  // Respond with success message
  res.status(200).json({
    status: "success",
    message: "Code sent to email",
  });

  const message = `Your verification code: ${verifyCode}. Please copy this code to verify your account.`;
});

exports.completeSignup = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.verifyCode)
    .digest("hex");

  const user =
    (await Staff.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    })) ||
    (await Student.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gte: Date.now() },
    }));

  if (!user) {
    return next(new AppError("code is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new AppError("Please provide email, password, and role!", 400));
  }

  // Search for users in the Staff collection based on the role
  let user;
  if (role === "student") {
    user = await Student.findOne({ email }).select("+password");
  } else {
    user = await Staff.findOne({ email, roles: role }).select("+password");
  }

  if (!user) {
    return next(new AppError("Incorrect email, password, or role", 401));
  }

  const correctPassword = await user.correctPassword(password, user.password);

  if (!correctPassword) {
    return next(new AppError("Incorrect email, password, or role", 401));
  }

  // If everything is ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists and role matches
  const staffUser = await Staff.findById(decoded.id);
  const studentUser = await Student.findById(decoded.id);
  if (!staffUser && !studentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  const currentUser = staffUser ? staffUser : studentUser;

  // Check if the role matches
  if (decoded.role !== currentUser.roles[0]) {
    return next(new AppError("Role mismatch! Please log in again.", 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.chagesPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles[0])) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.protectRequest = catchAsync(async (req, res, next) => {
  const id = req.body.id;

  // 3) Check if user still exists
  const staffUser = await Staff.findById(id);
  const studentUser = await Student.findById(id);
  if (!staffUser && !studentUser) {
    res.status(200).json({
      status: false,
      message: "The user belonging to this token does no longer exist",
      code: 401,
    });
  }
  const currentUser = staffUser ? staffUser : studentUser;

  res.status(200).json({
    status: true,
    user: currentUser,
  });
});

exports.restrictRequest = catchAsync(async (req, res, next) => {
  console.log("roles are " + req.body.roles);
  const id = req.body.id;
  const roles = req.body.roles;
  const userRole = req.body.userRole;
  if (!roles.includes(userRole)) {
    res.status(200).json({
      status: false,
      message: "You do not have permission to perform this action",
      code: 403,
    });
  }

  const staffUser = await Staff.findById(id);
  if (!staffUser || !roles.includes(staffUser.role)) {
    res.status(200).json({
      status: false,
      message: "You do not have permission to perform this action",
      code: 403,
    });
  }
  res.status(200).json({
    status: true,
  });
});

exports.userToken = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("no token found", 401));
  }

  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  const staffUser = await Staff.findById(decoded.id);
  const studentUser = await Student.findById(decoded.id);
  if (!staffUser && !studentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  const currentUser = staffUser ? staffUser : studentUser;

  if (currentUser.chagesPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed password please log in again", 401)
    );
  }
  res.status(200).json({
    status: "success",
    data: currentUser,
  });
});
