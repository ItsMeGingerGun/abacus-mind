// Corrected server.js file
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const winston = require('winston');
const { client: redisClient } = require('./lib/redis');

// Logger configuration
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

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), {
  index: 'index.html'
}));

// API routes
app.use('/api/game', require('./api/game'));
app.use('/api/leaderboard', require('./api/leaderboard'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const redisStatus = redisClient.isReady ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    redis: redisStatus,
    environment: {
      REDIS_URL: !!process.env.REDIS_URL,
      NEYNAR_API_KEY: !!process.env.NEYNAR_API_KEY
    }
  });
});

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(`Server Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Redis URL: ${process.env.REDIS_URL ? 'Set' : 'Missing'}`);
  logger.info(`Neynar API Key: ${process.env.NEYNAR_API_KEY ? 'Set' : 'Missing'}`);
});

module.exports = app;
