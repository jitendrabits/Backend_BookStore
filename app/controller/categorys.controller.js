const model = require('../model/db');

const Category = model.categorys;

const imagePath = "uploads/categorys/";

const moment = require('moment');

const decodeBase64Image = require('../middelware/base64toimage');

const statusCode = require("../config/status-codes");

exports.getCategoryList = async (req, res, next) => {

    let where = { status: 1 };

    if (req.query.name && req.query.name !== "") {
        where = {
            ...where, name: { $regex: req.query.name, $options: "i" },
        }
    }

    try {

        const pageSize = 10;
        const page = req.query.pageNo || 0;

        let qry = Category.find(where).sort({ createdAt: -1 });

        if (page > 0) {
            qry = qry.skip((page) * pageSize);
        }

        qry = qry.limit(pageSize);

        const data = await qry;

        let dataCount = await Category.countDocuments(where);

        if (data.length > 0) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Categorys fetched successfully",
                status: true,
                data: data,
                totalCategorys: dataCount
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



exports.getCategoryDetails = async (req, res, next) => {

    const categoryId = req.params.categoryId;

    let where = { status: 1 };

    try {

        if (categoryId != "") {

            where = {
                ...where, _id: categoryId
            }

            const data = await Category.find(where);

            if (data.length > 0) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Category Details fetched successfully",
                    status: true,
                    data: data[0],
                });
            } else {
                res.status(statusCode.BAD_REQUEST).send({
                    message: "Unable to Find Category Details",
                    status: false,
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


exports.createCategory = async (req, res, next) => {

    const details = req.body;

    let data = {
        name: details.name,
        categorySlug: details.categorySlug,
        showHide: details.showHide,
        status: 1,
    }

    let imageName = imagePath + "category-" + moment().format('YYYY-MM-DD-HH-mm-ss');

    let imageURL = "";

    if (details.categoryImage != null && details.categoryImage != "") {

        imageURL = await decodeBase64Image(details.categoryImage, imageName);

        data = { ...data, categoryImage: imageURL };
    } else {
        data = { ...data, categoryImage: "" };
    }

    try {

        const check = await Category.find({ categorySlug: details.categorySlug });

        if (check.length === 0) {

            const categoryDetails = new Category(data);

            const reponse = await categoryDetails.save();

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Category Added successfully",
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

        } else {

            res.status(statusCode.ALREADY_EXIST).send({
                message: "Category already exists",
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



exports.updateCategory = async (req, res, next) => {

    const categoryId = req.params.categoryId;

    const details = req.body;

    let data = {
        name: details.name,
        categorySlug: details.categorySlug,
        showHide: details.showHide,
    }

    let imageName = imagePath + "category-" + moment().format('YYYY-MM-DD-HH-mm-ss');

    let imageURL = "";

    if (details.categoryImage != null && details.categoryImage != "") {

        imageURL = await decodeBase64Image(details.categoryImage, imageName);

        data = { ...data, categoryImage: imageURL };
    }

    try {

        const check = await Category.find({ _id: categoryId });

        if (check.length > 0) {

            const reponse = await Category.findOneAndUpdate(
                { _id: categoryId },
                { $set: data },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Category Updated successfully",
                    status: true,
                    data: reponse
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to update Category",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.NO_CONTENT).send({
                message: "Category Not exist",
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


exports.deleteCategory = async (req, res, next) => {

    const categoryId = req.params.categoryId;

    let data = {
        status: 0,
    }

    try {

        const check = await Category.find({ _id: categoryId, status: 1 });

        if (check.length > 0) {

            const reponse = await Category.findOneAndUpdate(
                { _id: categoryId },
                { $set: data },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Category Deleted successfully",
                    status: true,
                    data: reponse
                });
            } else {
                res.status(statusCode.NOT_MODIFIED).send({
                    message: "Unable to delete Category",
                    status: false,
                    data: []
                });
            }

        } else {

            res.status(statusCode.NO_CONTENT).send({
                message: "Category Not exist",
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


exports.getAllCategoryList = async (req, res, next) => {

    let where = { status: 1 };

    try {

        let data = await Category.find(where).sort({ name: 1 });

        if (data.length > 0) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Categorys fetched successfully",
                status: true,
                data: data
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