const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { isAdmin } = require('../middleware/adminMiddleware.js');
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('../controller/productController.js');
const multer = require('multer');

// Railway has an ephemeral filesystem: never use disk storage for uploads.
// Keep the file in memory and stream the buffer straight to Cloudinary.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    },
});
router.route('/').get(getProducts).post(protect, isAdmin, upload.single('image'), createProduct);
router.route('/:id').get(getProductById).put(protect, isAdmin, upload.single('image'), updateProduct).delete(protect, isAdmin, deleteProduct);
module.exports = router;