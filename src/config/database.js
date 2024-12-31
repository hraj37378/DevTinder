const mongoose = require("mongoose");
require("mongodb");
const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://hraj37378:yQC2QhRPKMvabfZ0@devtinder.a9eju.mongodb.net/devTinder"
  );
};

module.exports = connectDb;

// hraj37378 : yQC2QhRPKMvabfZ0
