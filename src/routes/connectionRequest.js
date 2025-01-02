const express = require("express");
const {userAuth} = require("../middlewares/auth");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  // sending connection request
  res.send(user.firstName + " sent connection request");
});

module.exports = connectionRequestRouter;