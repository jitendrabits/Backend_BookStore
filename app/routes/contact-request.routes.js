const express = require('express');

const routes = express.Router();

const request = require('../controller/contact-request.controller');

const baseUrl = "/contact-request";

routes.route(baseUrl).post(request.sendRequest);

module.exports = routes;