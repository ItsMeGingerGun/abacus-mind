const timeouts = new Map();

export function startTimer(fid, duration, callback) {
  clearTimeout(timeouts.get(fid));
  const timer = setTimeout(async () => {
    await callback();
    timeouts.delete(fid);
  }, duration * 1000);
  timeouts.set(fid, timer);
}

export function clearTimer(fid) {
  clearTimeout(timeouts.get(fid));
  timeouts.delete(fid);
}
