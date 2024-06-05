const express = require('express');

const routes = express.Router();

const otp = require('../controller/otp-verification.controller');

const baseUrl = "/send-otp";

const baseUrl2 = "/otp-verification";

routes.post(baseUrl, otp.sendOtp);

routes.post(baseUrl2, otp.verifyOtp);

module.exports = routes;