const model = require('../model/db');

const OtpVerification = model.otpVerification;

const User = model.users;

const statusCode = require("../config/status-codes");

exports.sendOtp = async (req, res, next) => {

    const details = req.body;

    let data = {
        userData: details.userData,
        otpFor: details.otpFor || "user",
        otp: Math.floor(100000 + Math.random() * 900000),
    }

    try {

        if (details.userData != "" && details.userData != null) {

            let where = {
                $or: [
                    { email: data.userData },
                    { contact: data.userData }
                ]
            };

            const check = await User.find(where);

            if (check.length > 0) {

                let otpData = {
                    userId: check[0]._id,
                    otpFor: data.otpFor,
                    otp: data.otp,
                };

                const otpDetails = new OtpVerification(otpData);

                const reponse = await otpDetails.save();

                if (reponse) {
                    res.status(statusCode.SUCCESS_CODE).send({
                        message: "Otp Sended successfully",
                        status: true,
                        data: reponse
                    });
                } else {
                    res.status(statusCode.NOT_MODIFIED).send({
                        message: "Unable to Send OTP",
                        status: false,
                        data: []
                    });
                }
            } else {

                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Please Provide Valid User Id",
                    status: false,
                    data: []
                });

            }

        } else {

            res.status(statusCode.SUCCESS_CODE).send({
                message: "Please Provide User Id",
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


exports.verifyOtp = async (req, res, next) => {

    const details = req.body;

    try {

        if (details.userId != "" && details.userId != null && details.userOtp != "" && details.userOtp != null) {

            const check = await User.find({ _id: details.userId });

            if (check.length > 0) {

                const otpStatus = await OtpVerification.find({ userId: details.userId, verifyOtp: false }).sort({ createdAt: -1 }).exec();

                if (otpStatus.length > 0) {

                    if (otpStatus[0].otp == details.userOtp) {

                        await OtpVerification.updateMany({ userId: details.userId }, { verifyOtp: true });

                        await User.updateOne({ _id: details.userId }, { userVerify: true });

                        res.status(statusCode.SUCCESS_CODE).send({
                            message: "Otp Verify successfully",
                            status: true,
                            data: check
                        });

                    } else {

                        res.status(statusCode.BAD_REQUEST).send({
                            message: "Please Provider Valid OTP",
                            status: false,
                            data: []
                        });

                    }

                } else {

                    res.status(statusCode.BAD_REQUEST).send({
                        message: "OTP Does Not Exist",
                        status: false,
                        data: []
                    });

                }
            } else {

                res.status(statusCode.BAD_REQUEST).send({
                    message: "Please Provide Valid User Id & Otp",
                    status: false,
                    data: []
                });

            }

        } else {

            res.status(statusCode.SUCCESS_CODE).send({
                message: "Please Provide User Id",
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