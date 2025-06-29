const axios = require('axios');
const config = require('./config');

const NEYNAR_API_URL = 'https://api.neynar.com';

// Validate Farcaster user
const validateUser = async (signerUuid) => {
  try {
    const response = await axios.get(
      `${NEYNAR_API_URL}/v2/farcaster/signer?signer_uuid=${signerUuid}`,
      {
        headers: {
          'api_key': config.neynar.apiKey
        }
      }
    );
    
    const { fid, username } = response.data;
    return { fid, username };
  } catch (error) {
    console.error('Auth error:', error.message);
    return null;
  }
};

// Get bulk users
const getUsers = async (fids) => {
  try {
    const response = await axios.post(
      `${NEYNAR_API_URL}/v2/farcaster/user/bulk`,
      { fids },
      {
        headers: {
          'api_key': config.neynar.apiKey,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.users.reduce((map, user) => {
      map[user.fid] = user.username;
      return map;
    }, {});
  } catch (error) {
    console.error('User fetch error:', error.message);
    return {};
  }
};

module.exports = { validateUser, getUsers };
const config = require('./config');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Mock Neynar API integration for development
const validateUser = async (signerUuid) => {
  try {
    // For development/demo purposes, return a mock user
    // In production, this would make an actual API call to Neynar
    if (!signerUuid) {
      return null;
    }
    
    // Mock user data
    return {
      fid: Math.floor(Math.random() * 10000) + 1000,
      username: `user_${signerUuid.substring(0, 8)}`,
      displayName: `Demo User`,
      pfpUrl: null,
      signerUuid
    };
  } catch (error) {
    logger.error(`Error validating user: ${error.message}`);
    return null;
  }
};

// Get user profile by FID
const getUserByFid = async (fid) => {
  try {
    // Mock implementation for demo
    return {
      fid,
      username: `user_${fid}`,
      displayName: `Demo User ${fid}`,
      pfpUrl: null
    };
  } catch (error) {
    logger.error(`Error getting user by FID: ${error.message}`);
    return null;
  }
};

module.exports = {
  validateUser,
  getUserByFid
};
