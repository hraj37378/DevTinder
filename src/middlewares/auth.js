const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  // Read the token from req cookies
  // Validate the token
  // Find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Please enter valid credentials");
    }
    const decodedObj = await jwt.verify(token, "Dev@Tinder@123");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // attaching user to the req object
    next();
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};

module.exports = {
  userAuth,
};
