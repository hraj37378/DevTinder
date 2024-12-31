const express = require("express");
const connectDb = require("./src/config/database");
const User = require("./src/models/user");
const app = express();
// middleware to convert the incoming JSON object to javascript object
app.use(express.json());

app.post("/signup", async(req, res) => {
  const userObj = req.body;
  // creating a new instance of User model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: ", err.message);
  }
});

// find user
app.get("/user", async(req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async(req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
    res.status(400).send("Something went wrong");
    }
});

connectDb()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server running on PORT:", 3000);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
