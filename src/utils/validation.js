const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is invalid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

const validateUpdateProfileData = (req) => {
  const allowedEditFields = [
    "imageUrl",
    "skills",
    "about",
    "age"
  ];
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
  const { age, imageUrl, skills, about } = req.body;
  if (!age) {
    throw new Error("Age is invalid");
  } else if (!validator.isURL(imageUrl)) {
    throw new Error("URL is  invalid");
  } else if (!skills) {
    throw new Error("Skills are invalid");
  } else if(!about) {
    throw new Error("About is invalid");
  }
  return isEditAllowed;
};

module.exports = {
  validateSignupData,
  validateLoginData,
  validateUpdateProfileData
};
