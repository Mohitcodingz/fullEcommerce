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
    totalAmount: {  // ✅ Rename to match what you're calling it
        type: Number,
        required: true
    },
    amount: {  // ✅ ADD: Alternative field name used in paymentController
        type: Number,
        default: null
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
    orderReference: {  // ✅ ADD: Store CashFree order_id
        type: String,
        default: null
    },
    paymentDetails: {  // ✅ ADD: Store full CashFree response
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],  // ✅ Added 'paid'
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', Schema);
