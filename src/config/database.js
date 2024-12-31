const mongoose = require("mongoose");
require('dotenv').config();
require("mongodb");
const connectDb = async () => {
  await mongoose.connect(
     process.env.mongoURI
  );
};

module.exports = connectDb;


