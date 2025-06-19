import { FarcasterSignin } from '@farcaster/auth';

export default async function handler(req, res) {
  const { callbackUrl } = req.query;
  const signin = new FarcasterSignin({
    clientId: process.env.FARCASTER_CLIENT_ID,
    redirectUrl: `${process.env.VERCEL_URL}/auth/callback`,
  });

  const url = signin.getAuthUrl(callbackUrl);
  res.redirect(url);
}
