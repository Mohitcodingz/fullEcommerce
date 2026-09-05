const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUser,verifyOtp } = require('../controller/authcontroller');
const { isAdmin } = require('../middleware/adminMiddleware');
const user = require('../model/user')
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, isAdmin, getUser);
router.post('/verify-email', protect, verifyOtp)
module.exports = router;