const model = require('../model/db');

const Order = model.order;

const Cart = model.cart;


exports.paymentCallback = async (req, res, next) => {
    const { userId, orderId, transactionId, transactionTime, paymentStatus } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send({ message: 'Order not found.' });
        }

        order.paymentDetails = {
            transactionId,
            transactionTime: new Date(transactionTime),
            paymentStatus
        };

        if (paymentStatus == 'success') {
            order.status = 'paid';
        } else if (paymentStatus == 'failed') {
            order.status = 'payment_failed';
        }

        await Order.findOneAndUpdate(
            { _id: orderId },
            { $set: order },
            { new: true }
        );
        await Cart.findOneAndDelete({ userId });

        console.log(`Cart deleted for user ${userId} as the order was placed with Cash on Delivery.`);

        res.status(200).send({ message: 'Payment details updated successfully.', data: order });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
