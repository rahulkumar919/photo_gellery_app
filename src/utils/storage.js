// The key we use to store favourite IDs in localStorage.
// A namespaced key avoids collisions with other apps on the same origin.
const STORAGE_KEY = "moments:favourites";

/**
 * Reads the saved favourite IDs from localStorage.
 * Returns an empty array if nothing is stored or if the stored
 * value is not valid JSON (e.g. someone edited it by hand).
 */
export function loadFavourites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return [];
    const parsed = JSON.parse(stored);
    // Make sure we actually got an array, not some other JSON value
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // JSON.parse threw — fall back to empty rather than crashing
    return [];
  }
}

/**
 * Saves the current favourite IDs to localStorage.
 * Silently ignores failures (e.g. private browsing with storage blocked).
 */
export function saveFavourites(favouriteIds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds));
  } catch {
    // Storage unavailable — favourites just won't persist this session
  }
}
