const cashfree = require('../config/cashfree')
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
    try {
        // 1. Get Cashfree order ID
        // 2. Ask Cashfree for payment status
        // 3. Check whether payment is SUCCESS
        // 4. If successful, update MongoDB order
        // 5. Send response
        const { order_id } = req.body;
        if (!order_id) {
            return res.status(400).json({
                message: 'Cashfree OrderId is required'
            })
        }
        const response = await cashfree.PGOrderFetchPayment(order_id);
        const payments = response.data;
        const successfullPayments = payments.find((x) => { x => x.status === 'success' }
        )
        if (!successfullPayments) {
            return res.status(400).json({
                message:"Payment is not successful",
                payments
            })
        }
        return res.status(200).json({message:'payment verfied successfully',successfullPayments})
    }
    catch (error) {
        return res.status(500).json({
            message: 'error occured in verfiying payment ', error: error.message
        })
    }
}
module.exports = { createOrder, verifyPayment }