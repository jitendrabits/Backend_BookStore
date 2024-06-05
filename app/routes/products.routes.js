const express = require('express');

const routes = express.Router();

const products = require('../controller/products.controller');

const baseUrl = "/products";

routes.route(baseUrl).get(products.getProductsList);

routes.route(baseUrl + "/:productId").get(products.getProductsDetails);

routes.route(baseUrl).post(products.createProducts);

routes.route(baseUrl + "/:productId").put(products.updateProducts);

routes.route(baseUrl + "/:productId").delete(products.deleteProducts);

routes.route("/search").get(products.searchProducts);

module.exports = routes;