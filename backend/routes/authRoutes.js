const express = require('express');
const router = express.Router();
const { registerUser, LoginUser, getUser } = require('../controller/authcontroller');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, admin, getUser);
module.exports = router;