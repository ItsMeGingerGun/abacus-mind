import { DIFFICULTY } from '../../lib/constants';
import { updateLeaderboard } from '../../lib/db';

export default async function handler(req, res) {
  const { fid, buttonIndex } = req.body.untrustedData;
  
  // Get current game state
  const gameState = await getGameState(fid);
  
  // Handle difficulty selection
  if (gameState.stage === 'difficulty') {
    const levels = Object.values(DIFFICULTY);
    const selected = levels[buttonIndex - 1];
    await setDifficulty(fid, selected);
    return res.json(generateQuestionFrame(fid, selected));
  }

  // Handle answer submission
  const isCorrect = checkAnswer(gameState, buttonIndex);
  await updateScore(fid, isCorrect);
  
  // Prepare next frame
  if (gameState.timeLeft <= 0) {
    const score = await getScore(fid);
    await updateLeaderboard(fid, score);
    return res.json(generateResultFrame(fid, score));
  }
  
  res.json(generateQuestionFrame(fid, gameState.difficulty));
}
