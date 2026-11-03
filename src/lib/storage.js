// Everything is stored on this device only (PRD section 7). Reads and writes
// are wrapped so private browsing or blocked storage never breaks the app.

const PREFIX = 'workout-finder:';

export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    if (value == null) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep working in memory */
  }
}
