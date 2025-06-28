const express = require('express');
const app = express();

// Serve static files
app.use(express.static('public'));

// Proxy API requests
app.use('/api', require('./api/game'));
app.use('/api', require('./api/leaderboard'));

module.exports = app;
