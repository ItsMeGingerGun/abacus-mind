const { validateUser } = require('../../lib/neynar');
const { generatePuzzle } = require('../../lib/game-logic');
const { cachePuzzle, getPuzzle, updateLeaderboard } = require('../../lib/redis');
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
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    if (req.method === 'POST') {
      const { signerUuid, difficulty = 'easy' } = req.body;
      
      if (!signerUuid) {
        logger.warn('Missing signerUuid in POST /api/game');
        return res.status(400).json({ error: 'Missing signerUuid' });
      }
      
      const user = await validateUser(signerUuid);

      if (!user) {
        winston.warn(`POST /api/game: Invalid user for signerUuid: ${signerUuid}`);
        return res.status(401).json({ error: 'Invalid Farcaster user' });
      }

      const puzzle = generatePuzzle(difficulty);
      await cachePuzzle(user.fid, puzzle);

      return res.status(200).json({
        fid: user.fid,
        username: user.username,
        puzzle
      });
    } 

    if (req.method === 'PUT') {
      const { signerUuid, answer } = req.body;
      
      if (!signerUuid || answer === undefined) {
        winston.warn('PUT /api/game: Missing required fields');
        return res.status(400).json({ error: 'Missing signerUuid or answer' });
      }
      
      const user = await validateUser(signerUuid);
      
      if (!user) {
        winston.warn(`PUT /api/game: Invalid user for signerUuid: ${signerUuid}`);
        return res.status(401).json({ error: 'Invalid Farcaster user' });
      }

      const puzzle = await getPuzzle(user.fid);
      if (!puzzle) {
        winston.warn(`PUT /api/game: Puzzle not found for fid: ${user.fid}`);
        return res.status(404).json({ error: 'Puzzle expired or not found' });
      }
      
      const isCorrect = Number(answer) === puzzle.answer;
      
      if (isCorrect) {
        const scores = { easy: 10, medium: 20, hard: 30 };
        await updateLeaderboard(user.fid, scores[puzzle.difficulty]);
      }

      return res.status(200).json({
        correct: isCorrect,
        correctAnswer: puzzle.answer
      });
    }

      return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    logger.error(`API Error in /api/game: ${error.message}`, { stack: error.stack });
    return res.status(500).json({ error: 'Internal server error' });
  }
};
