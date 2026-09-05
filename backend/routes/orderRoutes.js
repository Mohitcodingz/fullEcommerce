const express = require('express'); 
const { isAdmin } = require('../middleware/adminMiddleware');
const { protect } = require('../middleware/authMiddleware');
const router = express.router()
router.route('/myOrders').get(protect,getOrderById);
router.route('/').post(protect, createOrder).get(protect,isAdmin,getOrder);
router.route(':id/status').put(protect,isAdmin,updateOrderLists )
module.exports = router