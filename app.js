const express = require("express");
const connectDb = require("./src/config/database");
const User = require("./src/models/user");
const app = express();
// middleware to convert the incoming JSON object to javascript object
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;
  // creating a new instance of User model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// find user
app.get("/user", async (req, res) => {
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
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["imageUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    // console.log(user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Update failed " + error.message);
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
