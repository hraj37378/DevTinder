const express = require("express");
const connectDb = require("./src/config/database");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json()); // middleware to convert the incoming JSON object to javascript object
app.use(cookieParser());

const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const connectionRequestRouter = require("./src/routes/connectionRequest");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);

connectDb()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server running on PORT:", 3000);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err.message);
  });
