const model = require('../model/db');

const Users = model.users;

const statusCode = require("../config/status-codes");

const encPassword = require("../middelware/enc-password");

const decodeBase64Image = require('../middelware/base64toimage');

const moment = require('moment');

const imagePath = "uploads/users/";
const Products = model.products;
const Order = model.order;


exports.getUsersList = async (req, res, next) => {

    let where = { status: 1 };

    try {

        const pageSize = 10;
        const page = req.query.pageNo || 0;

        /* let userList = await Users.find(where).sort({ createdAt: -1 }).skip((page) * pageSize).limit(pageSize); */

        let qry = Users.find(where).sort({ createdAt: -1 });

        if (page > 0) {
            qry = qry.skip((page) * pageSize);
        }

        qry = qry.limit(pageSize);

        let userList = await qry;

        let dataCount = await Users.countDocuments(where);
        let dataCount2 = await Products.countDocuments(where);
        let dataCount3 = await Order.countDocuments(where);

 
        if (userList.length > 0) {

            res.status(statusCode.SUCCESS_CODE).send({
                message: "User List fetched successfully",
                status: true,
                data: userList,
                totalUsers: dataCount,
                totalProduct:dataCount2,
                totalOrder:dataCount3
            });

        } else {

            res.status(statusCode.SUCCESS_CODE).send({
                message: "User List is Empty",
                status: true,
                data: []
            });

        }

    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error " + err.message,
            status: false,
            data: [],
        })
    }
};



exports.getUserDetails = async (req, res, next) => {

    const userId = req.params.userId;

    let where = { status: 1 };

    try {

        if (userId != "") {

            where = {
                ...where, _id: userId
            }

            const data = await Users.find(where);

            if (data.length > 0) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "User Details fetched successfully",
                    status: true,
                    data: data[0],
                });
            } else {
                res.status(statusCode.BAD_REQUEST).send({
                    message: "Unable to Find User Details",
                    status: false,
                    data: []
                });
            }
        } else {
            res.status(statusCode.BAD_REQUEST).send({
                message: "Please provide a User Id",
                status: false,
                data: []
            });
        }
    } catch (error) {

        res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error " + error.message,
            status: false,
            data: []
        });

    }
};


exports.createUser = async (req, res, next) => {

    const data = req.body;

    if (data.name != "" && data.email != "" && data.contact != "" && data.password != "") {

        try {

            let where = { email: data.email };

            const check = await Users.find(where);

            if (check.length == 0) {

                let newPassword = await encPassword(data.password);

                let userDetails = new Users({
                    name: data.name,
                    email: data.email,
                    contact: data.contact,
                    password: newPassword,
                    gender: data.gender,
                    dob: data.dob,
                    userVerify: data.userVerify,
                });

                const reponse = await userDetails.save();

                if (reponse) {
                    res.status(statusCode.SUCCESS_CODE).send({
                        message: "User Created successfully",
                        status: true,
                        data: reponse,
                    });
                } else {
                    res.status(statusCode.NOT_MODIFIED).send({
                        message: "Unable to add User",
                        status: false,
                        data: []
                    });
                }

            } else {

                res.status(statusCode.ALREADY_EXIST).send({
                    message: "User already exists",
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

        res.status(statusCode.NO_CONTENT).send({
            message: "Please Provide Name, Email, Contact & Password",
            status: false,
            data: []
        });
    }

};




exports.updateUser = async (req, res, next) => {

    const userId = req.params.userId;

    const data = req.body;

    if (data.name != "" && data.email != "" && data.contact != "" && userId != "") {

        try {

            let where = { _id: userId };

            const check = await Users.find(where);

            if (check.length > 0) {

                let userDetails = {
                    name: data.name,
                    contact: data.contact,
                };


                if (data.gender != "") {
                    userDetails = {
                        ...userDetails, gender: data.gender,
                    }
                }

                if (data.dob != "") {
                    userDetails = {
                        ...userDetails, dob: data.dob,
                    }
                }

                if (data.userVerify != "") {
                    userDetails = {
                        ...userDetails, userVerify: data.userVerify,
                    }
                }

                let profileImage = "";

                if (data.profileImage != null && data.profileImage != "") {

                    let imageName = imagePath + "user-img-" + userId + moment().format("YYYY-MM-DD-HH-mm-ss");

                    profileImage = await decodeBase64Image(data.profileImage, imageName);

                    userDetails = { ...userDetails, profileImage: profileImage };
                }

                const reponse = await Users.findOneAndUpdate(
                    { _id: userId },
                    { $set: userDetails },
                    { new: true }
                );

                if (reponse) {
                    res.status(statusCode.SUCCESS_CODE).send({
                        message: "User Updated successfully",
                        status: true,
                        data: reponse,
                    });
                } else {
                    res.status(statusCode.NOT_MODIFIED).send({
                        message: "Unable to update User",
                        status: false,
                        data: []
                    });
                }

            } else {

                res.status(statusCode.NO_CONTENT).send({
                    message: "User Not Found",
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
            message: "Please Provide Name, Email, Contact",
            status: false,
            data: []
        });
    }

};



exports.deleteUser = async (req, res, next) => {

    const userId = req.params.userId;

    const data = {
        status: 0,
    }

    try {

        const check = await Users.find({ _id: userId, status: 1 });

        if (check.length > 0) {

            const reponse = await Users.findOneAndUpdate(
                { _id: userId },
                { $set: data },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "User Deleted successfully",
                    status: true,
                    data: reponse
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to delete User",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.BAD_REQUEST).send({
                message: "User Not exist",
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

};


exports.updateUserImage = async (req, res, next) => {

    const data = req.body;

    const userId = req.params.userId;

    if (userId != "" && userId != null && data.profileImage != "" && data.profileImage != null) {

        let imageName = imagePath + "user-img-" + userId + moment().format("YYYY-MM-DD-HH-mm-ss");

        let userDetails = {};

        let profileImage = "";

        if (data.profileImage != null && data.profileImage != "") {
            profileImage = await decodeBase64Image(data.profileImage, imageName);

            userDetails = { ...userDetails, profileImage: profileImage };
        }

        const reponse = await Users.findOneAndUpdate(
            { _id: userId },
            { $set: userDetails },
            { new: true }
        );

        if (reponse) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "User Profile Updated successfully",
                status: true,
                data: reponse
            });
        } else {
            res.status(statusCode.NOT_MODIFIED).send({
                message: "Unable to Updated User Image",
                status: false,
                data: []
            });
        }
    } else {
        res.status(statusCode.BAD_REQUEST).send({
            message: "Please Provide User Image",
            status: false,
            data: [],
        });
    }
};
