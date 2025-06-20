// public/js/leaderboard.js
export async function loadLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    const lbElement = document.getElementById('leaderboard');
    lbElement.innerHTML = '';

    data.forEach((player, index) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-item';
      item.innerHTML = `
        <span class="rank">#${index + 1}</span>
        <span class="fid">${player.username || `User ${player.fid}`}</span>
        <span class="score">${player.score} points</span>
        <span class="level">${player.difficulty || ''}</span>
      `;
      lbElement.appendChild(item);
    });
  } catch (error) {
    console.error('Leaderboard load failed:', error);
    document.getElementById('leaderboard').innerHTML = `
      <div class="error">Failed to load leaderboard. Refresh to try again.</div>
    `;
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', loadLeaderboard);
