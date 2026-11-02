import { memo } from "react";

/**
 * Displays a single photo with its author name and favourite button.
 *
 
 */
const PhotoCard = memo(function PhotoCard({ photo, isFavourite, onToggle }) {
  // Picsum gives us a download_url like https://picsum.photos/id/0/5616/3744
  // We request a fixed 800×600 so every card loads the same reasonable size,
  // rather than downloading a 5000px original for a thumbnail.
  const imageUrl = `https://picsum.photos/id/${photo.id}/800/600`;

  return (
    <article className="card-hover rounded-3xl bg-base p-3.5 shadow-raised-lg">
      {/* Image well — inset shadow makes the photo look set into the card */}
      <div className="overflow-hidden rounded-2xl shadow-inset-md">
        <img
          src={imageUrl}
          alt={`Photograph by ${photo.author}`}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover block"
        />
      </div>

      {/* Caption row: author name + heart button */}
      <div className="flex min-h-14 items-center justify-between gap-3 pt-3">
        <span className="text-[15px] font-medium text-ink leading-snug">
          {photo.author}
        </span>

        {/*
          We pass photoId as a prop instead of wrapping onToggle in an arrow
          function here. An inline arrow () => onToggle(photo.id) would create
          a new function reference on every render, which would defeat React.memo
          — the card would re-render even when nothing changed.
        */}
        <FavouriteButton
          isFavourite={isFavourite}
          author={photo.author}
          photoId={photo.id}
          onToggle={onToggle}
        />
      </div>
    </article>
  );
});

/**
 * The heart toggle button.
 *
 * Three things change between states so the UI is never colour-alone:
 *   1. Shadow direction: raised (not favourited) → inset (favourited)
 *   2. Heart shape: outline → filled
 *   3. Colour: muted → accent
 *
 * aria-pressed communicates the current toggle state to screen readers.
 */
function FavouriteButton({ isFavourite, author, photoId, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(photoId)}
      aria-pressed={isFavourite}
      aria-label={`Favourite photo by ${author}`}
      className={`
        grid h-11 w-11 shrink-0 place-items-center rounded-full bg-base
        transition-shadow duration-150
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-focus
        ${isFavourite
          ? "shadow-inset-sm text-accent"
          : "shadow-raised-sm text-muted hover:text-ink"
        }
      `}
    >
      {isFavourite ? <FilledHeart /> : <OutlineHeart />}
    </button>
  );
}

/** Filled heart — shown when the photo is favourited */
function FilledHeart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/** Outline heart — shown when the photo is not favourited */
function OutlineHeart() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default PhotoCard;
