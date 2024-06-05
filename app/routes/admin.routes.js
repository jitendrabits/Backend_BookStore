const express = require('express');

const routes = express.Router();

const admin = require('../controller/admin.controller');
const users = require('../controller/users.controller');

const baseUrl = "/admin";

const verifyJWT = require('../middelware/verify-jwt');

/* routes.post(baseUrl, admin.saveAdminDetails); */

routes.post(baseUrl, admin.adminLogin);

routes.post(baseUrl + '/signup', verifyJWT, admin.saveAdminDetails);

// routes.get(baseUrl + 'changerole', verifyJWT, admin.)

routes.get(baseUrl + '/userlist', admin.getUsersList);

routes.get(baseUrl + '/user/:id', users.getUserDetails)

routes.delete(baseUrl + '/user/:id', admin.deleteUser); // New delete route

module.exports = routes;
