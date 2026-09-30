const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUser, verifyOtp } = require('../controller/authController.js');
const { isAdmin } = require('../middleware/adminMiddleware');
const user = require('../model/user');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verifyOtp', verifyOtp); // Changed from /verify-email and removed protect middleware
router.get('/users', protect, isAdmin, getUser);

module.exports = router;
