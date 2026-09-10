const Cashfree = require('../config/cashfree')
const order = require('../model/order')
async function createOrder(req, res) {
    try {
        // we need verify the user id from the req 
        const orderId = await order.findOne({ _id: req.params.id, user: req.user.id })
        if (!orderId) {
            return res.status(400).json({ message: 'The orderId is not found in DataBase' })
        }
        const amount = orderId.amount
        const cashfreeOrder = {
            order_id: `order_${Date.now()}`,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: req.user._id.toString(),
                customer_phone: req.user.phone
            }
        };
        const response = await cashfree.PGCreateOrder(cashfreeOrder);
        return res.staus(200).json({
            message: 'CashFree payment order created successfully',
            order_id: response.data.order_id,
            payment_session_id: response.data.payment_session_id
        })
    }
    catch (error) {
        console.log('CashFree Error', error.message?.data || error.message)
        res.status(404).json({ message: 'The Error occured while creating payment order' })
    }
}
async function verifyPayment(req, res) {

}
module.exports = { createOrder, verifyPayment }