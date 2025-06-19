export async function handleTimeout(fid) {
  const db = await getDb();
  const score = await db.get(`score:${fid}`);
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${generateTimeoutImage(score)}" />
        <meta property="fc:frame:button:1" content="Try Again" />
        <meta property="fc:frame:button:2" content="Share Score" />
      </head>
    </html>
  `);
}
