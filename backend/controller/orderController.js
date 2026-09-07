const order = require('../model/order');
async function myOrders(req,res) {

}
async function createOrder(req, res) {
    try {
        const { product, totalAmount, address, paymentId } = req.body;
        if (!product || !product.productId || !product.quantity || !product.price || !address || !totalAmount || !paymentId) {
            return res.status(400).json({
                message: 'Invalid order Data'
            });
        }
        else {
            const orders = new order({
                user: req.user._id,
                product,
                totalAmount,
                address,
                paymentId
            })
            await orders.save()

            return res.status(201).json({
                message: 'Order created successfully',
                order: orders
            });
        }

    }
    catch (error) {
        res.status(202).json({ message: 'Error occured', error: error.message })
    }
}
async function getOrder(req,res) {
    try {
        const Orders = await order.find({});
           res.status(201).json({ message: "The data fetched successfully",Orders })
        
    }
    catch (error) {
        res.status(404).json({ message: 'The getOrder function got an error', error: error.message })
    }
}
async function getOrderById() {

}
async function updateOrderLists() {

}

module.exports = { getOrder, updateOrderLists, createOrder, myOrders }