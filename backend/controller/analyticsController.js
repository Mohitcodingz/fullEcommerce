const order = require('../model/order')
const user = require('../model/user')
const product = require('../model/product')
async function getAdminStats(req, res) {
    try {

        //  total users count, 
        // send all users, orders, products in response
        const totalUser = await user.countDocuments({ role: 'user' });
        const totalOrder = await order.countDocuments();
        const totalProduct = await product.countDocuments();
        const orders = await order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        return res.status(200).json({message:"the Data fetched for admin dashboard analytics completely!",totalOrder,totalUser,totalProduct,totalRevenue})
    }
    catch (error) {
        return res.status(400).json({ message: 'The error occured in the getAdminStatus function', error: error.message })
    }
}
module.exports = { getAdminStats }