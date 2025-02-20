const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterUser = require("../validators/registerUserValidator");
const jwt = require("jsonwebtoken");
const protected = require("../middlewares/protected");
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
    const { password, ...createdUserWithoutPassword } = createdUser._doc;
    res.status(201).json(createdUserWithoutPassword);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});
router.post("/login", async (req, res) => {
  const userFound = await User.findOne({
    email: new RegExp("^" + req.body.email + "$", "i"),
  });
  if (!userFound) {
    return res.status(400).send("Error logging");
  }
  const passwordMatched = await bcrypt.compare(
    req.body.password,
    userFound.password
  );
  if (passwordMatched) {
    //send a cookie with auth_token generated from userId
    const userId = userFound._id;
    const cookie = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("access-token", cookie, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    const userCopy = userFound._doc;
    delete userCopy.password;
    return res.send({ token: cookie, user: userCopy });
  } else {
    return res.status(400).send({ isMatch: false });
  }
});
router.get("/currentUser", protected, (req, res) => {
  res.send(res.user);
});
module.exports = router;
