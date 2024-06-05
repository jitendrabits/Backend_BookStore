const jwt = require('jsonwebtoken');

const authkey = require('../config/jwt-key');

function verifyJWT(req, res, next) {

    const bearerToken = req.headers['authorization'];

    // console.log("token",req.headers)

    if (typeof bearerToken !== 'undefined') {

        const bearer = bearerToken.split(" ");

        const token = bearer[1];

        jwt.verify(token, authkey.KEY, (err, result) => {

            if (err) {
                res.status(400).send({
                    message: "Error Found " + err.message,
                    status: false,
                    data: []
                });
            } else {
                req.user = result.adminDetails;
                next();
            }
        });

    } else {
        res.send({
            message: "Please Provide Bearer Token",
            status: false,
            data: []
        });
    }

}

module.exports = verifyJWT;