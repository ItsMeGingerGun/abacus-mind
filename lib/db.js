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
