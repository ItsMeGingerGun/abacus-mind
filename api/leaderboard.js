const { getLeaderboard } = require('../lib/redis');
const { getUserByFid } = require('../lib/neynar');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const leaderboard = await getLeaderboard();

    // Format leaderboard with usernames
    const formatted = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await getUserByFid(entry.value);
        return {
          rank: index + 1,
          fid: entry.value,
          username: user ? user.username : `User#${entry.value}`,
          score: entry.score
        };
      })
    );

    res.status(200).json({ leaderboard: formatted });
  } catch (error) {
    logger.error(`Leaderboard error: ${error.message}`);
    res.status(500).json({ error: 'Leaderboard error' });
  }
};
