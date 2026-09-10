const { Cashfree, CFEnvironment } = require('cashfree-pg');
require('dotenv').config();
const cashfree = new Cashfree({
    cashfree_Env: CFEnvironment.SANDBOX,
    api_key: process.env.RAZORPAY_API_KEY,
    api_secret: process.env.RAZORPAY_API_SECRET
})
module.exports = cashfree