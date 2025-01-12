const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_DATA = "firstName lastName age gender imageUrl about skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);

    res.json({
      message: "Requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // both toUser of fromUser id to be checked for getting all connection for a particular user
    // because if A -> B or B -> C then for B both A and C are connections.
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    const connectionRequestsData = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.json({
      message: "Connections fetched successfully",
      data: connectionRequestsData,
    });
  } catch (error) {
    res.status(400).json({
      message: "ERROR: " + error.message,
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // user should see all cards in feed except
    // 0. user's own card
    // 1. user's connections
    // 2. user sent requests
    // 3. user ignored requests

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1) * limit;
    
    if(page < 1 || limit < 1 ) {
        throw new Error("Invalid page or limit");
    }
    // find all connection requests sent + received
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // set of user id's of user to be hidden from feed
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});
module.exports = userRouter;
