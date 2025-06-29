# Abacus Mind - Math Puzzles on Farcaster

![Abacus Mind Screenshot](public/screenshot.png) <!-- Add your screenshot later -->

Abacus Mind is an engaging arithmetic puzzle game built for the Farcaster ecosystem. Players solve math problems at various difficulty levels, compete on leaderboards, and connect with their Farcaster identity. Built with Redis, Neynar API, and deployed on Vercel.

## Features

🧠 **Math Challenges**  
- Three difficulty levels (Easy, Medium, Hard)
- Randomly generated arithmetic puzzles
- Multiple-choice answers

🏆 **Competitive Gameplay**  
- Real-time leaderboard
- Score tracking
- Correct answer streaks

🔑 **Farcaster Integration**  
- Seamless Farcaster login
- User profile display
- Social leaderboard

⚡ **Performance Optimized**  
- Redis caching
- Serverless architecture
- Fast response times

## Tech Stack

**Backend**  
- Upstash Redis (Database)
- Neynar API (Farcaster Auth)
- Express.js (Server)
- Node.js (Runtime)

**Frontend**  
- HTML/CSS (UI)
- Vanilla JavaScript (Game Logic)
- Responsive Design

**Infrastructure**  
- Vercel (Deployment)
- GitHub Actions (CI/CD)

## Getting Started

### Prerequisites
- Node.js v18+
- Redis database (Upstash recommended)
- Neynar API key
- Farcaster account

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ItsMeGingerGun/abacus-mind.git
cd abacus-mind

2. Install dependencies:
npm install

Create .env.local file:
REDIS_URL=your_redis_url
NEYNAR_API_KEY=your_neynar_api_key
