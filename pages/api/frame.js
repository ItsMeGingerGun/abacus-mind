import { NextResponse } from 'next/server';
import { getConfig } from '../../lib/config';
import { generateQuestion } from '../../lib/gameLogic';
import { startTimer } from '../../lib/timekeeper';
import { saveGameState } from '../../lib/db';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const fid = url.searchParams.get('fid');
  const difficulty = url.searchParams.get('difficulty') || 'NOVICE';
  
  // Get configuration
  const { baseUrl } = getConfig();
  
  // Generate a new question
  const question = generateQuestion(difficulty);
  
  // Start the timer for this user
  startTimer(fid, () => handleTimeout(fid));

  // Proper state serialization
const state = {
  question: {
    num1: question.num1,
    num2: question.num2,
    num3: question.num3,
    correctOp: question.correctOp
  },
  difficulty,
  timestamp: Date.now()  // For timeout calculation
};

  await saveGameState(fid, {
    difficulty,
    score: 0,
    currentQuestion: question
  });

const stateString = encodeURIComponent(JSON.stringify(state));
  // Generate the frame HTML
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/game?fid=${fid}&difficulty=${difficulty}" />
        <meta property="fc:frame:button:1" content="${question.num1} ? ${question.num2} = ${question.num3}" />
        <meta property="fc:frame:button:2" content="+" />
        <meta property="fc:frame:button:3" content="-" />
        <meta property="fc:frame:button:4" content="×" />
        <meta property="og:title" content="Abacus Mind Math Challenge" />
        <meta property="fc:frame:state" content="${JSON.stringify({ question })}" />
      </head>
    </html>
  `;

  return new NextResponse(html);
}

// Handle timeout scenario
async function handleTimeout(fid) {
  // In a real implementation, this would update game state
  console.log(`Timeout for user ${fid}`);
  // Would typically: mark answer as wrong, update score, show results
}
