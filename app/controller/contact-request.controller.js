const model = require('../model/db');

const ContactRequest = model.contactRequest;

const statusCode = require("../config/status-codes");

exports.sendRequest = async (req, res, next) => {

    const details = req.body;

    let data = {
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        contact: details.contact,
        message: details.message,
        status: 1,
    }

    try {

        const request = new ContactRequest(data);

        const reponse = await request.save();

        if (reponse) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Request Added successfully",
                status: true,
                data: reponse
            });
        } else {
            res.status(statusCode.NOT_MODIFIED).send({
                message: "Unable to add Category",
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
