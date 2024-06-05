const express = require('express');

const routes = express.Router();

const payment = require('../controller/payment.controller');

const baseUrl = "/payment";

routes.route(baseUrl + '/callback').post(payment.paymentCallback);


module.exports = routes;