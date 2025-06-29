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
  url: config.redis.url,
  socket: {
    tls: true,            // Required for Upstash
    rejectUnauthorized: false
  }
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

// Puzzle caching functions
const cachePuzzle = async (fid, puzzle) => {
  try {
    await client.set(`puzzle:${fid}`, JSON.stringify(puzzle), {
      EX: 300 // 5 minutes expiration
    });
    logger.info(`Puzzle cached for fid: ${fid}`);
  } catch (error) {
    logger.error(`Error caching puzzle: ${error.message}`);
    throw error;
  }
};

const getPuzzle = async (fid) => {
  try {
    const puzzleData = await client.get(`puzzle:${fid}`);
    if (!puzzleData) {
      logger.warn(`No puzzle found for fid: ${fid}`);
      return null;
    }
    return JSON.parse(puzzleData);
  } catch (error) {
    logger.error(`Error getting puzzle: ${error.message}`);
    throw error;
  }
};

// Leaderboard functions
const updateLeaderboard = async (fid, score) => {
  try {
    await client.zAdd('leaderboard', [{ score, value: fid.toString() }]);
    logger.info(`Leaderboard updated for fid: ${fid}, score: ${score}`);
  } catch (error) {
    logger.error(`Error updating leaderboard: ${error.message}`);
    throw error;
  }
};

const getLeaderboard = async () => {
  try {
    return await client.zRangeWithScores('leaderboard', 0, 9, { REV: true });
  } catch (error) {
    logger.error(`Error getting leaderboard: ${error.message}`);
    throw error;
  }
};

module.exports = { 
  client, 
  cachePuzzle, 
  getPuzzle, 
  updateLeaderboard, 
  getLeaderboard 
};
