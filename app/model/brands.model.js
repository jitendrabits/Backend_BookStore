const mongoose = require('mongoose');

const brands = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide Brand Name"],
    },
    brand_slug: {
        type: String,
        required: [true, "Please Provide Brand Slug"],
    },
    show_hide: {
        type: Boolean,
        default: true,
    },
    brand_image: String,
    status: Number,
}, { timestamps: true });

module.exports = mongoose.model("brand", brands);