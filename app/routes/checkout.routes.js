const express = require('express');

const routes = express.Router();

const checkout = require('../controller/checkout.controller');


routes.route('/checkout').post(checkout.checkoutCart);



module.exports = routes;