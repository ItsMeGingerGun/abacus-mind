import { NeynarAPIClient } from '@neynar/nodejs-sdk';

import { getConfig } from '../lib/config';
const { farcasterApiKey } = getConfig();
const client = new NeynarAPIClient(farcasterApiKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Generate auth URL
    const authUrl = `https://app.neynar.com/login?callback_url=${encodeURIComponent(
      `${process.env.VERCEL_URL}/api/auth/callback`
    )}`;
    res.redirect(authUrl);
  } else {
    // Handle callback
    const { token } = req.query;
    try {
      const user = await client.lookupUserByToken(token);
      res.setHeader('Set-Cookie', `fid=${user.fid}; Path=/; HttpOnly`);
      res.redirect('/');
    } catch (error) {
      res.status(400).json({ error: 'Invalid token' });
    }
  }
}
