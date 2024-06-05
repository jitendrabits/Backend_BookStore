const express = require('express');

const routes = express.Router();

const reviews = require('../controller/review.controller');

const baseUrl = "/reviews";

routes.route(baseUrl + "/:productId").get(reviews.getReviews);

routes.route(baseUrl).post(reviews.postReviews);

module.exports = routes;