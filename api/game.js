import { NextResponse } from 'next/server';
import { getGameState, saveGameState, updateLeaderboard } from '../../lib/db';
import { generateQuestion, checkAnswer } from '../../lib/gameLogic';
import { DIFFICULTY } from '../../lib/constants';
import { getConfig } from '../../lib/config';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const fid = url.searchParams.get('fid');
    const difficultyParam = url.searchParams.get('difficulty') || 'NOVICE';

    // Validate difficulty
    const validDifficulties = Object.keys(DIFFICULTY);
    const difficulty = validDifficulties.includes(difficultyParam) 
      ? difficultyParam 
      : 'NOVICE';

    // Load game state
    let gameState = await getGameState(fid);
    if (!gameState) {
      gameState = initGameState(difficulty);
    }

    // Check for timeout
    if (isTimedOut(gameState)) {
      return timeoutResponse(fid);
    }

    // Process user action
    if (req.method === 'POST') {
      const body = await req.json();
      const buttonIndex = body.untrustedData?.buttonIndex || 0;
      
      if (buttonIndex >= 2 && gameState.currentQuestion) {
        const operations = ['+', '-', '×'];
        const userAnswer = operations[buttonIndex - 2];
        
        if (checkAnswer(gameState.currentQuestion, userAnswer)) {
          const multiplier = DIFFICULTY[gameState.difficulty].scoreMultiplier;
          gameState.score += 10 * multiplier;
          await updateLeaderboard(fid, gameState.score);
        }
      }
    }

    // Generate new question and update state
    gameState.currentQuestion = generateQuestion(gameState.difficulty);
    gameState.lastUpdated = Date.now();
    await saveGameState(fid, gameState);

    return new NextResponse(generateFrameHtml(fid, gameState), {
      headers: { 'Content-Type': 'text/html' }
    });
    
  } catch (error) {
    console.error('Game handler error:', error);
    return new NextResponse(errorFrame(), {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Helper functions
function initGameState(difficulty) {
  return {
    score: 0,
    difficulty,
    currentQuestion: null,
    lastUpdated: Date.now()
  };
}

function isTimedOut(gameState) {
  const elapsed = Date.now() - gameState.lastUpdated;
  const timeLimit = DIFFICULTY[gameState.difficulty].time * 1000;
  return elapsed > timeLimit;
}

function timeoutResponse(fid) {
  const { baseUrl } = getConfig();
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/timeout.png" />
        <meta property="fc:frame:button:1" content="Time's Up! Play Again" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/restart?fid=${fid}" />
      </head>
    </html>
  `);
}

function generateFrameHtml(fid, gameState) {
  const { baseUrl } = getConfig();
  const q = gameState.currentQuestion;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/game?fid=${fid}" />
        <meta property="fc:frame:image" content="${baseUrl}/api/image?score=${gameState.score}" />
        <meta property="fc:frame:button:1" content="${q.num1} ? ${q.num2} = ${q.num3}" />
        <meta property="fc:frame:button:2" content="+" />
        <meta property="fc:frame:button:3" content="-" />
        <meta property="fc:frame:button:4" content="×" />
        <meta property="og:title" content="Score: ${gameState.score}" />
      </head>
    </html>
  `;
}

function errorFrame() {
  const { baseUrl } = getConfig();
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/error.png" />
        <meta property="fc:frame:button:1" content="Error Occurred - Try Again" />
      </head>
    </html>
  `;
}
