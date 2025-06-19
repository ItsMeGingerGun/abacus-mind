import { createClient } from '@vercel/kv';

export default createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Leaderboard methods
export async function updateLeaderboard(fid, score) {
  const db = createClient();
  await db.zadd('leaderboard', { score, member: fid });
}

export async function getLeaderboard(limit = 10) {
  const db = createClient();
  return db.zrange('leaderboard', 0, limit, { rev: true });
}
