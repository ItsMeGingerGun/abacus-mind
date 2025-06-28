const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); // Add this

app.use(cors()); // Enable CORS

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/game', require('./api/game'));
app.use('/api/leaderboard', require('./api/leaderboard'));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export for Vercel
module.exports = app;
