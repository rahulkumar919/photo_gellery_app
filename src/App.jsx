import { useState, useReducer, useCallback, useMemo, useEffect } from "react";

import useFetchPhotos from "./hooks/useFetchPhotos.js";
import favouritesReducer, { TOGGLE_FAVOURITE } from "./reducers/favouritesReducer.js";
import { loadFavourites, saveFavourites } from "./utils/storage.js";

import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import PhotoGrid from "./components/PhotoGrid.jsx";

function App() {
  // ─── Remote data ─────────────────────────────────────────────────────────────
  const { photos, loading, error } = useFetchPhotos();

  // ─── Search ───────────────────────────────────────────────────────────────────
  // useState is fine here — search is a simple controlled input value.
  const [searchTerm, setSearchTerm] = useState("");

  // useCallback memoizes this handler so PhotoGrid's SearchBar doesn't get
  // a new function reference on every render (AC-12).
  // The empty dependency array is correct because setSearchTerm is stable.
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // useMemo recomputes the filtered list only when photos or searchTerm changes.
  // With 30 photos the runtime gain is small, but it demonstrates the correct
  // mental model: derived data should be computed, not stored (AC-13).
  const filteredPhotos = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return photos;
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    );
  }, [photos, searchTerm]);

  // ─── Favourites ───────────────────────────────────────────────────────────────
  // useReducer is mandatory for favourites (AC-09).
  // loadFavourites() is the initial state — it reads localStorage once on mount,
  // returning [] if nothing is stored or if the JSON is invalid.
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,           // no inline initial value — we use the initializer fn below
    loadFavourites       // called once: loadFavourites() → initial state
  );

  // Whenever the favourites array changes, write the updated list to localStorage.
  // This useEffect runs after every render where `favourites` has changed.
  useEffect(() => {
    saveFavourites(favourites);
  }, [favourites]);

  // Dispatch a TOGGLE_FAVOURITE action with the photo's ID as payload.
  // useCallback here avoids creating a new function reference on every render,
  // which matters because we pass this down to every PhotoCard via PhotoGrid.
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({ type: TOGGLE_FAVOURITE, payload: photoId });
  }, []); // dispatch is stable — React guarantees it never changes

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-base text-ink font-sans">
      <div className="mx-auto max-w-[1440px] px-[18px] py-8 md:px-7 lg:px-12">

        <Header />

        {/* Toolbar: search + photo counter */}
        <div className="flex flex-col gap-3 mb-9 md:flex-row md:items-center md:justify-between">
          <SearchBar value={searchTerm} onChange={handleSearchChange} />

          {/*
            Photo counter — only shown once photos have loaded.
            aria-live="polite" makes screen readers announce count changes while typing.
          */}
          {!loading && !error && (
            <p
              aria-live="polite"
              className="text-xs font-medium uppercase tracking-[0.08em] text-muted
                         bg-base shadow-inset-md rounded-full px-5 py-3 self-start md:self-auto whitespace-nowrap"
            >
              {searchTerm.trim()
                ? `${filteredPhotos.length} of ${photos.length} photos`
                : `${photos.length} photos`}
            </p>
          )}
        </div>

        {/* Main content area */}
        <PhotoGrid
          photos={filteredPhotos}
          loading={loading}
          error={error}
          favourites={favourites}
          onToggleFavourite={handleToggleFavourite}
        />

      </div>
    </main>
  );
}

export default App;
