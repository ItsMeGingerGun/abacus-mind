import { NextResponse } from 'next/server';
import { getConfig } from '../../lib/config';
import { generateQuestion } from '../../lib/gameLogic';
import { clearTimer, startTimer } from '../../lib/timekeeper';
import { updateScore, getScore } from '../../lib/db';
import { DIFFICULTY } from '../../lib/constants';
import { getGameState, saveGameState, updateScore } from '../lib/db';



export default async function handler(req, res) {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid');
  const difficulty = url.searchParams.get('difficulty') || 'NOVICE';
  
  // Parse request body
  const body = await req.json();
  const buttonIndex = body.untrustedData?.buttonIndex;
  const state = JSON.parse(body.untrustedData?.state || '{}');
  
  // Get configuration
  const { baseUrl } = getConfig();
  
  // Determine operation based on button index
  const operations = ['+', '-', '×'];
  const userAnswer = buttonIndex >= 2 ? operations[buttonIndex - 2] : null;
  
  // Get current question from state
  const question = state.question || generateQuestion(difficulty);
  
  // Check if answer is correct
  const isCorrect = userAnswer === question.correctOp;
  
  // Update score
  await updateScore(fid, isCorrect, DIFFICULTY[difficulty].scoreMultiplier);
  
  // Clear previous timer and start new one
  clearTimer(fid);
  startTimer(fid, () => handleTimeout(fid));
  
  // Generate next question
  const nextQuestion = generateQuestion(difficulty);

  // Calculate elapsed time
const elapsed = Date.now() - state.timestamp;
const timeLimit = DIFFICULTY[state.difficulty].time * 1000;

if (elapsed > timeLimit) {
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/timeout-image" />
        <meta property="fc:frame:button:1" content="Time's Up! Play Again" />
      </head>
    </html>
  `);
}
   let gameState = await getGameState(fid) || {
    score: 0,
    difficulty: 'NOVICE',
    currentQuestion: null
  };
  
  // Process answer using existing game logic
  if (gameState.currentQuestion) {
    // This uses your existing game logic
    const isCorrect = checkAnswer(
      gameState.currentQuestion, 
      ['+', '-', '×'][buttonIndex - 2]
    );
    
    if (isCorrect) {
      // Calculate points with difficulty multiplier
      const multiplier = DIFFICULTY[gameState.difficulty].scoreMultiplier;
      const points = 10 * multiplier;
      gameState.score += points;
      
      // Update leaderboard in Redis
      await updateScore(fid, gameState.score);
    }
  }
  
  // Generate new question using existing logic
  gameState.currentQuestion = generateQuestion(gameState.difficulty);
  
  // Save updated state to Redis
  await saveGameState(fid, gameState);
  
  // Return next frame (UNCHANGED)
  res.status(200).json({
    frame: generateFrame(fid, gameState.currentQuestion, gameState.score),
  });
  // Prepare response
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/game?fid=${fid}&difficulty=${difficulty}" />
        <meta property="fc:frame:button:1" content="${nextQuestion.num1} ? ${nextQuestion.num2} = ${nextQuestion.num3}" />
        <meta property="fc:frame:button:2" content="+" />
        <meta property="fc:frame:button:3" content="-" />
        <meta property="fc:frame:button:4" content="×" />
        <meta property="og:title" content="${isCorrect ? '✅ Correct!' : '❌ Incorrect!'} - Abacus Mind" />
        <meta property="fc:frame:state" content="${JSON.stringify({ question: nextQuestion })}" />
      </head>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
res.send(html);
}
