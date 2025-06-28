const fs = require('fs');
const path = require('path');

module.exports = function loadEnv() {
  // 1. Check for Vercel environment (production)
  if (process.env.VERCEL) return;
  
  // 2. Determine environment file path
  const envPath = path.resolve(__dirname, '../../.env.local');
  
  // 3. Check if .env.local exists
  if (!fs.existsSync(envPath)) {
    console.warn('[SECURITY] .env.local not found. Using process.env only.');
    return;
  }
  
  // 4. Load environment variables
  require('dotenv').config({ path: envPath });
  
  // 5. Security validation
  const requiredVars = ['REDIS_URL', 'NEYNAR_API_KEY'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required env variables: ${missing.join(', ')}`);
  }
};
