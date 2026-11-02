/**
 * Manages the list of favourite photo IDs.
 *
 * State shape: an array of photo ID strings, e.g. ["0", "10", "27"]
 *
 * We use useReducer instead of useState because:
 * - The logic (add vs. remove) lives in one place, not scattered across handlers.
 * - Each state transition is predictable and easy to test in isolation.
 * - The assignment explicitly requires useReducer for this state.
 */

export const TOGGLE_FAVOURITE = "TOGGLE_FAVOURITE";

/**
 * The reducer function.
 *
 * @param {string[]} state   - current list of favourited photo IDs
 * @param {{ type: string, payload: string }} action
 * @returns {string[]}       - new list (never mutates the existing array)
 */
function favouritesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVOURITE: {
      const id = action.payload;
      const alreadyFavourited = state.includes(id);

      if (alreadyFavourited) {
        // Remove: return every ID except the one being toggled off
        return state.filter((existingId) => existingId !== id);
      } else {
        // Add: append the new ID to a copy of the current array
        return [...state, id];
      }
    }

    default:
      // Unknown action — return state unchanged so we never break
      return state;
  }
}

export default favouritesReducer;
