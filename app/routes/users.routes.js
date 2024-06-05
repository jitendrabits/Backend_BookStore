const express = require('express');

const routes = express.Router();

const users = require('../controller/users.controller');

const baseUrl = "/users";

routes.route(baseUrl).get(users.getUsersList);

routes.route(baseUrl + "/:userId").get(users.getUserDetails);

routes.route(baseUrl).post(users.createUser);

routes.route(baseUrl + "/:userId").put(users.updateUser);

routes.route(baseUrl + "-image/:userId").post(users.updateUserImage);

routes.route(baseUrl + "/:userId").delete(users.deleteUser);

module.exports = routes;