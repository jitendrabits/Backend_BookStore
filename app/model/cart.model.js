const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    productSlug: String,
    brand: String,
    category: String,
    seller: String,
    productSmallDescription: String,
    productDescription: String,
    rating: Number,
    sizeVariation: Number,
    productMrp: Number,
    productPrice: Number,
    availableQty: Number,
    productMainImage: String,
    productImage1: String,
    productImage2: String,
    productImage3: String,
    productImage4: String,
    productImage5: String,
    productVideo: String,
    showHide: Boolean,
    status: Number,
    size: {
        type: String,
     },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [cartItemSchema],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('cart', cartSchema);
