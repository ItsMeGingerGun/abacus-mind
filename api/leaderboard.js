import { getLeaderboard } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const leaderboard = await getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
}
