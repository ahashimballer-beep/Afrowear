const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- 1. SETUP ---
const app = express();
const PORT = process.env.PORT || 5000;
// REPLACE THIS WITH YOUR ACTUAL MONGODB CONNECTION STRING
const MONGODB_URI = 'mongodb+srv://afrowear_admin:wR86gFrXZEclL7p8@cluster0.yiltscp.mongodb.net/afrowearDB?appName=Cluster0';

// --- 2. MIDDLEWARE (CRITICAL FIXES) ---

// Enable CORS for all origins (allowing frontend on 3000 to talk to backend on 5000)
app.use(cors());

// FIX: Body Parser - This is CRUCIAL for reading JSON data (req.body) from POST requests
app.use(express.json());

// Serve static files from the frontend folder
// Assuming your frontend HTML/JS/CSS is in a folder named 'frontend'
// app.use(express.static('frontend')); 
// If you are serving your frontend separately, you can skip the line above

// --- 3. DATABASE CONNECTION ---

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connection successful.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- 4. ROUTER IMPORTS ---

// Assuming you have a file named 'productRoute.js'
const productRoutes = require('./routes/productRoutes');
// Assuming you have a file named 'messageRoute.js'
const messageRoutes = require('./routes/messageRoutes');
// Assuming you have a file named 'quoteroute.js'
const quoteRoutes = require('./routes/quoteRoutes');

// --- 5. ROUTER MOUNTING ---

// Mount routers under their respective API endpoints
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
// FIX: Ensure the quote router is mounted correctly
app.use('/api/quotes', quoteRoutes);

// --- 6. SERVER START ---

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});