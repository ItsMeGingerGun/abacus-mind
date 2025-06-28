const { createClient } = require('redis');

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

// Leaderboard functions
const updateLeaderboard = async (fid, score) => {
  await client.zAdd('leaderboard', [{ score, value: fid.toString() }]);
};

const getLeaderboard = async () => {
  return await client.zRangeWithScores('leaderboard', 0, 9, { REV: true });
};

module.exports = { client, updateLeaderboard, getLeaderboard };
