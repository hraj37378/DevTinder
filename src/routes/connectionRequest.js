const express = require("express");
const {userAuth} = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

connectionRequestRouter.post("/connectionRequest/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored", "interested"];
    
    // if( fromUserId === toUserId) {
    //   throw new Error("You can't send connection request to yourself");
    // }

    if(!allowedStatus.includes(status)){
      throw new Error("Invalid ststus type " + status);
    }
    const toUser = await User.findById(toUserId);
    if(!toUser) {
      throw new Error("User not found");
    }
    // check there's existing connection request
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
      {fromUserId, toUserId},
      {fromUserId: toUserId, toUserId: fromUserId}
    ]
    });

    if(existingConnectionRequest) {
      throw new Error("Connection request already exists");
    }
    // connection request should not be sent more than once
    const ConnectionRequestData = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });
    
    const requestData = await ConnectionRequestData.save();
    res.json({
      message: "Connection request " + status,
      requestData
    });
  } catch (error) {
    res.status(400).json({message: "ERROR:" + error.message})
  }
});

module.exports = connectionRequestRouter;