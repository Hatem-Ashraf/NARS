const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.MONGO_URL;

mongoose.connect(DB).then(() => {
  console.log("connection done");
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`courses app running on port ${port}`);
});

