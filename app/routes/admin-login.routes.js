const express = require('express');

const routes = express.Router();

const admin = require('../controller/admin.controller');

const baseUrl = "/admin-login";

routes.route(baseUrl).post(admin.adminLogin);

module.exports = routes;