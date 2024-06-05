const express = require('express');

const routes = express.Router();

const users = require('../controller/users-login.controller');

const baseUrl = "/login";

routes.route(baseUrl).post(users.userLogin);

module.exports = routes;