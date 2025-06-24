// Safely loads environment variables
export const getConfig = () => {
  // For Vercel production
  if (process.env.VERCEL) {
    return {
      farcasterApiKey: process.env.FARCASTER_API_KEY,
      kvUrl: process.env.KV_REST_API_URL,
      kvToken: process.env.KV_REST_API_TOKEN,
      baseUrl: process.env.BASE_URL,
      frameSecret: process.env.FRAME_SECRET
    };
  }
  
  // For local development
  return {
    farcasterApiKey: process.env.FARCASTER_API_KEY || "",
    kvUrl: process.env.KV_REST_API_URL || "http://localhost:6379",
    kvToken: process.env.KV_REST_API_TOKEN || "",
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    frameSecret: process.env.FRAME_SECRET || "local-dev-secret"
  };
};
