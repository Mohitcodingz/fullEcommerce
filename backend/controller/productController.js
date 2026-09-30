const products = require('../model/product')
const cloudinary = require('cloudinary').v2;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const uploadBufferToCloudinary = (buffer, mimetype) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', format: mimetype?.split('/')[1] || undefined },
        (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
});
const getProducts = async (req, res) => {
    try {
        const NewProducts = await products.find();
        return res.json(NewProducts);
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
        res.json(product_id);
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

        const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
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
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (name !== undefined) product.name = name || product.name;
        if (description !== undefined) product.description = description || product.description;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category || product.category;
        if (stock !== undefined) product.stock = stock;
        if (req.file) {
            const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
            product.imageUrl = result.secure_url;
        }
        const updatedProduct = await product.save();
        return res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteProduct = async (req, res) => {
    try {
        const productid = await products.findById(req.params.id);
        if (!productid) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await productid.deleteOne();
        return res.json({ message: 'Product deleted successfully' });
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