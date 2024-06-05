const express = require('express');

const mongoose = require('mongoose');

const admin = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profile_image: String,
}, { timestamps: true });

module.exports = mongoose.model("admin", admin);