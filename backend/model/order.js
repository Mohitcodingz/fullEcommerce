const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: false
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    address: {
        fullName: { type: String, default: 'Customer' },
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        pincode: { type: String, default: '' },
        country: { type: String, default: 'India' }
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', Schema);