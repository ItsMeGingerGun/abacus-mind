# 🧮 Mathematical Puzzle Challenge - Farcaster Mini App

A challenging mathematical puzzle game for Farcaster where players solve arithmetic operations between 4 numbers under time pressure.

## 🎮 Game Features

### Puzzle Types
1. **4-Number Calculation**: Solve complex arithmetic expressions with 4 numbers and 3 operations
2. **Missing Operation**: Find the missing arithmetic operation in an equation

### Difficulty Levels
- **Easy (Apprentice)**: Numbers 1-20, addition/subtraction, 30 seconds, 1x points
- **Medium (Scholar)**: Numbers 10-50, +/-/×, 25 seconds, 2x points  
- **Hard (Master)**: Numbers 20-100, all operations including division, 20 seconds, 3x points

### Example Puzzles
- **Easy**: `5 + 12 - 3 + 8 = ?` (Answer: 22)
- **Medium**: `15 × 3 + 7 - 12 = ?` (Answer: 40)
- **Hard**: `84 ÷ 4 + 15 × 2 = ?` (Answer: 51)
- **Missing Op**: `20 ? 5 + 10 = 14` (Answer: -)

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Database**: Upstash Redis for caching puzzles and leaderboard
- **Authentication**: Neynar SDK for Farcaster integration
- **Frontend**: Vanilla HTML/CSS/JS
- **Deployment**: Replit

## 🚀 Setup Instructions

### Prerequisites
- Upstash Redis database
- Neynar API key for Farcaster

### Environment Variables
```bash
REDIS_URL=your_upstash_redis_url
NEYNAR_API_KEY=your_neynar_api_key
PORT=3000
```

### Installation
```bash
# Install dependencies
npm install

# Run the application  
npm start
```

## 📊 Scoring System

- **Easy puzzles**: 10 points
- **Medium puzzles**: 20 points  
- **Hard puzzles**: 30 points
- **Time bonus**: Extra points for quick solutions
- **Streak multiplier**: Consecutive correct answers increase score

## 🏆 Leaderboard

Real-time leaderboard showing:
- Player rankings
- Total scores
- Farcaster usernames
- Achievement badges

## 🔧 API Endpoints

### Game API (`/api/game`)
- `POST` - Start new puzzle
- `PUT` - Submit answer

### Leaderboard API (`/api/leaderboard`)  
- `GET` - Fetch current rankings

### Health Check (`/api/health`)
- `GET` - System status and diagnostics

## 🎯 Game Flow

1. **Connect**: Link Farcaster account via Neynar
2. **Select**: Choose difficulty level
3. **Solve**: Complete 4-number arithmetic puzzles
4. **Score**: Earn points based on difficulty and speed
5. **Compete**: Climb the global leaderboard
6. **Share**: Post scores to Farcaster

## 🔒 Security Features

- Farcaster authentication via Neynar SDK
- Puzzle expiration (5 minutes)
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure Redis connections with TLS

## 📱 Farcaster Integration

- Seamless wallet connection
- Social score sharing
- Leaderboard integration
- Mini app frame support

## 🎨 UI Features

- Responsive design for mobile/desktop
- Real-time timer with visual progress
- Smooth animations and transitions
- Accessibility support
- Dark/light theme options

Ready to test your mathematical skills? Connect your Farcaster account and start solving puzzles! 🚀
