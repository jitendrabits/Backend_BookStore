const mongoose = require('mongoose');

const otpVerification = mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please Provide User Id"],
    },
    otpFor: {
        type: String,
        default: "users",
    },
    otp: {
        type: Number,
        required: [true, "Please Provide OTP"],
    },
    verifyOtp: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("otpVerification", otpVerification);