const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateUpdateProfileData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
    try{
     if(!validateUpdateProfileData(req)) {
      throw new Error("Invalid fields to update");
     }
     const loggedInUser = req.user;
     Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
     await loggedInUser.save();
     res.send("User profile updated successfully");
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
});

profileRouter.patch("/profile/forgotPassword", async(req, res) => {
  try {
    const { emailId , newPassword } = req.body;
    console.log(req.body);
    if(!emailId || !newPassword) {
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({emailId});
    if(!user) {
      throw new Error("User with this email does not exist");
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Password updated successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;