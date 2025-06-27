import { createClient } from '@vercel/kv';
import { getConfig } from './config';

// Initialize database connection
let db;

function getDb() {
  if (!db) {
    const { kvUrl, kvToken } = getConfig();
    db = createClient({
      url: kvUrl,
      token: kvToken
    });
  }
  return db;
}
export async function updateScore(fid, isCorrect, difficulty) {
  const multiplier = DIFFICULTY[difficulty].scoreMultiplier;
  const score = isCorrect ? 10 * multiplier : -5;
  // ... save to DB
}
// Update user's score
export async function updateScore(fid, isCorrect, multiplier = 1) {
  const db = getDb();
  const score = isCorrect ? 10 * multiplier : -5;
  await db.zincrby('scores', score, fid);
  return score;
}

// Get user's current score
export async function getScore(fid) {
  const db = getDb();
  return await db.zscore('scores', fid) || 0;
}

// Add to your existing db.js

export async function getGameState(fid) {
  const state = await db.get(`game:${fid}`);
  return state ? JSON.parse(state) : null;
}

export async function saveGameState(fid, state) {
  await db.set(`game:${fid}`, JSON.stringify(state), {
    ex: 3600 // 1 hour expiration
  });
}

export async function updateScore(fid, score) {
  await db.zadd('leaderboard', { score, member: fid.toString() });
}
