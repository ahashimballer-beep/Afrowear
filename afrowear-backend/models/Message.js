// afrowear-backend/models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    contactName: {
        type: String,
        required: true,
        trim: true
    },
    contactEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    contactSubject: {
        type: String,
        default: 'General Inquiry'
    },
    contactMessage: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;