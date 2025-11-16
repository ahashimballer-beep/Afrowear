// afrowear-backend/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Import the new model

// POST /api/messages - Handles new message submission
router.post('/', async(req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json({ message: 'Message submitted successfully!', messageId: newMessage._id });
    } catch (error) {
        // Send a detailed error message if validation fails
        res.status(400).json({ message: 'Error saving message.', error: error.message });
    }
});

module.exports = router;