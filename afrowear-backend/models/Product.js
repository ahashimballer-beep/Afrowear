const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['men', 'women', 'all']
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Product', productSchema);