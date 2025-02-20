const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protected = async (req, res, next) => {
  const token = req.cookies["access-token"];
  let authed = false;
  if (token) {
    try {
      const { id } = await jwt.verify(token, process.env.JWT_SECRET);
      try {
        const userFound = await User.findOne({
          _id: id,
        });
        if (userFound) {
          const userCopy = userFound._doc;
          delete userCopy.password;
          res.user = userCopy;
          authed = true;
        }
      } catch {
        authed = false;
      }
    } catch {
      authed = false;
    }
  }
  if (authed) {
    return next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
module.exports = protected;
