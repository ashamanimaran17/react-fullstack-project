require("dotenv").config(); //Dotenv loads environment variables from a .env file into process.env
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth-route");
var app = express();
app.use(express.json()); //express.json() is a built-in middleware function in Express that parses incoming requests with JSON payloads. Without it, the request body would be undefined
app.use(express.urlencoded()); //express.urlencoded() is a middleware function in Express.js used to parse incoming requests with URL-encoded payloads. It decodes the URL-encoded data in the request body and makes it available in the req.body object. This is commonly used when handling form submissions or data sent via the application/x-www-form-urlencoded content type
app.get("/", (req, res) => {
  res.send("Fullstack react course");
});
app.post("/name", (req, res) => {
  if (req.body.name) {
    console.log("req", req);
    res.send({ name: req.body.name });
  } else {
    res.status(400).json({
      error: "No name provided",
    });
  }
});
app.use("/auth", authRoute);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to mongodb");
    app.listen(process.env.PORT, () => {
      console.log(`app is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
