const Cashfree = require('../config/cashfree')
const order = require('../model/order')
async function createOrder(req, res) {
    try {
        const findAmount =await order.findOne({
            amount: req.body.amount,
            _id: req.params.id
        });
        if (!findAmount) {
            return res.status(404).json({ message: 'The Data is Invalid' })
        }
 const cashfreeAmount =         findAmount.amount

    }
    catch (error) {

    }
}
async function verifyPayment(req, res) {

}
module.exports = { createOrder, verifyPayment }