const express = require('express');

const app = express();

const all_pages = require('./app');

app.use(all_pages);

const port = process.env.PORT || 3001;

app.listen(port, function (req, res, next) {

    console.log("Project started successfully on port " + port);

});