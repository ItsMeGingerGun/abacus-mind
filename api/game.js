import { NextResponse } from 'next/server';
import { getConfig } from '../../lib/config';
import { getGameState, saveGameState, updateScore } from '../../lib/db';
import { generateQuestion, checkAnswer } from '../../lib/gameLogic';
import { DIFFICULTY } from '../../lib/constants';

export const config = {
  runtime: 'edge',
};

async function handleTimeout(fid) {
  // Implement your timeout logic here
}

export default async function handler(req) {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid');
  const difficulty = url.searchParams.get('difficulty') || 'NOVICE';
  
  const body = await req.json();
  const buttonIndex = body.untrustedData?.buttonIndex;
  const state = JSON.parse(body.untrustedData?.state || '{}');
  
  const { baseUrl } = getConfig();
  const operations = ['+', '-', '×'];
  const userAnswer = buttonIndex >= 2 ? operations[buttonIndex - 2] : null;
  
  // Get game state from DB
  let gameState = await getGameState(fid) || {
    score: 0,
    difficulty: 'NOVICE',
    currentQuestion: null,
    lastUpdated: Date.now()
  };

  // Check timeout first
  const elapsed = Date.now() - gameState.lastUpdated;
  const timeLimit = DIFFICULTY[gameState.difficulty].time * 1000;
  
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
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  // Process answer
  if (gameState.currentQuestion && buttonIndex >= 2) {
    const isCorrect = checkAnswer(
      gameState.currentQuestion, 
      operations[buttonIndex - 2]
    );
    
    if (isCorrect) {
      const multiplier = DIFFICULTY[gameState.difficulty].scoreMultiplier;
      const points = 10 * multiplier;
      gameState.score += points;
      await updateScore(fid, gameState.score);
    }
  }

  // Generate new question and update state
  gameState.currentQuestion = generateQuestion(gameState.difficulty);
  gameState.lastUpdated = Date.now();
  await saveGameState(fid, gameState);

  // Prepare response
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/game?fid=${fid}&difficulty=${difficulty}" />
        <meta property="fc:frame:button:1" content="${gameState.currentQuestion.num1} ? ${gameState.currentQuestion.num2} = ${gameState.currentQuestion.num3}" />
        <meta property="fc:frame:button:2" content="+" />
        <meta property="fc:frame:button:3" content="-" />
        <meta property="fc:frame:button:4" content="×" />
        <meta property="og:title" content="Abacus Mind - Score: ${gameState.score}" />
        <meta property="fc:frame:state" content="${JSON.stringify({ question: gameState.currentQuestion })}" />
      </head>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
