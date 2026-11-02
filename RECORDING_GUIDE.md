# How to Record Your 5-Minute Video
## Celebrare — Frontend React Internship Pre-Screening

This file tells you exactly what to do, step by step, from setting up your
screen to uploading the final video.

The recording is MANDATORY. The assignment says: "Submissions without a
recording will not be reviewed."

---

## STEP 1 — SET UP YOUR SCREEN BEFORE RECORDING

Do all of this BEFORE you hit record.

1. Open your terminal and run: `npm run dev`
   Wait for the message: "VITE ready in ... ms"

2. Open Chrome and go to http://localhost:5174
   Wait for the 30 photos to load completely.

3. Open VS Code with the photo-gallery project folder.
   Press Ctrl + = three times to zoom in. Your code should be large and readable.

4. Arrange your screen: browser on the left, VS Code on the right.
   OR use Alt+Tab to switch between them during the video.

5. Close all other applications, browser tabs, and notifications.
   You do not want a WhatsApp notification to pop up during recording.

6. Open your recording software (see Step 2 below).

---

## STEP 2 — START YOUR RECORDING

### Option A — Xbox Game Bar (Built into Windows, recommended)

1. Press Win + G on your keyboard.
2. The Game Bar overlay will open.
3. Click the circle button (Capture) → click "Start Recording".
4. A small red dot appears in the top-right corner — recording has started.
5. Record your video (follow the script below).
6. Press Win + G again → click the Stop button.
7. File saves to: C:\Users\YourName\Videos\Captures

### Option B — OBS Studio (Free, no time limit)

1. Download from obsproject.com and install.
2. Open OBS. Under "Sources", click the + button.
3. Select "Display Capture". Click OK.
4. Click "Start Recording" in the bottom-right.
5. Record your video.
6. Click "Stop Recording".
7. File saves to your Videos folder.

---

## STEP 3 — RECORD THE VIDEO (Full Script)

Total time: 5 minutes.
Follow this section by section.

---

### PART 0 — OPENING (0:00 to 0:15)

Screen to show: Browser with the app loaded.

What to say:
"Hi, my name is [say your name]. This is my submission for the Celebrare
Frontend Intern Pre-Screening Assignment. I built a Photo Gallery Web App
using React, Vite, and Tailwind CSS. Let me show you the app first, and
then I will explain the code."

---

### PART 1 — SHOW THE APP WORKING (0:15 to 1:00)

Screen to show: Browser only. Do not open VS Code yet.

ACTION: Refresh the page with Ctrl + Shift + R so the spinner is visible.

What to say:
"When the app first loads, it calls the Picsum Photos API to fetch 30 photos.
While that request is in flight, you can see a loading spinner — that is the
loading state I implemented."

Wait for photos to fully load.

What to say:
"Once the photos load, they appear in a responsive grid. On desktop you can
see 4 columns."

ACTION: Slowly drag the browser window to make it narrower.

What to say:
"As the screen gets smaller, it drops to 2 columns at tablet size and then
1 column on mobile. This is handled entirely with Tailwind CSS breakpoints —
no JavaScript is involved in switching the layout."

ACTION: Restore the browser to full size.

What to say:
"Each card shows the photograph, the photographer's name below, and a heart
button on the right side."

ACTION: Click the search bar. Type "Paul" slowly, one letter at a time.

What to say:
"Now the search. As I type the photographer's name, the grid filters in
real time. The page does not reload. There is no new API request. It is
filtering the data that is already in memory."

ACTION: Point at the photo counter pill — it shows "X of 30 photos".

What to say:
"This counter updates while I type to show how many photos match."

ACTION: Clear the search bar. Type "zzzzz".

What to say:
"If I search for something that does not match any photographer, I get a
clean empty state message instead of just a blank screen."

ACTION: Clear the search. Click the heart button on 3 different photos.

What to say:
"I will favourite some photos now. When I click the heart, it fills and turns
red. The shadow also changes from raised to pressed-in — that is part of the
neumorphic design system I followed."

ACTION: Press F5 to refresh the page. Wait for photos to load.

What to say:
"Now I refresh the browser completely. And my favourites are still here.
That is localStorage persistence — the app saved those photo IDs to
localStorage before the refresh and loaded them back on startup."

---

### PART 2 — useFetchPhotos HOOK (1:00 to 2:00)

ACTION: Switch to VS Code. Open src/hooks/useFetchPhotos.js.
Make the file take up most of your screen.

What to say: 
"Let me open the code. This is useFetchPhotos.js — the custom hook the
assignment asked me to create."  

ACTION: Point at the return statement at the bottom of the file.

What to say:
"The hook returns exactly three things — photos, loading, and error.
The App component just calls this hook and uses these three values.
It never calls fetch directly."

ACTION: Point at the useEffect.

What to say:
"Inside, I use useEffect with an empty dependency array. The empty array
means this runs exactly once when the component mounts. It will never
run again on re-renders."

ACTION: Point at the AbortController line.

What to say:
"I created an AbortController here. React in development mode runs effects
twice on mount to help catch bugs. Without this controller, if the component
unmounts while the fetch is still running, React would try to update state
on an unmounted component. The AbortController lets me cancel the request
in the cleanup function to prevent that."

ACTION: Point at the response.ok check.

What to say:
"This check is important. The fetch API does NOT automatically throw an
error for a 404 or a 500 response from the server. It only throws on
network failures. So I manually check response.ok — if it is false,
I throw an error myself."

ACTION: Point at the catch block.

What to say:
"In the catch block, I first check if this is an AbortError. If yes, I
return silently because that is expected. Otherwise, I call setError with
a readable message that gets displayed to the user."

What to say:
"So to directly answer the assignment question — if the API fails, loading
becomes false, photos stays empty, and error gets a message string that
my PhotoGrid component shows as a visible error panel."

---

### PART 3 — useReducer CODE (2:00 to 3:00)

ACTION: Open src/reducers/favouritesReducer.js.

What to say:
"This is my reducer file. The assignment said to use useReducer for
favourites and that useState is not accepted. Let me explain what this
does and why."

ACTION: Point at the state comment or the array.

What to say:
"The state is a simple array of photo ID strings — something like
0, 14, 27. I only store the IDs, not the full photo objects. The IDs
are enough to know which photos are favourited."

ACTION: Point at the TOGGLE_FAVOURITE case.

What to say:
"There is only one action — TOGGLE_FAVOURITE. When this action fires,
it carries a payload which is the photo's ID."

ACTION: Point at the filter line.

What to say:
"If the ID is already in the array, I use filter to return a new array
without that ID. That is how I remove a favourite."

ACTION: Point at the spread line.

What to say:
"If the ID is not in the array, I use spread to return a new array with
the ID added. That is how I add a favourite. I never mutate the existing
array — I always return a new one."

What to say:
"Now — why useReducer instead of useState? With useState, I would put
the add-or-remove logic inside the click handler. That works, but the
logic is mixed into the UI. With useReducer, all of the logic for how
favourites change lives in this one function, completely separated from
the UI. It is clean, predictable, and easy to test. And this is exactly
the pattern the assignment requires."

ACTION: Switch to src/App.jsx. Point at the useReducer line.

What to say:
"In App.jsx, I pass loadFavourites as the third argument to useReducer.
This is a lazy initializer — React calls loadFavourites once on mount to
read the saved favourites from localStorage. This is how the app restores
your selections after a page refresh."

---

### PART 4 — useCallback AND useMemo (3:00 to 4:00)

ACTION: Stay in src/App.jsx. Scroll to the useCallback line for handleSearchChange.

What to say:
"Now useCallback and useMemo. Both are in App.jsx."

ACTION: Point at handleSearchChange.

What to say:
"This is handleSearchChange — the function that runs when the user types
in the search input. I wrapped it in useCallback with an empty dependency
array."

What to say:
"Here is the problem it solves. Every time App re-renders, every function
defined inside it is recreated as a new object in memory. Without
useCallback, handleSearchChange would be a brand-new function on every
render. Because I pass it as a prop to SearchBar, SearchBar would think
its props changed every time — even though the function does exactly
the same thing. useCallback returns the same function reference across
renders, preventing that unnecessary re-render."

ACTION: Point at the filteredPhotos useMemo block.

What to say:
"This is filteredPhotos. It takes the full photos array and the current
searchTerm and returns only the matching ones. I wrapped it in useMemo."

What to say:
"Without useMemo, this filter would run on every single render — even
when the user has not typed anything and the photos have not changed.
useMemo caches the result and only recalculates when photos or searchTerm
actually change. The dependency array controls this."

What to say:
"The assignment asked what would break if I removed them. If I removed
useCallback, SearchBar gets a new function prop on every render and
re-renders unnecessarily. If I removed useMemo, the filter runs on every
render even when nothing changed. With 30 photos the impact is small,
but the concept is important — derived data should only be recomputed
when its inputs change."

---

### PART 5 — ONE DIFFICULT THING (4:00 to 5:00)

ACTION: Open src/components/PhotoCard.jsx. Scroll to the FavouriteButton section.

What to say:
"The part that took me the most time to figure out was getting React.memo
to actually work. Let me show you."

ACTION: Point at the memo wrapper around PhotoCard.

What to say:
"I wrapped PhotoCard in React.memo. The goal is that when you click one
heart, only that one card re-renders. Without memo, all 30 cards re-render
every time any favourite changes."

What to say:
"My original code had this inside PhotoCard:"

What to say:
"onToggle equals arrow function that calls onToggle with photo dot id."

What to say:
"That arrow function looks harmless but it completely broke React.memo.
Here is why. React.memo compares old props with new props using strict
equality. A function is only strictly equal to itself if it is the exact
same object in memory. Every time PhotoCard rendered, that arrow function
was a brand-new object. So memo compared the old onToggle prop with the
new one, saw they were different objects — even though they do the same
thing — and re-rendered the card anyway. Every single time. Memo was
doing nothing."

ACTION: Point at the current code showing photoId as a prop.

What to say:
"The fix was to pass photoId as a plain string prop and let FavouriteButton
call onToggle with that ID internally. Strings compare by value — the
string 14 is always equal to the string 14. So now when a heart is clicked,
React.memo checks every other card's props, sees their isFavourite and
photoId have not changed, and skips the re-render. Only the one card that
changed actually updates."

What to say:
"That bug taught me something important — in React, where you place a
function matters. A small syntax choice like an inline arrow function can
silently break an optimisation you thought was working."

---

### CLOSING (4:50 to 5:00)

ACTION: Switch back to the browser. App should be visible.

What to say:
"That covers all seven requirements — Vite and Tailwind setup, fetching
with a custom hook, responsive grid, real-time search, favourites with
useReducer, localStorage persistence, and useCallback with useMemo.
Thank you for watching."

ACTION: Stop the recording.

---

## STEP 4 — UPLOAD YOUR VIDEO

### Option A — YouTube (Recommended)

1. Go to youtube.com and sign in.
2. Click the camera + icon at the top right.
3. Click "Upload video".
4. Select your recorded file.
5. Give it a title: "Celebrare Frontend Assignment — [Your Name]"
6. Under Visibility, select "Unlisted".
   This means only people with the link can watch it — it will NOT appear in search results.
7. Click Publish.
8. Copy the video URL from the address bar.

### Option B — Google Drive

1. Go to drive.google.com and sign in.
2. Click "+ New" → "File upload".
3. Select your video file.
4. Wait for the upload to complete.
5. Right-click the file → Share.
6. Under "General access", change to "Anyone with the link".
7. Click "Copy link".

---

## STEP 5 — SUBMIT THE GOOGLE FORM

Fill in these three things:

1. GitHub repository URL
   (Your public repository where you pushed the code)

2. Screen recording URL
   (The YouTube unlisted link or Google Drive link from Step 4)

3. One line about the hardest part
   Write this exactly:
   "The hardest part was making React.memo work correctly — an inline
   arrow function inside a memoized component creates a new reference
   on every render and silently defeats the optimisation."

Submit within 24 hours of receiving the assignment.

---

## FINAL CHECKLIST BEFORE YOU SUBMIT

- [ ] App runs with npm run dev and shows 30 photos
- [ ] Loading spinner appears on first load
- [ ] Search filters photos by author name in real time
- [ ] Favourites toggle on heart click
- [ ] Favourites are still selected after page refresh
- [ ] Responsive grid: 4 columns desktop, 2 tablet, 1 mobile
- [ ] Code is pushed to a PUBLIC GitHub repository
- [ ] 5-minute recording is uploaded and the link is accessible
- [ ] Google Form is filled and submitted
