const express = require('express');

const routes = express.Router();

const brands = require('../controller/brands.controller');

const baseUrl = "/brands";

const verifyJWT = require('../middelware/verify-jwt');

routes.route(baseUrl).get(brands.getBrandList);

routes.route(baseUrl + "/list").get(brands.getAllBrandList);

routes.route(baseUrl + "/:brandId").get(brands.getBrandDetails);

routes.route(baseUrl).post(brands.createBrand);

routes.route(baseUrl + "/:brand_id").put(brands.updateBrand);

routes.route(baseUrl + "/:brandId").delete(brands.deleteBrand);

module.exports = routes;