const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    // FIX: Changed to String for better compatibility with frontend string IDs
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: Number,
    quantity: {
        type: Number,
        required: true
    },
}, { _id: false });

const quoteRequestSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    phoneNumber: { type: String },
    shippingAddress: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },

    items: [itemSchema],

    // FIX: totalAmount is no longer required
    totalAmount: { type: Number },
    submissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);