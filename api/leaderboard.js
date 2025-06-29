const { getLeaderboard } = require('../../lib/redis');
const { getUsers } = require('../../lib/neynar');

module.exports = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    
    // Extract FIDs
    const fids = leaderboard.map(item => item.value);
    
    // Get usernames
    const users = await getUsers(fids);
    
    // Format leaderboard
    const formatted = leaderboard.map((entry, index) => ({
      rank: index + 1,
      fid: entry.value,
      username: users[entry.value] || `User#${entry.value}`,
      score: entry.score
    }));

    res.status(200).json({ leaderboard: formatted });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Leaderboard error' });
  }
};
