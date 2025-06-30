const axios = require('axios');
const config = require('./config');

const NEYNAR_API_URL = 'https://api.neynar.com';

// Validate user with error handling
const validateUser = async (signerUuid) => {
  try {
    const response = await axios.get(
      `${NEYNAR_API_URL}/v2/farcaster/signer?signer_uuid=${signerUuid}`,
      {
        headers: {
          'api_key': config.neynar.apiKey
        },
        timeout: 5000 // 5-second timeout
      }
    );
    
    return {
      fid: response.data.fid,
      username: response.data.username
    };
  } catch (error) {
    console.error('Neynar API Error:', error.response?.data || error.message);
    return null;
  }
};

module.exports = { validateUser };
