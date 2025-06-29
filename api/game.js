const { validateUser } = require('../../lib/neynar');
const { generatePuzzle } = require('../../lib/game-logic');
const { cachePuzzle, getPuzzle, updateLeaderboard } = require('../../lib/redis');

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { signerUuid, difficulty = 'easy' } = req.body;
      const user = await validateUser(signerUuid);
      
      if (!user) return res.status(401).json({ error: 'Invalid Farcaster user' });

      const puzzle = generatePuzzle(difficulty);
      await cachePuzzle(user.fid, puzzle);

      return res.status(200).json({
        fid: user.fid,
        username: user.username,
        puzzle
      });
    } catch (error) {
      console.error('Game init error:', error);
      return res.status(500).json({ error: 'Game initialization failed' });
    }
  } 

  if (req.method === 'PUT') {
    try {
      const { signerUuid, answer } = req.body;
      const user = await validateUser(signerUuid);
      
      if (!user) return res.status(401).json({ error: 'Invalid Farcaster user' });

      const puzzle = await getPuzzle(user.fid);
      if (!puzzle) return res.status(404).json({ error: 'Puzzle expired or not found' });
      
      const isCorrect = Number(answer) === puzzle.answer;
      
      if (isCorrect) {
        const scores = { easy: 10, medium: 20, hard: 30 };
        await updateLeaderboard(user.fid, scores[puzzle.difficulty]);
      }

      return res.status(200).json({
        correct: isCorrect,
        correctAnswer: puzzle.answer
      });
    } catch (error) {
      console.error('Answer processing error:', error);
      return res.status(500).json({ error: 'Answer processing failed' });
    }
  }

  return res.status(405).end();
};
