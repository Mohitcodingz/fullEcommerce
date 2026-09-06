const order = require('../model/order')
async function getOrderById() {

}
async function createOrder(req, res) {
    try {
        const { items, totalAmount, address, paymentId } = req.body;
        if (!items || items.length === 0 || !address || !totalAmount) {
            return res.status(404).json({ message: 'Invalid order Data' })
        }
        else{
            const orders = new order.create({
                user:req.user._id,
                items,
                totalAmount,
                address,
                paymentId   
            })
            await orders.save();
         
        }
    }
    catch (error) {
        res.status(202).json({ message: 'Error occured', error })
    }
}
async function getOrder() {

}
async function getOrderById() {

}
async function updateOrderLists() {

}
