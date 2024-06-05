const mongoose = require('mongoose');

const contactRequest = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please Provide First Name"],
    },
    lastName: {
        type: String,
        required: [true, "Please Provide Last Name"],
    },
    email: {
        type: String,
        required: [true, "Please enter a valid email address"],
    },
    contact: {
        type: String,
        required: [true, "Please enter Contact Number"],
    },
    message: {
        type: String,
        required: [true, "Please Provide Message"],
    },
    status: Number,
}, { timestamps: true });

module.exports = mongoose.model("contactRequest", contactRequest);