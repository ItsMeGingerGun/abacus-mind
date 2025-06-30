require('../config/env')(); // Load environment first

module.exports = {
  appEnv: process.env.APP_ENV || 'development',
  port: process.env.PORT || 3000,
  redis: {
    url: process.env.REDIS_URL
  },
  neynar: {
    apiKey: process.env.NEYNAR_API_KEY,
    apiVersion: 'v2'
  },
  game: {
    expiration: parseInt(process.env.GAME_EXPIRATION) || 300,
    leaderboardSize: parseInt(process.env.LEADERBOARD_SIZE) || 10
  }
};
require('dotenv').config();

const config = {
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  neynar: {
    apiKey: process.env.NEYNAR_API_KEY || 'demo-key'
  },
  server: {
    port: process.env.PORT || 3000
  }
};

module.exports = config;
