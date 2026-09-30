const cashfree = require('../config/cashfree');
const order = require('../model/order');

const cashfreeConfigured = () =>
    process.env.CASHFREE_API_KEY &&
    process.env.CASHFREE_API_SECRET &&
    process.env.CASHFREE_API_KEY !== 'missing-key';

async function createOrder(req, res) {
    try {
        if (!cashfreeConfigured()) {
            return res.status(503).json({
                message: 'Payments are not configured. Set CASHFREE_API_KEY and CASHFREE_API_SECRET in Railway Variables.',
            });
        }
        if (!req.params.id) {
            return res.status(400).json({ message: 'Order id param is required: POST /api/payments/order/:id' });
        }
        const orderId = await order.findOne({ _id: req.params.id, user: req.user._id || req.user.id });
        if (!orderId) {
            return res.status(404).json({ message: 'The orderId is not found in Database' });
        }
        const amount = Number(orderId.totalAmount || orderId.amount);
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Order has an invalid amount.' });
        }
        const cashfreeOrder = {
            order_id: `order_${Date.now()}`,
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: req.user._id.toString(),
                customer_email: req.user.email,
                // Cashfree requires a phone; user schema has no phone so use placeholder
                customer_phone: req.user.phone || '9999999999',
            },
        };
        const response = await cashfree.PGCreateOrder(cashfreeOrder);
        
        // ✅ VALIDATE response before accessing properties
        if (!response || !response.data || !response.data.order_id || !response.data.payment_session_id) {
            console.error('CashFree API returned invalid response:', JSON.stringify(response));
            return res.status(502).json({
                message: 'Failed to create payment order: invalid gateway response',
            });
        }

        await order.findByIdAndUpdate(orderId._id, { orderReference: response.data.order_id });

        return res.status(200).json({
            message: 'CashFree payment order created successfully',
            order_id: response.data.order_id,
            payment_session_id: response.data.payment_session_id
        })
    }
    catch (error) {
        console.error('CashFree Error creating order:', error.message, error.response?.data)
        res.status(500).json({ 
            message: 'Error occurred while creating payment order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}
async function verifyPayment(req, res) {
    try {
        if (!cashfreeConfigured()) {
            return res.status(503).json({
                message: 'Payments are not configured. Set CASHFREE_API_KEY and CASHFREE_API_SECRET in Railway Variables.',
            });
        }
        const { order_id } = req.body;
        if (!order_id) {
            return res.status(400).json({
                message: 'CashFree OrderId is required'
            })
        }
        
        // ✅ Call CashFree API to fetch payment status
        const response = await cashfree.PGOrderFetchPayment(order_id);
        
        // ✅ Validate response exists
        if (!response || !response.data) {
            console.error('CashFree API returned invalid response:', response);
            return res.status(502).json({
                message: 'Failed to fetch payment status from gateway',
            });
        }
        
        const payments = Array.isArray(response.data) ? response.data : [response.data];

        const successfulPayment = payments.find((x) => x && (x.payment_status === 'SUCCESS' || x.status === 'SUCCESS' || x.status === 'success'));
        
        if (!successfulPayment) {
            return res.status(400).json({
                message: "Payment is not successful",
                payments
            })
        }
        
        // ✅ Update order status in MongoDB
        const updatedOrder = await order.findOneAndUpdate(
            { orderReference: order_id },
            {
                status: 'paid',
                paymentId: String(successfulPayment.cf_payment_id || successfulPayment.cf_order_id || successfulPayment.payment_id || successfulPayment.id || order_id),
                paymentDetails: successfulPayment,
            },
            { new: true }
        );
        
        return res.status(200).json({
            message: 'Payment verified successfully',
            successfulPayment,
            orderUpdated: !!updatedOrder
        })
    }
    catch (error) {
        console.error('Error verifying payment:', error.message)
        return res.status(500).json({
            message: 'Error occurred while verifying payment',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}
module.exports = { createOrder, verifyPayment }
