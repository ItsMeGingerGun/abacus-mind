// Track active timers
const timers = new Map();

// Start a timer for a user
export function startTimer(fid, callback, duration = 15) {
  clearTimer(fid);
  
  const timer = setTimeout(() => {
    callback(fid);
    timers.delete(fid);
  }, duration * 1000);
  
  timers.set(fid, timer);
}

// Clear a user's timer
export function clearTimer(fid) {
  if (timers.has(fid)) {
    clearTimeout(timers.get(fid));
    timers.delete(fid);
  }
}
