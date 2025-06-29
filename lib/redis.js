const { createClient } = require('redis');
const config = require('./config');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ]
});

const client = createClient({
  url: config.redis.url
});

client.on('error', (err) => {
  logger.error(`Redis Client Error: ${err.message}`);
});

client.on('connect', () => {
  logger.info('Redis connected successfully');
});

client.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

client.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Redis connected successfully');
  } catch (err) {
    console.error('Redis connection error:', err);
    setTimeout(connectRedis, 5000); // Reconnect after 5 seconds
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
