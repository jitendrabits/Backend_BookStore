const mongoose = require('mongoose');

const categorys = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide Category Name"],
    },
    categorySlug: {
        type: String,
        required: [true, "Please Provide Category Slug"],
    },
    showHide: {
        type: Boolean,
        default: true,
    },
    categoryImage: {
        type: String,
        required: [true, "Please Provide Category Image"],
    },
    status: Number,
}, { timestamps: true });

module.exports = mongoose.model("categorys", categorys);