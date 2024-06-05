const model = require('../model/db');

const Users = model.users;

const statusCode = require("../config/status-codes");

const decPassword = require("../middelware/dec-password");

const createJwtToken = require('../middelware/create-jwt');

exports.userLogin = async (req, res, next) => {

    const data = req.body;
    console.log("beta: ");
    console.log(data);

    if (data.userData != "" && data.userData != null && data.password != "" && data.password != "") {

        try {

            let where = { $or: [{ email: data.userData }, { contact: data.userData }] };

            const check = await Users.find(where).select('_id name email contact password profileImage').exec();

            if (check.length > 0) {

                const userData = check[0];

                let checkPassword = await decPassword(data.password, userData.password);

                if (checkPassword === true) {

                    const token = await createJwtToken(userData);
                    // console.log("32user-login.controller",userData)

                    res.status(statusCode.SUCCESS_CODE).send({
                        message: "User Login successfully",
                        status: true,
                        data: userData,
                        jwtToken: token
                    });

                } else {

                    res.status(statusCode.BAD_REQUEST).send({
                        message: "Please Enter a Valid Password",
                        status: false,
                        data: []
                    });

                }

            } else {

                res.status(statusCode.BAD_REQUEST).send({
                    message: "User Does Not Exist",
                    status: false,
                    data: [],
                });

            }

        } catch (error) {

            res.status(statusCode.INTERNAL_SERVER_ERROR).send({
                message: "Internal Server Error " + error.message,
                status: false,
                data: []
            });

        }

    } else {

        res.status(statusCode.BAD_REQUEST).send({
            message: "Please Provide  Email & Password",
            status: false,
            data: []
        });
    }

};