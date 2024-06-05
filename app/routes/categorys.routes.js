const express = require('express');

const routes = express.Router();

const brands = require('../controller/categorys.controller');

const baseUrl = "/categorys";

routes.route(baseUrl).get(brands.getCategoryList);

routes.route(baseUrl + "/list").get(brands.getAllCategoryList);

routes.route(baseUrl + "/:categoryId").get(brands.getCategoryDetails);

routes.route(baseUrl).post(brands.createCategory);

routes.route(baseUrl + "/:categoryId").put(brands.updateCategory);

routes.route(baseUrl + "/:categoryId").delete(brands.deleteCategory);

module.exports = routes;