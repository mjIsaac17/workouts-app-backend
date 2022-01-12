const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tempFile/",
  })
);
app.use(express.static("public"));

//Routes
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/muscle", require("./routes/muscle.routes"));
app.use("/api/exercise", require("./routes/exercise.routes"));
app.use("/api/workout", require("./routes/workout.routes"));

app.set("port", process.env.PORT || 3000);

module.exports = app;
