const express = require('express');
const app = express.Router();
const admin = require('./admin.routes');
const brands = require('./brands.routes');
const categorys = require("./categorys.routes");
const users = require('./users.routes');
const usersAddress = require('./users-address.routes');
const products = require('./products.routes');
const otpVerification = require('./otp-verification.routes');
const userLogin = require('./users-login.routes');
const cart = require('./cart.routes');
const order = require('./order.routes');
const checkout = require('./checkout.routes');
const payment = require('./payment.routes');
const review = require('./review.routes');
const contactRequest = require("./contact-request.routes");
const adminLogin = require('./admin-login.routes');

app.use(brands);
app.use(categorys);
app.use(users);
app.use(usersAddress);
app.use(products);
app.use(otpVerification);
app.use(userLogin);
app.use(admin);
app.use(cart);
app.use(order);
app.use(checkout);
app.use(payment);
app.use(review);
app.use(contactRequest);
app.use(adminLogin);


module.exports = app;