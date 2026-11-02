import PhotoCard from "./PhotoCard.jsx";

// Show 8 skeleton cards during loading (not 30 — avoids a wall of empty boxes)
const SKELETON_COUNT = 8;

/**
 * Renders one of four states:
 *   1. Loading  — skeleton cards with a pulse animation
 *   2. Error    — a single raised error panel
 *   3. Empty    — no search results found
 *   4. Grid     — the actual photo cards
 */
function PhotoGrid({ photos, loading, error, favourites, onToggleFavourite }) {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (photos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-8">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavourite={favourites.includes(photo.id)}
          onToggle={onToggleFavourite}
        />
      ))}
    </div>
  );
}

/**
 * Loading state — shows a spinner + skeleton cards.
 * The assignment requires a visible loading spinner (Req 2).
 * Skeleton cards below the spinner give a preview of the layout.
 */
function LoadingState() {
  return (
    <>
      {/* Spinner + text — this is what the assignment specifically requires */}
      <div role="status" className="flex flex-col items-center gap-4 py-16">
        <Spinner />
        <p className="text-base font-semibold text-muted">
          Loading photographs…
        </p>
      </div>

      {/* Skeleton cards in the same grid so layout doesn't shift after load */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-8">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </>
  );
}

/**
 * Animated spinner — inline SVG so no external dependency is needed.
 * The spin animation is defined in index.css and respects prefers-reduced-motion.
 */
function Spinner() {
  return (
    <svg
      className="spinner h-10 w-10 text-muted"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {/* Background track */}
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      {/* Spinning arc */}
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/**
 * A single skeleton card.
 * Uses inset shadows (not grey fills) to match the neumorphic system.
 * The skeleton-pulse class applies a CSS animation defined in index.css,
 * which is disabled automatically when prefers-reduced-motion is set.
 */
function SkeletonCard() {
  return (
    <div
      className="skeleton-pulse rounded-3xl bg-base p-3.5 shadow-raised-lg"
      aria-hidden="true"
    >
      {/* Image well placeholder */}
      <div className="aspect-[4/3] w-full rounded-2xl shadow-inset-md" />

      {/* Caption row placeholder */}
      <div className="flex min-h-14 items-center justify-between gap-3 pt-3">
        {/* Author name bar */}
        <div className="h-3 w-28 rounded-full shadow-inset-md" />
        {/* Heart button circle */}
        <div className="h-11 w-11 shrink-0 rounded-full shadow-inset-md" />
      </div>
    </div>
  );
}

/** Shown when the API request fails */
function ErrorState({ message }) {
  return (
    <div
      role="alert"
      className="rounded-3xl bg-base shadow-raised-lg p-10 flex flex-col items-center gap-4 text-center max-w-md mx-auto"
    >
      {/* Warning icon in ink — not red, so the accent keeps its single meaning */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink"
        aria-hidden="true"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>

      <div>
        <p className="text-lg font-semibold text-ink mb-1">
          We couldn&apos;t load the photographs.
        </p>
        <p className="text-sm text-muted">
          Check your connection and try refreshing the page.
        </p>
      </div>
    </div>
  );
}

/** Shown when search has no matches */
function EmptyState() {
  return (
    <div className="rounded-3xl bg-base shadow-inset-md p-10 flex flex-col items-center gap-3 text-center max-w-md mx-auto">
      <p className="text-lg font-semibold text-ink">
        No photographs found.
      </p>
      <p className="text-sm text-muted">
        Try another photographer&apos;s name.
      </p>
    </div>
  );
}

export default PhotoGrid;
