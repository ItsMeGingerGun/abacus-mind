const { NeynarAPIClient } = require('@neynar/nodejs-sdk');

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

// Validate Farcaster user
const validateUser = async (signerUuid) => {
  try {
    const user = await client.lookupSigner(signerUuid);
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

module.exports = { validateUser };
