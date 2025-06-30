const { createClient } = require('redis');
const config = require('./config');
const winston = require('winston');

// Create Redis client with proper TLS configuration
const client = createClient({
  url: config.redis.url,
  socket: {
    tls: true,  // REQUIRED for Upstash
    rejectUnauthorized: false
  }
});

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ]
});

// Add connection event handlers
client.on('connect', () => console.log('Redis connecting...'));
client.on('ready', () => console.log('Redis connected!'));
client.on('error', (err) => console.error('Redis Client Error', err));
client.on('end', () => console.log('Redis disconnected'));

// Connect to Redis with retry logic
const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Redis connection error:', err);
    setTimeout(connectRedis, 5000); // Retry after 5 seconds
  }
};

connectRedis();

client.connect();

// Leaderboard functions
const updateLeaderboard = async (fid, score) => {
  await client.zAdd('leaderboard', [{ score, value: fid.toString() }]);
};

const getLeaderboard = async () => {
  return await client.zRangeWithScores('leaderboard', 0, 9, { REV: true });
};

module.exports = { client, updateLeaderboard, getLeaderboard };
