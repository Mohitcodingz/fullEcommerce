const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controller/paymentController');
const { protect } = require('../middleware/authMiddleware');  // ✅ ADD THIS IMPORT

router.post('/order/:id', protect, createOrder);  // ✅ Add :id param and protect middleware
router.post('/verify', verifyPayment);
 
module.exports = router
