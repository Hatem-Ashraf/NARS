const path = require("path");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const AppError = require("./shared/utils/appError");
const cookieParser = require("cookie-parser");
const courseRoute = require("./routes/courseRoute");
const examRoute = require("./routes/examRoutes");
const assignmentRoute = require("./routes/assignmentRoutes");
const assignmentSolutionsRoute = require("./routes/assignmentSolutionsRoutes");
const marksRoute = require("./routes/marksRoutes");
const assessmentMethod = require("./routes/assessmentMethod");
const student = require("./routes/student");
const globalErrorHandler = require("./shared/controllers/errorController");
const topicRoute = require("./routes/topicsRoute");
const losRoute = require("./routes/losRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
const DispLos = require('../controllers/LosDisp');
const { Kafka } = require("kafkajs");

const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.enable("trust proxy");
app.use(cookieParser());
app.use('/:programId/lo-coverage',  DispLos);

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
app.use("/:course/marks", marksRoute);
app.use("/exams", examRoute);
app.use("/assignment", assignmentRoute);
app.use("/assignmentSolution", assignmentSolutionsRoute);
app.use("/", courseRoute);
app.use("/", assessmentMethod);
app.use("/", student);
// app.use("/los/program/:programId", dispLos);
app.use("/topic", topicRoute);
app.use("/los", losRoute);
app.all("*", (req, res, next) => {
  next(
    new AppError(`can't find ${req.originalUrl} on this course server `, 404)
  );
});
mongoose.connect('mongodb://localhost:27017/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((err) => {
  console.error('Database connection error:', err);
});

app.use(globalErrorHandler);

module.exports = app;
