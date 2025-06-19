export function getDifficultyFrame(fid) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL}/set-difficulty?fid=${fid}" />
        <meta property="fc:frame:button:1" content="Padawan (Easy)" />
        <meta property="fc:frame:button:2" content="Jedi Knight (Medium)" />
        <meta property="fc:frame:button:3" content="Jedi Master (Hard)" />
        <meta property="og:title" content="Choose Your Difficulty" />
      </head>
    </html>
  `;
}
