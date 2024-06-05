const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email address"],
    },
    countryCode: {
        type: Number,
        default: 91,
    },
    contact: {
        type: String,
        required: [true, "Please enter Contact Number"],
    },
    profileImage: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter Password"],
    },
    gender: String,
    dob: String,
    userVerify: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);