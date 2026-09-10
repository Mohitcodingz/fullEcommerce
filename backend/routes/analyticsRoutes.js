const express = require('express');
const { isAdmin } = require('../middleware/adminMiddleware');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.route('/').get(protect, isAdmin, getAdminStats);
module.exports = router;