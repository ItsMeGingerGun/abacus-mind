const { getLeaderboard } = require('../../lib/redis');
const { NeynarAPIClient } = require('@neynar/nodejs-sdk');
const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

module.exports = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    
    // Get usernames
    const fids = leaderboard.map(item => item.value);
    const users = await neynar.fetchBulkUsers(fids);
    const userMap = users.reduce((map, user) => {
      map[user.fid] = user.username;
      return map;
    }, {});
    
    // Format leaderboard
    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      username: userMap[entry.value] || `User#${entry.value}`,
      score: entry.score
    }));

    res.status(200).json({ leaderboard: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Leaderboard error' });
  }
};
