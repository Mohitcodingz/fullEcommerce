const order = require("../model/order");
const user = require("../model/user");

async function myOrders(req, res) {
    try {
        const orders = await order.find({ user: req.user._id })
            .populate('product.productId')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "Your Orders are fetched successfully", orders });
    } catch (error) {
        res.status(500).json({ message: "The error occurred while fetching myOrders", error: error.message });
    }
}

async function createOrder(req, res) {
    try {
        const { product, items, products, totalAmount, address, paymentId } = req.body;

        const rawList = Array.isArray(items) ? items : (Array.isArray(products) ? products : (product ? [product] : []));
        const firstItem = rawList[0] || product;

        if (!firstItem && !totalAmount) {
            return res.status(400).json({ message: "Invalid order data: Missing items or amount" });
        }

        const normalizedAddress = address ? {
            fullName: address.fullName || req.user?.name || 'Customer',
            street: address.street || 'Address Line',
            city: address.city || 'City',
            pincode: address.pincode || address.postalCode || '000000',
            country: address.country || 'India'
        } : {
            fullName: req.user?.name || 'Customer',
            street: 'Standard Delivery',
            city: 'Metro',
            pincode: '000000',
            country: 'India'
        };

        const newOrder = new order({
            user: req.user._id,
            product: {
                productId: firstItem?.productId || firstItem?._id || req.body.productId,
                quantity: Number(firstItem?.qty || firstItem?.quantity) || 1,
                price: Number(firstItem?.price) || Number(totalAmount) || 0
            },
            totalAmount: Number(totalAmount) || Number(firstItem?.price) || 0,
            address: normalizedAddress,
            paymentId: paymentId || `pay_sim_${Date.now()}`,
            status: 'pending'
        });

        await newOrder.save();

        return res.status(201).json({
            message: "Order created successfully",
            order: newOrder
        });
    } catch (error) {
        console.error("Order creation error:", error.message);
        res.status(400).json({ message: "Order creation error", error: error.message });
    }
}

async function getOrder(req, res) {
    try {
        const Orders = await order.find({})
            .populate('user', 'name email')
            .populate('product.productId')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: "The data fetched successfully", Orders });
    } catch (error) {
        res.status(404).json({
            message: "The getOrder function got an error",
            error: error.message
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const targetOrder = await order.findById(req.params.id);
        if (!targetOrder) {
            return res.status(404).json({ message: "There is no Order matching this Order Id." });
        }
        targetOrder.status = req.body.status || targetOrder.status;
        await targetOrder.save();
        res.status(200).json({ message: 'The status of this order has been updated', orderStatus: targetOrder });
    } catch (error) {
        res.status(404).json({
            message: "Error updating order status",
            error: error.message
        });
    }
}

module.exports = { getOrder, updateOrderStatus, createOrder, myOrders };
