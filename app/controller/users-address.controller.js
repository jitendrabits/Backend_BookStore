const model = require("../model/db");

const userAddress = model.usersAddress;
const userAddress1 = model.order;
 
const statusCode = require("../config/status-codes");


exports.getUsersAddressList = async (req, res, next) => {

    const userId = req.params.userId;

    let where = { status: 1 };

    try {

        if (userId != "") {

            where = {
                ...where, userId: userId
            }

            const userList = await userAddress.find(where);

            if (userList.length > 0) {

                res.status(statusCode.SUCCESS_CODE).send({
                    message: "User Address List fetched successfully",
                    status: true,
                    data: userList,
                });

            } else {

                res.status(statusCode.SUCCESS_CODE).send({
                    message: "User Address List is Empty",
                    status: true,
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

    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error " + err.message,
            status: false,
            data: [],
        })
    }
};




exports.getUserAddressDetails = async (req, res, next) => {

    const addressId = req.params.addressId;

    let where = { status: 1 };

    try {

        if (addressId != "") {

            where = {
                ...where, _id: addressId
            }

            const data = await userAddress.find(where);
            
            if (data.length > 0) {
                 res.status(statusCode.SUCCESS_CODE).send({
                    message: "User Address Details fetched successfully",
                    status: true,
                    data: data[0],
                });
            } else {
                res.status(statusCode.BAD_REQUEST).send({
                    message: "Unable to Find User Address Details",
                    status: false,
                    data: []
                });
            }
        } else {
            res.status(statusCode.BAD_REQUEST).send({
                message: "Please provide a Address Id",
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



exports.addUsersAddress = async (req, res, next) => {

    const data = req.body;

    if (data.name != "" && data.email != "" && data.contact != "" && data.houseNo != "" && data.streetArea != "" && data.landmark != "" && data.pincode != "" && data.state != "" && data.city != "") {

        const userAddressDetails = new userAddress({
            userId: data.userId,
            name: data.name,
            email: data.email,
            contact: data.contact,
            houseNo: data.houseNo,
            streetArea: data.streetArea,
            landmark: data.landmark,
            pincode: data.pincode,
            state: data.state,
            city: data.city,
            defaultAddress: data.defaultAddress,
        });


        const reponse = await userAddressDetails.save();

        if (reponse) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "User Address Created successfully",
                status: true,
                data: reponse,
            });
        } else {
            res.status(statusCode.NOT_MODIFIED).send({
                message: "Unable to add User  Address",
                status: false,
                data: []
            });
        }

    } else {

        res.status(statusCode.BAD_REQUEST).send({
            message: "Please Provide Name, Email, Contact, House No, Street Area, Landmark, Pincode, State & City",
            status: false,
            data: [],
        });
    }

}


exports.updateUsersAddress = async (req, res, next) => {

    const addressId = req.params.addressId;

    const data = req.body;

    if (data.name != "" && data.email != "" && data.contact != "" && data.houseNo != "" && data.streetArea != "" && data.landmark != "" && data.pincode != "" && data.state != "" && data.city != "") {

        const userAddressDetails = {
            name: data.name,
            email: data.email,
            contact: data.contact,
            houseNo: data.houseNo,
            streetArea: data.streetArea,
            landmark: data.landmark,
            pincode: data.pincode,
            state: data.state,
            city: data.city,
            defaultAddress: data.defaultAddress,
        };

        let where = { _id: addressId };

        const check = await userAddress.find(where);

        if (check.length > 0) {

            const reponse = await userAddress.findOneAndUpdate(
                { _id: addressId },
                { $set: userAddressDetails },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "User Address Updated successfully",
                    status: true,
                    data: reponse,
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to Update User Address",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.NO_CONTENT).send({
                message: "User Address Not Found",
                status: false,
                data: [],
            });

        }

    } else {

        res.status(statusCode.BAD_REQUEST).send({
            message: "Please Provide Name, Email, Contact, House No, Street Area, Landmark, Pincode, State & City",
            status: false,
            data: [],
        });
    }

}



exports.deleteUserAddress = async (req, res, next) => {

    const addressId = req.params.addressId;

    const data = {
        status: 0,
    }

    try {

        const check = await userAddress.find({ _id: addressId, status: 1 });

        if (check.length > 0) {

            const reponse = await userAddress.findOneAndUpdate(
                { _id: addressId },
                { $set: data },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "User Address Deleted successfully",
                    status: true,
                    data: reponse
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to delete User Address",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.BAD_REQUEST).send({
                message: "User Address Not exist",
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
