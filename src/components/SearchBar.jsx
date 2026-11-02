/**
 * Controlled search input.
 *
 * Uses a real <label> (visually hidden) so screen readers know what
 * this field is for. The placeholder alone is not enough for accessibility.
 *
 * The inset shadow makes the field look "pressed in" to the surface,
 * which is the neumorphic convention for a container that holds content.
 */
function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full md:max-w-[420px]">
      {/* Visually hidden label — visible to screen readers and keyboard users */}
      <label htmlFor="search-photos" className="sr-only">
        Search by photographer
      </label>

      {/* Search icon — purely decorative, so aria-hidden */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        id="search-photos"
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search by photographer…"
        autoComplete="off"
        className="w-full h-12 bg-base shadow-inset-md rounded-full
                   pl-11 pr-5 text-base text-ink placeholder:text-muted
                   border-0 focus:outline-none
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-3 focus-visible:outline-focus"
      />
    </div>
  );
}

export default SearchBar;
