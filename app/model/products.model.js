const mongoose = require('mongoose');

const products = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide Product Name"],
    },
    productSlug: {
        type: String,
        required: [true, "Please Provide Product Slug"],
    },
    brand: {
        type: String,
        required: [true, "Please Provide Product Brand"],
    },
    category: {
        type: String,
        required: [true, "Please Provide Product Category"],
    },
    seller: {
        type: String,
        default: 0,
    },
    productSmallDescription: {
        type: String,
        required: [true, "Please Provide Product Small Description"],
    },
    productDescription: {
        type: String,
        required: [true, "Please Provide Product Description"],
    },
    rating: {
        type: Number,
        default: 4,
    },
    sizeVariation: {
        type: Number,
        default: 0,
    },
    productMrp: {
        type: Number,
        default: 0,
    },
    productPrice: {
        type: Number,
        default: 0,
    },
    availableQty: {
        type: Number,
        default: 50,
    },
    productMainImage: {
        type: String,
        required: [true, "Please Provide Product Main Image"],
    },
    productImage1: String,
    productImage2: String,
    productImage3: String,
    productImage4: String,
    productImage5: String,
    productVideo: String,
    showHide: {
        type: Boolean,
        default: true,
    },
    status: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });

module.exports = mongoose.model("product", products);