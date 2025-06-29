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
const { getLeaderboard } = require('../lib/redis');
const { getUserByFid } = require('../lib/neynar');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

module.exports = async (req, res) => {
  try {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      const leaderboardData = await getLeaderboard();
      
      // Transform Redis data to include usernames
      const leaderboard = await Promise.all(
        leaderboardData.map(async (entry, index) => {
          const user = await getUserByFid(parseInt(entry.value));
          return {
            rank: index + 1,
            fid: parseInt(entry.value),
            username: user?.username || `User ${entry.value}`,
            score: entry.score
          };
        })
      );

      return res.status(200).json({ leaderboard });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    logger.error(`Leaderboard API Error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
