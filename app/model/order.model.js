const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    shippingCharges: {
        type: Number,
        required: true
    },
    items: [orderItemSchema],
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    shippingStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: String,
    paymentMethod: {
        type: String,
        required: true
    },
    paymentDetails: {
        transactionId: String,
        transactionTime: Date,
        paymentStatus: {
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending'
        },
    }
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema);
