const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const AppError = require("./shared/utils/appError");
const cookieParser = require("cookie-parser");
const competencesRouter = require("./routes/competencesRouts");
const facultyCompetencesRouter = require("./routes/facultyCompetences");
const depCompetencesRouter = require("./routes/departmentCompetences");
const ProCompetencesRouter = require("./routes/programCompetences");
const programObjectiveRouter = require("./routes/programObjective");
const globalErrorHandler = require("./shared/controllers/errorController");
const cors = require("cors");

const app = express();

app.enable("trust proxy");
app.use(cookieParser());

app.use(express.json());
app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/", competencesRouter);
app.use("/", facultyCompetencesRouter);
app.use("/", depCompetencesRouter);
app.use("/", ProCompetencesRouter);
app.use("/", programObjectiveRouter);
app.all("*", (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server `);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server `, 404));
});

app.use(globalErrorHandler);

module.exports = app;
