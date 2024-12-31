const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,

    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if( !["male", "female", "other"].includes(value)) {
                throw new Error("Gender is invalid");
            }
        }
    },
    imageUrl: {
        type: String,
        default: "https://xyz.com"
    },
    about: {
        type: String,
        default: "This is default about of user"
    },
    skills: {
        type: [String],
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports = User;