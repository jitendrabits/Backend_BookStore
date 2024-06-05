const model = require('../model/db');

const Brand = model.brands;

const imagePath = "uploads/brands/";

const moment = require('moment');

const decodeBase64Image = require('../middelware/base64toimage');

const statusCode = require("../config/status-codes");

exports.getBrandList = async (req, res, next) => {

    let where = { status: 1 };

    if (req.query.name && req.query.name !== "") {
        where = {
            ...where,
            name: { $regex: req.query.name, $options: "i" },
        };
    }

    try {

        const pageSize = 10;
        const page = req.query.pageNo || 0;

        let qry = Brand.find(where).sort({ createdAt: -1 });

        if (page > 0) {
            qry = qry.skip((page) * pageSize);
        }

        qry = qry.limit(pageSize);

        const data = await qry;

        let dataCount = await Brand.countDocuments(where);

        if (data.length > 0) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Brands fetched successfully",
                status: true,
                data: data,
                totalBrands: dataCount
            });
        } else {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "List is Empty",
                status: true,
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


exports.getBrandDetails = async (req, res, next) => {

    const brandId = req.params.brandId;

    let where = { status: 1 };

    try {

        if (brandId != "") {

            where = {
                ...where, _id: brandId
            }

            const data = await Brand.find(where);

            if (data.length > 0) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Brand Details fetched successfully",
                    status: true,
                    data: data[0],
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to Find Brand Details",
                    status: true,
                    data: []
                });
            }
        } else {
            res.status(statusCode.NO_CONTENT).send({
                message: "Please provide a Brand Id",
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


exports.createBrand = async (req, res, next) => {

    const details = req.body;

    let data = {
        name: details.name,
        brand_slug: details.brand_slug,
        show_hide: details.show_hide,
        status: 1,
    }

    let imageName = imagePath + "brands-" + moment().format('YYYY-MM-DD-HH-mm-ss');

    let imageURL = "";

    if (details.brand_image != null && details.brand_image != "") {

        imageURL = await decodeBase64Image(details.brand_image, imageName);

        data = { ...data, brand_image: imageURL };
    } else {
        data = { ...data, brand_image: "" };
    }

    try {

        const check = await Brand.find({ brand_slug: details.brand_slug });

        if (check.length === 0) {

            const brandDetails = new Brand(data);

            const reponse = await brandDetails.save();

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Brands Added successfully",
                    status: true,
                    data: reponse
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to add brand",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.ALREADY_EXIST).send({
                message: "Brand already exists",
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



exports.updateBrand = async (req, res, next) => {

    const brand_id = req.params.brand_id;

    const details = req.body;

    let data = {
        name: details.name,
        brand_slug: details.brand_slug,
        show_hide: details.show_hide,
    }

    let imageName = imagePath + "brands-" + moment().format('YYYY-MM-DD-HH-mm-ss');

    let imageURL = "";

    if (details.brand_image != null && details.brand_image != "") {

        imageURL = await decodeBase64Image(details.brand_image, imageName);

        data = { ...data, brand_image: imageURL };
    }

    try {

        const check = await Brand.find({ _id: brand_id });

        if (check.length > 0) {

            const reponse = await Brand.findOneAndUpdate(
                { _id: brand_id },
                { $set: data },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Brands Updated successfully",
                    status: true,
                    data: reponse
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to update brand",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.NO_CONTENT).send({
                message: "Brand Not exist",
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



exports.deleteBrand = async (req, res, next) => {

    const brandId = req.params.brandId;

    const data = {
        status: 0,
    }

    try {

        const check = await Brand.find({ _id: brandId, status: 1 });

        if (check.length > 0) {

            const reponse = await Brand.findOneAndUpdate(
                { _id: brandId },
                { $set: data },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Brand Deleted successfully",
                    status: true,
                    data: reponse
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to delete brand",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.NO_CONTENT).send({
                message: "Brand Not exist",
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


exports.getAllBrandList = async (req, res, next) => {

    let where = { status: 1 };

    try {

        let data = await Brand.find(where).sort({ name: 1 });

        if (data.length > 0) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Brands fetched successfully",
                status: true,
                data: data,
            });
        } else {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "List is Empty",
                status: true,
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