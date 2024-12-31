const express = require("express");
const connectDb = require("./src/config/database");
const User = require("./src/models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Dhoni",
    emailId: "virat@dhoni.com",
    password: "Virat@123",
  };
  // creating a new instance of User model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: ", err.message);
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
