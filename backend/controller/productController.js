const products = require('../model/product')
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const getProducts = async (req, res) => {
    try {
        const NewProducts = await products.find();
        res.json(NewProducts);
        if (!NewProducts) {
            return res.status(404).json({ message: 'No products found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getProductById = async (req, res) => {
    try {
        const product_id = await products.findById(req.params.id);
        if (!product_id) {
            return res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required' });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        console.log(result);

        const product = new products({
            name,
            description,
            price,
            category,
            stock,
            imageUrl: result.secure_url
        });
        await product.save();
        res.status(201).json(product);

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await products.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            await product.save();
            res.json(product);
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            product.imageUrl = result.secure_url;
            console.log(result);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteProduct = async (req, res) => {
    try {
        const productid = await products.findById(req.params.id);
        if (productid) {
            await productid.deleteOne();
            res.json({ message: 'Product deleted successfully' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}