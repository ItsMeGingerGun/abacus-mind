export default async function handler(req) {
  const { fid, score } = req.query;
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="og:image" content="${generateScoreCard(score)}" />
        <meta property="fc:frame:button:1" content="Share on Warpcast" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:1:target" content="${shareUrl}" />
      </head>
    </html>
  `);
}
