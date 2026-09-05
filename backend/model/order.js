const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    product: {
        productId: { types: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { types: Number, required: true, min: 1 },
        price:{types:Number, required:true}
    },
    totalAmount: {
        type: Number,
        required: true
    },
    address: {
        fullName: { types: String, required: true },
        street: { types: String, required: true },
        city: { types: String, required: true },
        pincode: { types: String, required: true },
        country: { types: String, required: true }
    },
    paymentId: {
        types: String, required: true
    },
    status: { types: String, default: pending, enum: ['pending', 'shipped', 'delivered'] }
}, { timestamps: true })
module.exports = new mongoose.model(Order, Schema)