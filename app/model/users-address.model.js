const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, "Please Enter User Id"],
    },
    name: {
        type: String,
        required: [true, "Please Enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please Enter a valid email address"],
    },
    countryCode: {
        type: Number,
        default: 91,
    },
    contact: {
        type: Number,
        required: [true, "Please Enter Contact Number"],
    },
    houseNo: {
        type: String,
        required: [true, "Please Enter House No"],
    },
    streetArea: {
        type: String,
        required: [true, "Please Enter Street Area"],
    },
    landmark: {
        type: String,
        required: [true, "Please Enter Landmark"],
    },
    pincode: {
        type: Number,
        required: [true, "Please Enter Pincode"],
    },
    state: {
        type: String,
        required: [true, "Please Enter State"],
    },
    city: {
        type: String,
        required: [true, "Please Enter City"],
    },
    country: {
        type: String,
        default: "India",
    },
    defaultAddress: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });

module.exports = mongoose.model("useraddress", userSchema);