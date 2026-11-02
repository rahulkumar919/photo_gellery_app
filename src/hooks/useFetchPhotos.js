import { useState, useEffect } from "react";

const API_URL = "https://picsum.photos/v2/list?limit=30";

/**
 * Fetches 30 photos from the Picsum API on mount.
 *
 * Returns:
 *   photos  — array of photo objects from the API
 *   loading — true while the request is in flight
 *   error   — an error message string, or null if everything is fine
 *
 * We use AbortController so that if the component unmounts before the
 * fetch completes (e.g. during React StrictMode's double-invoke in dev),
 * we cancel the request and skip the state update — preventing the
 * "can't update state on an unmounted component" problem.
 */
function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        // fetch() only rejects on network failure, not on 4xx/5xx.
        // We check response.ok to catch those HTTP error statuses.
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        // AbortError is expected when the component unmounts — it is not
        // a real failure, so we do not show an error message for it.
        if (err.name === "AbortError") return;

        setError("We couldn't load the photographs. Check your connection and try refreshing the page.");
      } finally {
        // This block runs whether the fetch succeeded or failed.
        // We must not call setLoading after an abort, so we guard it.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    // Cleanup: cancel the in-flight request if the component unmounts
    return () => {
      controller.abort();
    };
  }, []); // Empty array = run once on mount, never again

  return { photos, loading, error };
}

export default useFetchPhotos;
