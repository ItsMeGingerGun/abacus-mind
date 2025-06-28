const { validateUser } = require('../../lib/neynar');
const { generatePuzzle } = require('../../lib/game-logic');
const { updateLeaderboard } = require('../../lib/redis');

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method === 'POST') {
    try {
      const { signerUuid, difficulty = 'easy' } = req.body;
      
      // Validate user
      const user = await validateUser(signerUuid);
      if (!user) return res.status(401).json({ error: 'Invalid user' });

      // Generate puzzle
      const puzzle = generatePuzzle(difficulty);
      
      // Store puzzle in Redis (for answer verification)
      await client.set(`puzzle:${user.fid}`, JSON.stringify(puzzle), {
        EX: 300 // 5min expiration
      });

      res.status(200).json({
        fid: user.fid,
        username: user.username,
        puzzle
      });
    } catch (error) {
      res.status(500).json({ error: 'Game error' });
    }
  } else if (req.method === 'PUT') {
    // Submit answer
    const { signerUuid, answer } = req.body;
    const user = await validateUser(signerUuid);
    
    // Retrieve puzzle
    const puzzleData = await client.get(`puzzle:${user.fid}`);
    if (!puzzleData) return res.status(404).json({ error: 'Puzzle expired' });
    
    const puzzle = JSON.parse(puzzleData);
    const isCorrect = Number(answer) === puzzle.answer;
    
    if (isCorrect) {
      // Update leaderboard (10/20/30 points based on difficulty)
      const scores = { easy: 10, medium: 20, hard: 30 };
      await updateLeaderboard(user.fid, scores[puzzle.difficulty]);
    }

    res.status(200).json({
      correct: isCorrect,
      correctAnswer: puzzle.answer
    });
  } else {
    res.status(405).end();
  }
};
