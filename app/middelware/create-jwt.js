const jwt = require('jsonwebtoken');

const authkey = require('../config/jwt-key');

const createJwtToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ user }, authkey.KEY, { expiresIn: authkey.EXPIRESIN }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = createJwtToken;