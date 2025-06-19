import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const fid = req.nextUrl.searchParams.get('fid');
  const question = generateQuestion();
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL}/handle?fid=${fid}" />
        <meta property="fc:frame:button:1" content="${question.num1} ? ${question.num2} = ${question.num3}" />
        <meta property="fc:frame:button:2" content="+" />
        <meta property="fc:frame:button:3" content="-" />
        <meta property="fc:frame:button:4" content="×" />
        <meta property="og:title" content="Math Challenge" />
      </head>
    </html>
  `;

  return new NextResponse(html);
}

function generateQuestion() {
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * 3)];
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  
  let num3;
  if (op === '+') num3 = num1 + num2;
  if (op === '-') num3 = num1 - num2;
  if (op === '*') num3 = num1 * num2;

  return { num1, num2, num3, correctOp: op };
}
