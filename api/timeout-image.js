import { createCanvas } from 'canvas';

export default async function handler(req, res) {
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Draw timeout image
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 600, 400);
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('⏰ Time\'s Up!', 300, 150);
  ctx.fillText('Better luck next time!', 300, 200);
  
  res.setHeader('Content-Type', 'image/png');
  res.send(canvas.toBuffer());
}
