const express = require('express');
const router = express.Router();
const QuoteRequest = require('../models/QuoteRequest');
const mongoose = require('mongoose');

router.post('/', async(req, res) => {

    const data = req.body;

    // --- DIAGNOSTIC LOGGING ---
    // CRITICAL: This will show exactly what data the backend received.
    console.log('--- Incoming Quote Data ---');
    console.log(data);
    console.log('---------------------------');

    // 1. Check for empty body (Signifies missing express.json() in server.js or CORS issue)
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'Request body is empty. Please check your server.js for app.use(express.json()).' });
    }

    const {
        fullName,
        emailAddress,
        shippingAddress,
        items,
        city,
        country,
        phoneNumber,
        totalAmount
    } = data;

    // 2. Basic required field checks (Failsafe before Mongoose)
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cannot submit an empty quote request. Please add items to your cart.' });
    }

    // Create the new quote object
    const newQuote = new QuoteRequest({
        fullName,
        emailAddress,
        shippingAddress,
        items,
        totalAmount: totalAmount || 0, // Fallback to 0
        city,
        country,
        phoneNumber
    });

    try {
        const savedQuote = await newQuote.save();

        res.status(201).json({
            message: 'Quote request submitted successfully!',
            quoteId: savedQuote._id
        });
    } catch (err) {
        // --- MONGODB/MONGOOSE ERROR HANDLING ---

        // CRITICAL: Log the full error stack to the server console
        console.error('Quote submission failed (Mongoose Error):', err);

        // 3. Handle Validation Errors (The most common cause of failure)
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => `${val.path}: ${val.message}`);

            // Send the explicit Mongoose validation error message back to the frontend
            return res.status(400).json({
                message: 'Validation Failed: ' + messages.join(', '),
                details: err.errors // Optional: for rich debugging
            });
        }

        // Handle other possible errors (like Mongoose casting errors, 500 server errors)
        res.status(500).json({
            message: 'Failed to save quote request to the database due to an unexpected server error.',
            error: err.message
        });
    }
});

module.exports = router;