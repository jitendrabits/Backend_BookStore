const model = require('../model/db');

const Order = model.order;

const statusCode = require("../config/status-codes");

const { ObjectId } = require('mongodb');

exports.getOrderHistory = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 })
            .populate({
                path: 'items.productId',
                select: 'name productSlug brand category productPrice productMainImage',
                model: 'product'
            })
            .exec();

        if (!orders || orders.length === 0) {
            return res.status(404).send({ message: 'No orders found for this user.' });
        }

        const transformedOrders = orders.map(order => ({
            orderId: order._id,
            subTotal: order.subTotal,
            gst: order.gst,
            shippingCharges: order.shippingCharges,
            totalCost: order.totalCost,
            paymentMethod: order.paymentMethod,
            shippingAddress: order.shippingAddress,
            status: order.status,
            orderDate: order.createdAt,
            items: order.items.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                brand: item.productId.brand,
                category: item.productId.category,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.productId.productMainImage
            }))
        }));

        res.status(200).json(transformedOrders);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getOrdersList = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = req.query.pageNo || 0;

        let pipeline = [
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            }
        ];

        let orderList = await Order.aggregate(pipeline).skip(page > 0 ? (page * pageSize) : 0).limit(pageSize);

        let dataCount = await Order.countDocuments();

        if (orderList.length > 0) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Order List fetched successfully",
                status: true,
                data: orderList,
                totalOrder: dataCount,
            });
        } else {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Order List is Empty",
                status: true,
                data: []
            });
        }
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error " + err.message,
            status: false,
            data: [],
        });
    }
};

exports.getOrdersDetails = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        let pipeline = [
            { $match: { _id: new ObjectId(orderId) } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" }
        ];

        let orderList = await Order.aggregate(pipeline);
        if (orderList.length > 0) {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Order List fetched successfully",
                status: true,
                data: orderList,
            });
        } else {
            res.status(statusCode.SUCCESS_CODE).send({
                message: "Order List is Empty",
                status: true,
                data: []
            });
        }
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send({
            message: "Internal Server Error " + err.message,
            status: false,
            data: [],
        });
    }
};

// New function to delete an order by orderId
exports.deleteOrderById = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const result = await Order.findByIdAndDelete(orderId);

        if (result) {
            res.status(200).send({ message: 'Order deleted successfully' });
        } else {
            res.status(404).send({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'An error occurred while deleting the order', error });
    }
};
