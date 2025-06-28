const { NeynarAPIClient } = require('@neynar/nodejs-sdk');
const config = require('./config');

const client = new NeynarAPIClient(config.neynar.apiKey);

const validateUser = async (signerUuid) => {
  try {
    const { fid, username } = await client.lookupSigner(signerUuid);
    return { fid, username };
  } catch (error) {
    console.error('Auth error:', error.message);
    return null;
  }
};

const getUsers = async (fids) => {
  try {
    const { users } = await client.fetchBulkUsers(fids);
    return users.reduce((map, user) => {
      map[user.fid] = user.username;
      return map;
    }, {});
  } catch (error) {
    console.error('User fetch error:', error.message);
    return {};
  }
};

module.exports = { validateUser, getUsers };
