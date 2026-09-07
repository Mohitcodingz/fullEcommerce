const express = require('express'); 
const { isAdmin } = require('../middleware/adminMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {createOrder, getOrder, myOrders, updateOrderLists,} = require('../controller/orderController');

const router = express.Router()
router.route('/').post(protect, createOrder).get(protect,isAdmin,getOrder);
router.route('/myOrders').get(protect, myOrders);
router.route('/:id/status').put(protect,isAdmin,updateOrderLists )
module.exports = router