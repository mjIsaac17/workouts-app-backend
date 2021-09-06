const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

//Routes
app.use("/api/users", require("./routes/user.routes"));

app.set("port", process.env.PORT || 3000);

module.exports = app;
