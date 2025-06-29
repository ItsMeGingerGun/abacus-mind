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
