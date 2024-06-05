//app.get('/api/reviews/:productId'
const model = require('../model/db');

const Order = model.order;

const ProductReview = model.review;



exports.getReviews = async (req, res) => {
    const { productId } = req.params;

    try {
        const reviews = await ProductReview.find({ productId });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

//app.post('/api/reviews'
exports.postReviews = async (req, res) => {
    const { productId, userId, rating, reviewText } = req.body;

    try {
        // Verify the user has purchased the product and the payment was successful
        const orderExists = await Order.findOne({
            userId,
            "items.productId": productId,
            status: 'paid' // Adjust based on your order schema's status for successful payment
        });

        if (!orderExists) {
            return res.status(403).json({ message: "Review can only be created by users who have purchased the product and where the payment was successful." });
        }

        const review = new ProductReview({
            productId,
            userId,
            rating,
            reviewText
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
