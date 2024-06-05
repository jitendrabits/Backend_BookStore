const model = require('../model/db');

const Products = model.products;

const statusCode = require("../config/status-codes");

const encPassword = require("../middelware/enc-password");

const decodeBase64Image = require('../middelware/base64toimage');

const moment = require('moment');

const imagePath = "uploads/products/";

exports.getProductsList = async (req, res, next) => {

    let where = { status: 1 };

    try {

        const userList = await Products.find(where, { _id: 1, name: 1, productSlug: 1, brand: 1, category: 1, rating: 1, productMrp: 1, productPrice: 1,seller:1,sizeVariation:1, availableQty:1,productMainImage: 1 });

        if (userList.length > 0) {

            res.status(statusCode.SUCCESS_CODE).send({
                message: "Product List fetched successfully",
                status: true,
                data: userList,
            });

        } else {

            res.status(statusCode.SUCCESS_CODE).send({
                message: "Product List is Empty",
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



exports.getProductsDetails = async (req, res, next) => {

    const productId = req.params.productId;

    let where = { status: 1 };

    try {

        if (productId != "") {

            where = {
                ...where, _id: productId
            }

            const data = await Products.find(where);

            if (data.length > 0) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Product Details fetched successfully",
                    status: true,
                    data: data[0],
                });
            } else {
                res.status(statusCode.BAD_REQUEST).send({
                    message: "Unable to Find Product Details",
                    status: false,
                    data: []
                });
            }
        } else {
            res.status(statusCode.BAD_REQUEST).send({
                message: "Please provide a Product Id",
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


exports.createProducts = async (req, res, next) => {

    const data = req.body;

    if (data.name != "" && data.productSlug != "" && data.brand != "" && data.category != "" && data.productSmallDescription != "" && data.productDescription != "") {

        try {

            let where = { productSlug: data.productSlug };

            const check = await Products.find(where);

            if (check.length == 0) {

                let productMainImage = "";

                let imageName = imagePath + "product-img-" + moment().format("YYYY-MM-DD-HH-mm-ss");

                if (data.productMainImage != null && data.productMainImage != "") {
                    productMainImage = await decodeBase64Image(data.productMainImage, imageName);
                }

                let productImage1 = "";
                if (data.productImage1 != null && data.productImage1 != "") {
                    productImage1 = await decodeBase64Image(data.productImage1, imageName + "product-image-1");
                }

                let productImage2 = "";
                if (data.productImage2 != null && data.productImage2 != "") {
                    productImage2 = await decodeBase64Image(data.productImage2, imageName + "product-image-2");
                }

                let productImage3 = "";
                if (data.productImage3 != null && data.productImage3 != "") {
                    productImage3 = await decodeBase64Image(data.productImage3, imageName + "product-image-3");
                }

                let productImage4 = "";
                if (data.productImage4 != null && data.productImage4 != "") {
                    productImage4 = await decodeBase64Image(data.productImage4, imageName + "product-image-4");
                }

                let productImage5 = "";
                if (data.productImage5 != null && data.productImage5 != "") {
                    productImage5 = await decodeBase64Image(data.productImage5, imageName + "product-image-5");
                }


                let productDetails = new Products({
                    name: data.name,
                    productSlug: data.productSlug,
                    brand: data.brand,
                    category: data.category,
                    productSmallDescription: data.productSmallDescription,
                    productDescription: data.productDescription,
                    showHide: data.showHide,
                    rating: data.rating,
                    sizeVariation: data.sizeVariation,
                    seller:data.seller,
                    productMrp: data.productMrp,
                    productPrice: data.productPrice,
                    availableQty: data.availableQty,
                    productMainImage: productMainImage,
                    productImage1: productImage1,
                    productImage2: productImage2,
                    productImage3: productImage3,
                    productImage4: productImage4,
                    productImage5: productImage5,
                    productVideo: data.productVideo,
                });

                const reponse = await productDetails.save();

                if (reponse) {
                    res.status(statusCode.SUCCESS_CODE).send({
                        message: "Product Created successfully",
                        status: true,
                        data: reponse,
                    });
                } else {
                    res.status(statusCode.NOT_MODIFIED).send({
                        message: "Unable to add Product",
                        status: false,
                        data: []
                    });
                }

            } else {

                res.status(statusCode.ALREADY_EXIST).send({
                    message: "Product already exists",
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
            message: "Please Provide Name, Small Description, Description, Brand & Category",
            status: false,
            data: []
        });
    }

};




exports.updateProducts = async (req, res, next) => {

    const productId = req.params.productId;

    const data = req.body;

   // console.log(data);

    if (data.name != "" && data.productSlug != "" && data.brand != "" && productId != "") {

        try {

            let where = { _id: productId, status: 1 };

            const check = await Products.find(where);

            if (check.length > 0) {

                let productDetails = {
                    name: data.name,
                    productSlug: data.productSlug,
                    brand: data.brand,
                    category: data.category,
                    seller: data.seller,
                    sizeVariation: data.sizeVariation,
                    productSmallDescription: data.productSmallDescription,
                    productDescription: data.productDescription,
                    showHide: data.showHide,
                };

                if (data.rating != "" && data.rating != null) {
                    productDetails = { ...productDetails, rating: data.rating };
                }

                if (data.sizeVariation != "" && data.sizeVariation != null) {
                    productDetails = { ...productDetails, sizeVariation: data.sizeVariation };
                }
                if (data.seller != "" && data.seller != null) {
                    productDetails = { ...productDetails, seller: data.seller };
                }
                if (data.productMrp != "" && data.productMrp != null) {
                    productDetails = { ...productDetails, productMrp: data.productMrp };
                }

                if (data.productPrice != "" && data.productPrice != null) {
                    productDetails = { ...productDetails, productPrice: data.productPrice };
                }

                if (data.availableQty != "" && data.availableQty != null) {
                    productDetails = { ...productDetails, availableQty: data.availableQty };
                }

                if (data.productVideo != "" && data.productVideo != null) {
                    productDetails = { ...productDetails, productVideo: data.productVideo };
                }

                let imageName = imagePath + "product-img-" + moment().format("YYYY-MM-DD-HH-mm-ss");

                if (data.productMainImage != null && data.productMainImage != "") {
                    let productMainImage = await decodeBase64Image(data.productMainImage, imageName);

                    productDetails = { ...productDetails, productMainImage: productMainImage };
                }

                if (data.productImage1 != null && data.productImage1 != "") {
                    let productImage1 = await decodeBase64Image(data.productImage1, imageName + "product-image-1");

                    productDetails = { ...productDetails, productImage1: productImage1 };
                }

                if (data.productImage2 != null && data.productImage2 != "") {
                    let productImage2 = await decodeBase64Image(data.productImage2, imageName + "product-image-2");

                    productDetails = { ...productDetails, productImage2: productImage2 };
                }

                if (data.productImage3 != null && data.productImage3 != "") {
                    let productImage3 = await decodeBase64Image(data.productImage3, imageName + "product-image-3");

                    productDetails = { ...productDetails, productImage3: productImage3 };
                }

                if (data.productImage4 != null && data.productImage4 != "") {
                    let productImage4 = await decodeBase64Image(data.productImage4, imageName + "product-image-4");

                    productDetails = { ...productDetails, productImage4: productImage4 };
                }

                if (data.productImage5 != null && data.productImage5 != "") {
                    let productImage5 = await decodeBase64Image(data.productImage5, imageName + "product-image-5");

                    productDetails = { ...productDetails, productImage5: productImage5 };
                }

                const reponse = await Products.findOneAndUpdate(
                    { _id: productId },
                    { $set: productDetails },
                    { new: true }
                );

                if (reponse) {
                    res.status(statusCode.SUCCESS_CODE).send({
                        message: "Product Updated successfully",
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

                res.status(statusCode.BAD_REQUEST).send({
                    message: "Product Not Found",
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



exports.deleteProducts = async (req, res, next) => {

    const productId = req.params.productId;

    const data = {
        status: 0,
    }

    try {

        const check = await Products.find({ _id: productId, status: 1 });

        if (check.length > 0) {

            const reponse = await Products.findOneAndUpdate(
                { _id: productId },
                { $set: data },
                { new: true }
            );

            if (reponse) {
                res.status(statusCode.SUCCESS_CODE).send({
                    message: "Product Deleted successfully",
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
                message: "Product Not exist",
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


exports.searchProducts = async (req, res, next) => {
    const searchQuery = req.query.q;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    try {
        const products = await Products.find({ name: { $regex: searchQuery, $options: 'i' } })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(statusCode.SUCCESS_CODE).send({
            message: "Products found successfully",
            status: true,
            data: products
        });
    } catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error " + error.message,
            status: false,
            data: []
        });
    }
};
