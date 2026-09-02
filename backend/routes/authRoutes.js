const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUser } = require('../controller/authcontroller');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, admin, getUser);
module.exports = router;