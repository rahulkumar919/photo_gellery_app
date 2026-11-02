# Photo Gallery Web App

**Celebrare — Frontend Intern Pre-Screening Assignment**

---

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.
(Vite may use 5174 or 5175 if 5173 is busy — it will print the actual URL in the terminal.)

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

---

## What This App Does

Fetches 30 photographs from the Picsum Photos public API, displays them in a
responsive grid, lets you search by photographer name in real time, and lets
you mark photos as favourites. Favourite selections persist across browser
refreshes using localStorage.

---

## Tech Stack

| | Technology |
|---|---|
| Build tool | Vite |
| UI | React 19 — functional components and hooks only |
| Styling | Tailwind CSS only — no MUI, no Bootstrap, no Ant Design |
| Data | Picsum Photos API — no API key needed |
| Persistence | Browser localStorage — no backend |

---

## Folder Structure

```
src/
├── components/
│   ├── Header.jsx             — "Moments" wordmark at the top of the page
│   ├── SearchBar.jsx          — controlled search input with accessible label
│   ├── PhotoCard.jsx          — one photo card: image + author + heart button
│   └── PhotoGrid.jsx          — grid + loading / error / empty / normal states
├── hooks/
│   └── useFetchPhotos.js      — custom hook: fetches photos, returns {photos, loading, error}
├── reducers/
│   └── favouritesReducer.js   — reducer: handles TOGGLE_FAVOURITE action
├── utils/
│   └── storage.js             — reads and writes favourite IDs to localStorage
├── App.jsx                    — root: owns all state and hooks
├── index.css                  — Tailwind directives + spinner + hover animations
└── main.jsx                   — React entry point
```

---

## Assignment Requirements — Matched Line by Line

### Requirement 1 — Project Setup ✅

> *Create a React + Vite project. Use Tailwind CSS for all styling.
> No other UI libraries (no MUI, no Ant Design, no Bootstrap).*

- Vite 8 + React 19 project — `vite.config.js`
- Tailwind CSS 3 configured in `tailwind.config.js`
- Zero component libraries installed — check `package.json` dependencies

---

### Requirement 2 — Fetch Photos from API ✅

> *Use https://picsum.photos/v2/list?limit=30 to fetch 30 photos on load.
> Show a loading spinner while fetching.
> Show an error message if the fetch fails.*

**File:** `src/hooks/useFetchPhotos.js`

How the hook works step by step:

1. `useEffect` with empty `[]` runs once when the app first loads — never again
2. `AbortController` is created so the request can be cancelled on unmount
3. `fetch(API_URL, { signal })` sends the request
4. `response.ok` is checked before parsing — `fetch` does NOT automatically
   throw on 4xx/5xx errors, so this check is required
5. If ok → `setPhotos(data)` stores the 30 photo objects
6. If any error → `setError("message")` stores a readable message
7. `setLoading(false)` always runs at the end (unless aborted)
8. Cleanup function → `controller.abort()` cancels any in-flight request

The hook returns exactly: `{ photos, loading, error }`

**Loading spinner:**
- Shown in `PhotoGrid.jsx` → `LoadingState` component
- Animated SVG spinner (`spinner` class in `index.css`)
- 8 skeleton cards below it preview the layout
- `role="status"` on the wrapper for screen readers

**Error state:**
- Shown in `PhotoGrid.jsx` → `ErrorState` component
- `role="alert"` so screen readers announce it immediately
- Message: *"We couldn't load the photographs. Check your connection and try refreshing."*

---

### Requirement 3 — Display in a Responsive Grid ✅

> *Show all photos in a grid.
> On desktop: 4 columns. On tablet: 2 columns. On mobile: 1 column.
> Each card shows the photo, the author name, and a heart icon button.*

**File:** `src/components/PhotoGrid.jsx` and `src/components/PhotoCard.jsx`

Tailwind grid classes used:

```jsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-8">
```

| Screen width | Columns | Tailwind breakpoint |
|---|---|---|
| Below 768px (mobile) | 1 | `grid-cols-1` |
| 768px – 1023px (tablet) | 2 | `md:grid-cols-2` |
| 1024px and above (desktop) | 4 | `lg:grid-cols-4` |

Each `PhotoCard` renders:
- Photo image (`loading="lazy"`, fixed 800×600 from Picsum)
- Author name below the image
- Heart icon button on the right

---

### Requirement 4 — Search Filter ✅

> *Add a search input at the top. As the user types, filter the displayed
> photos by author name in real-time. No page reload. No API call on search
> — filter the already-fetched data.*

**Files:** `src/components/SearchBar.jsx`, `src/App.jsx`

How it works:

1. `searchTerm` is a `useState` value in `App.jsx`
2. As the user types → `handleSearchChange` updates `searchTerm`
3. `filteredPhotos` is computed with `useMemo` from the in-memory `photos` array:

```js
const filteredPhotos = useMemo(() => {
  const trimmed = searchTerm.trim().toLowerCase();
  if (!trimmed) return photos;                     // empty = show all 30
  return photos.filter((photo) =>
    photo.author.toLowerCase().includes(trimmed)   // case-insensitive partial match
  );
}, [photos, searchTerm]);
```

4. No `fetch` is ever called during search — it filters the already-loaded array
5. Clearing the search brings all 30 photos back

---

### Requirement 5 — Favourites with useReducer ✅

> *The heart icon toggles a photo as a favourite.
> Manage the favourites list using useReducer — not useState.
> Favourited photos must persist across page refreshes using localStorage.*

**Files:** `src/reducers/favouritesReducer.js`, `src/utils/storage.js`, `src/App.jsx`

**The reducer** (`favouritesReducer.js`):

```js
// State = array of favourited photo ID strings: ["0", "14", "27"]
// Action: { type: "TOGGLE_FAVOURITE", payload: "14" }

case TOGGLE_FAVOURITE: {
  const alreadyFavourited = state.includes(action.payload);
  if (alreadyFavourited) {
    return state.filter((id) => id !== action.payload); // remove
  } else {
    return [...state, action.payload];                  // add
  }
}
```

- Only one action: `TOGGLE_FAVOURITE`
- Never mutates state — always returns a new array
- `useReducer` (not `useState`) — this is non-negotiable per the assignment

**Why `useReducer` instead of `useState` here:**

`useState` is for simple values. Favourites have conditional logic — "if already
in list, remove it; otherwise add it." With `useReducer`, that logic lives in the
reducer, not scattered in event handlers. It's cleaner, easier to test, and the
assignment explicitly requires it.

**localStorage persistence** (`storage.js`):

```js
// On initial load — reads favourites once from localStorage
const [favourites, dispatch] = useReducer(
  favouritesReducer,
  undefined,
  loadFavourites   // called once by React to get the initial state
);

// On every change — saves updated favourites
useEffect(() => {
  saveFavourites(favourites);
}, [favourites]);
```

Storage key: `moments:favourites`
Stores: array of ID strings — `["0", "14"]` — not full photo objects

`loadFavourites()` uses `try/catch` to handle:
- Nothing stored → returns `[]`
- Invalid JSON (corrupted) → returns `[]`, never crashes
- localStorage unavailable (private browsing) → returns `[]`

---

### Requirement 6 — Custom Hook ✅

> *Extract the fetch logic into a custom hook called useFetchPhotos.
> It must return: photos, loading, error.
> The Gallery component must use this hook — not fetch data directly.*

**File:** `src/hooks/useFetchPhotos.js`

The hook returns exactly:

```js
return { photos, loading, error };
```

`App.jsx` uses it like this:

```js
const { photos, loading, error } = useFetchPhotos();
```

`App.jsx` does not contain any `fetch()` call. All data-fetching logic is
isolated inside the hook.

---

### Requirement 7 — useCallback + useMemo ✅

> *Use useCallback on the search filter handler.
> Use useMemo to compute the filtered photo list.
> Be ready to explain in your video why you used each one.*

**File:** `src/App.jsx`

**useCallback on the search handler:**

```js
const handleSearchChange = useCallback((event) => {
  setSearchTerm(event.target.value);
}, []);
```

Without `useCallback`, `App` creates a brand-new function object on every
render. Because `handleSearchChange` is passed as a prop to `SearchBar`,
this would cause `SearchBar` to think its props changed even when nothing
did. `useCallback` returns the same function reference across renders.

**useMemo for the filtered list:**

```js
const filteredPhotos = useMemo(() => {
  const trimmed = searchTerm.trim().toLowerCase();
  if (!trimmed) return photos;
  return photos.filter((photo) =>
    photo.author.toLowerCase().includes(trimmed)
  );
}, [photos, searchTerm]);
```

Without `useMemo`, a new array would be created on every render — even when
`photos` and `searchTerm` haven't changed. `useMemo` caches the result and
only recomputes it when one of its dependencies actually changes.

**What would break if you removed them:**
- Remove `useCallback` → `SearchBar` gets a new function prop on every
  render, causing unnecessary re-renders
- Remove `useMemo` → filtered array is recomputed on every render, even
  when the user hasn't typed anything

---

## Important Rules — All Followed

| Rule from assignment | Status |
|---|---|
| No component libraries (no MUI, no Bootstrap, no Ant Design) | ✅ Only `react` and `react-dom` in dependencies |
| No class components — functional components with hooks only | ✅ Every component is a function |
| Do NOT skip useReducer — favourites must use useReducer | ✅ `favouritesReducer.js` with `TOGGLE_FAVOURITE` |
| Do NOT submit without a recording | ⚠️ You must record this yourself |
| Do NOT add extra features — stick to the 7 requirements | ✅ No extra pages, no login, no sorting, no pagination |
| AI tools allowed — but you must explain every line | ✅ Every decision documented in comments and README |

---

## How Every Feature Works — Plain English

### Fetching photos

When the app opens, `useFetchPhotos` runs inside `App.jsx`. It calls the
Picsum API for 30 photos. While waiting, `loading` is `true` and the app
shows a spinning circle. When the photos arrive, `loading` becomes `false`
and the grid appears. If the request fails, `error` gets a message and the
grid is replaced with an error panel.

### Showing the spinner

While `loading` is `true`, `PhotoGrid` renders `LoadingState`. This shows
an animated SVG spinner and 8 skeleton placeholder cards — same layout as
the real grid so there's no visual jump when photos load.

### Showing the error

If the fetch fails, `error` is a non-null string. `PhotoGrid` renders
`ErrorState` — a raised panel with a warning icon and a message. It uses
`role="alert"` so screen readers announce it.

### The responsive grid

After photos load, `PhotoGrid` maps `filteredPhotos` into `PhotoCard`
components. The grid uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` —
1 column on phone, 2 on tablet, 4 on desktop. Pure Tailwind, no media
query code written by hand.

### Each photo card

`PhotoCard` shows:
1. The photo in an inset image well (4:3 ratio, covers the space)
2. The photographer's name below
3. A heart button on the right — outline when not favourited, filled red
   when favourited

The card is wrapped in `React.memo` so clicking one heart only re-renders
that one card, not all 30.

### Real-time search

The search input in `SearchBar` is controlled — its value comes from
`searchTerm` state in `App.jsx`. As you type, `handleSearchChange` updates
`searchTerm`. `useMemo` immediately recomputes `filteredPhotos` — the grid
re-renders with only matching photos. No network request. No page reload.

If you search for something with no matches, `PhotoGrid` shows:
*"No photographs found. Try another photographer's name."*

Clearing the search brings back all 30 photos.

### Favouriting a photo

Clicking the heart calls `handleToggleFavourite(photo.id)`. This dispatches
`{ type: "TOGGLE_FAVOURITE", payload: "14" }` to `favouritesReducer`. The
reducer checks: is `"14"` already in the list?

- Yes → `filter()` removes it and returns a new array without it
- No → spread `[...state, "14"]` and returns a new array with it added

The new `favourites` array goes back to `App.jsx`. Every `PhotoCard` checks
`favourites.includes(photo.id)` — matching cards update their heart.

### Persisting favourites

After every reducer update, this `useEffect` in `App.jsx` runs:

```js
useEffect(() => {
  saveFavourites(favourites);
}, [favourites]);
```

`saveFavourites` writes the current array to `localStorage["moments:favourites"]`.
On next page load, `loadFavourites` reads it back as the initial state for
`useReducer`. If the stored data is invalid JSON or missing, it safely returns `[]`.

---

## Screen Recording Guide (5 minutes)

The recording is **mandatory** — the assignment says submissions without it
will not be reviewed.

| Time | What to show | What to say |
|---|---|---|
| 0:00–1:00 | Browser — running app | "This is the photo gallery. 30 photos load from Picsum. I can see the spinner during loading. I'll type a name in search — it filters live, no network request. I'll click a heart — it presses in and goes red. I'll refresh the page — the heart is still selected. That's localStorage persistence." |
| 1:00–2:00 | `src/hooks/useFetchPhotos.js` | "This is my custom hook. It uses `useEffect` with an empty dependency array so it runs once on mount. I created an `AbortController` so if the component unmounts during the fetch, I cancel the request and don't update state. I check `response.ok` because `fetch` doesn't throw on 4xx errors. It returns exactly `photos`, `loading`, and `error`." |
| 2:00–3:00 | `src/reducers/favouritesReducer.js` | "This is my reducer. The state is an array of photo ID strings. The only action is `TOGGLE_FAVOURITE`. If the ID is already in the array, I use `filter` to remove it. Otherwise I use spread to add it. I never mutate the existing array. I used `useReducer` instead of `useState` because the logic — check then add or remove — fits a reducer naturally, and the assignment requires it." |
| 3:00–4:00 | `src/App.jsx` — the hooks section | "In App, `useCallback` wraps my search handler so its function reference stays stable across renders. `useMemo` wraps the filter logic — it only recomputes when `photos` or `searchTerm` changes. If I removed `useCallback`, `SearchBar` would get a new function prop on every render. If I removed `useMemo`, the filter would recompute on every render even when nothing changed. `useReducer` gets `loadFavourites` as the third argument — an initializer function React calls once to load from localStorage." |
| 4:00–5:00 | The `React.memo` fix | "The hardest part was getting `React.memo` to actually work. My first version had this: `onToggle={() => onToggle(photo.id)}` inside the memoized card. That creates a new function on every render, so memo never skipped any card. I fixed it by passing `photoId` as a plain string prop. Strings compare by value so memo works now — only the one card whose `isFavourite` changed re-renders." |

---

## Submission Checklist

- [ ] Push to a **public** GitHub repository
- [ ] Upload 5-minute screen recording to Google Drive or YouTube (unlisted)
- [ ] Fill in the Google Form with:
  - GitHub repository URL
  - Screen recording URL
  - One line: *"The hardest part was getting React.memo to work correctly — an inline arrow function inside a memoized component defeats the optimisation because a new function reference is created on every render."*
- [ ] Submit within 24 hours of receiving the assignment
