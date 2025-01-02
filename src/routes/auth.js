const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateLoginData, validateSignupData } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
      // validation of data
      validateSignupData(req);
  
      const { firstName, lastName, emailId, password } = req.body;
      // encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
      console.log(passwordHash);
  
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      }); // creating a new instance of User model
      await user.save();
      res.send("User Added Successfully");
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
      validateLoginData(req);
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid) {
        throw new Error("Password doesn't match");
      }
      // Create a JWT token
      const token = await user.getJWT();
      // console.log(token);
      //Add the token to cookie and send response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull");
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
});


module.exports = authRouter;