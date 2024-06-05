const express = require('express');

const routes = express.Router();

const cart = require('../controller/cart.controller');

const baseUrl = "/cart";

routes.route(baseUrl + '/:userId').get(cart.getCart);

routes.route(baseUrl).post(cart.addToCart);

routes.route(baseUrl + '/:userId').put(cart.updateCart);

routes.route(baseUrl + '/item/:userId').delete(cart.removeItem);

routes.route(baseUrl + '/:userId').delete(cart.deleteCart);

module.exports = routes;



