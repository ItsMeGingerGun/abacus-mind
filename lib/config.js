require('dotenv').config();
require('../config/env')(); // Load environment first

module.exports = {
  appEnv: process.env.APP_ENV || 'development',
  redis: {
    url: process.env.REDIS_URL
  },
  neynar: {
    apiKey: process.env.NEYNAR_API_KEY
  },
  game: {
    expiration: parseInt(process.env.GAME_EXPIRATION) || 300,
    leaderboardSize: parseInt(process.env.LEADERBOARD_SIZE) || 10
  }
};

module.exports = config;
