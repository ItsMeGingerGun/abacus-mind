const { client } = require('../../lib/redis');
const winston = require('winston');

module.exports = async (req, res) => {
  try {
    // Check Redis connection
    const redisStatus = client.isReady ? 'connected' : 'disconnected';
    
    // Check environment variables
    const envVars = {
      REDIS_URL: !!process.env.REDIS_URL,
      NEYNAR_API_KEY: !!process.env.NEYNAR_API_KEY
    };
    
    res.status(200).json({
      status: 'ok',
      redis: redisStatus,
      environment: envVars
    });
  } catch (error) {
    winston.error(`Health check failed: ${error.message}`);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};
