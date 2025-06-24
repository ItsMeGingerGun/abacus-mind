import { createClient } from '@vercel/kv';

import { getConfig } from './config';
const { kvUrl, kvToken } = getConfig();
const db = createClient({ url: kvUrl, token: kvToken });

export async function getGameState(fid) {
  return await db.hgetall(`game:${fid}`) || {};
}

export async function setGameState(fid, state) {
  await db.hset(`game:${fid}`, state);
}

export async function updateLeaderboard(fid, score) {
  await db.zadd('leaderboard', { score, member: fid });
}

export async function getLeaderboard() {
  return await db.zrange('leaderboard', 0, 10, { rev: true });
}
