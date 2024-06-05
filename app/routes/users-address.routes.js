const express = require('express');

const routes = express.Router();

const users = require('../controller/users-address.controller');

const verifyJWT = require("../middelware/verify-jwt");

const baseUrl = "/users-address";

routes.post(baseUrl, verifyJWT, users.addUsersAddress);

routes.route(baseUrl + "/:userId").get(users.getUsersAddressList);

routes.route(baseUrl + "/details/:addressId").get(users.getUserAddressDetails);

routes.route(baseUrl + "/update/:addressId").put(users.updateUsersAddress);

routes.route(baseUrl + "/:addressId").delete(users.deleteUserAddress);

module.exports = routes;