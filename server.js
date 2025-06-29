require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const winston = require('winston');

// Logger setup
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS']
}));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
  index: 'index.html'
});


// API routes
app.use('/api/game', require('./api/game'));
app.use('/api/leaderboard', require('./api/leaderboard'));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Server Error: ${err.message}`);
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Redis URL: ${process.env.REDIS_URL ? 'Set' : 'Missing'}`);
  logger.info(`Neynar API Key: ${process.env.NEYNAR_API_KEY ? 'Set' : 'Missing'}`);
});

// Add this above other routes
app.use('/api/health', require('./api/health'));

// Export for Vercel
module.exports = app;
