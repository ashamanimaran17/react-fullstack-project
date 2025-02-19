const isEmpty = require("./emptyValidator");
const validator = require("validator");
const validateRegisterUser = (user) => {
  let error = {};
  let isValid = true;
  if (isEmpty(user.name)) {
    error.name = "Name cannot be empty";
  } else if (!validator.isLength(user.name, { min: 2, max: 20 })) {
    error.name = "Name should be greater than 2 chars and less than 20 chars";
  }
  if (isEmpty(user.email)) {
    error.email = "email cannot be empty";
  } else if (!validator.isEmail(user.email)) {
    error.email = "email is not valid";
  }
  if (isEmpty(user.password)) {
    error.password = "Password cannot be empty";
  } else if (!validator.isLength(user.password, { min: 6, max: 50 })) {
    error.password =
      "Password should be greater than 2 chars and less than 20 chars";
  }
  if (isEmpty(user.confirmPassword)) {
    error.confirmPassword = "confirmPassword cannot be empty";
  } else if (!validator.equals(user.password, user.confirmPassword)) {
    error.confirmPassword = "confirmPassword does not match with password";
  }
  if (!isEmpty(error)) {
    isValid = false;
  }
  return {
    error,
    isValid,
  };
};
module.exports = validateRegisterUser;
