const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterUser = require("../validators/registerUserValidator");
router.get("/test", (req, res) => {
  res.send("auth route working");
});
router.post("/register", async (req, res) => {
  try {
    //check if user object is valid
    const { error, isValid } = validateRegisterUser(req.body);
    if (!isValid) {
      res.status(400).send({
        error,
      });
      return;
    }
    //check if user already exists
    const existingUser = await User.findOne({
      email: new RegExp("^" + req.body.email + "$", "i"),
    });
    if (existingUser) {
      res.status(400).send("user already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    const createdUser = await newUser.save();
    res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
module.exports = router;
