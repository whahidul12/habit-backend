# PART 4: API & Utility Functions

This part explains how the frontend communicates with the backend and the utility functions that help with common tasks.

## 🔌 axios.js - API Configuration

**Location**: `frontend/src/api/axios.js`

**Purpose**: Configures axios (HTTP client) for making API calls to the backend.

### Complete File

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register" && path !== "/") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
```

### Line-by-Line Explanation

```javascript
import axios from "axios";
```

- Imports axios library
- axios is an HTTP client for making API requests

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});
```

- **axios.create()**: Creates a custom axios instance
- **baseURL**: All requests will be prefixed with this URL
- **import.meta.env.VITE_API_URL**: Gets API URL from `.env` file
- **||**: If not set, use default `http://localhost:8000/api`

**Example**:

```javascript
// With baseURL set to "http://localhost:8000/api"
api.get("/habits"); // Actually calls: http://localhost:8000/api/habits
```

### Request Interceptor

```javascript
api.interceptors.request.use((config) => {
```

- **Interceptor**: Runs before every request
- **config**: Request configuration object

```javascript
const token = localStorage.getItem("token");
if (token) config.headers.Authorization = `Bearer ${token}`;
```

- Get authentication token from localStorage
- If token exists, add it to request headers
- **Authorization header**: `Bearer <token>`

**Why?**

- Backend needs token to verify user identity
- Automatically adds token to every request
- No need to manually add it each time

```javascript
  return config;
});
```

- Return modified config
- Request proceeds with token attached

### Response Interceptor

```javascript
api.interceptors.response.use(
  (res) => res,
```

- **First function**: Handles successful responses
- Just returns the response as-is

```javascript
  (err) => {
```

- **Second function**: Handles errors

```javascript
    if (err.response?.status === 401) {
```

- **401**: Unauthorized error
- Means token is invalid or expired
- **?.**: Optional chaining (safe if response doesn't exist)

```javascript
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register" && path !== "/") {
```

- Get current URL path
- Only redirect if NOT already on public pages
- Prevents redirect loops

```javascript
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
```

- Clear token and user from localStorage
- Redirect to login page
- **window.location.href**: Full page redirect (not React Router)

```javascript
    return Promise.reject(err);
  }
);
```

- Reject the promise with error
- Allows calling code to handle error

### How to Use

```javascript
import api from "../api/axios.js";

// GET request
const response = await api.get("/habits");
const habits = response.data;

// POST request
await api.post("/habits", {
  name: "Exercise",
  category: "Fitness",
});

// PUT request
await api.put(`/habits/${habitId}`, {
  name: "New Name",
});

// DELETE request
await api.delete(`/habits/${habitId}`);
```

---

## 🎉 confetti.js - Celebration Animations

**Location**: `frontend/src/utils/confetti.js`

**Purpose**: Provides functions to trigger confetti animations when users complete habits.

### Complete File

```javascript
import confetti from "canvas-confetti";

export const celebrate = (origin = { x: 0.5, y: 0.6 }) => {
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    scalar: 0.9,
    origin,
    colors: ["#fbbf24", "#fcd34d", "#f59e0b", "#fde68a", "#d97706"],
  });
};

export const celebrateBig = () => {
  const duration = 800;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#fbbf24", "#fcd34d", "#f59e0b"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#fbbf24", "#fcd34d", "#f59e0b"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
};
```

### Line-by-Line Explanation

#### celebrate() - Small Celebration

```javascript
export const celebrate = (origin = { x: 0.5, y: 0.6 }) => {
```

- **origin**: Where confetti starts from
- **x: 0.5**: Center horizontally (50%)
- **y: 0.6**: 60% down from top
- **Default parameter**: Uses this if not provided

```javascript
  confetti({
    particleCount: 80,
```

- **particleCount**: Number of confetti pieces

```javascript
    spread: 70,
```

- **spread**: How wide the confetti spreads (in degrees)

```javascript
    startVelocity: 35,
```

- **startVelocity**: How fast confetti shoots out

```javascript
    scalar: 0.9,
```

- **scalar**: Size of confetti pieces (0.9 = 90% of default)

```javascript
    origin,
```

- Use the origin parameter

```javascript
    colors: ["#fbbf24", "#fcd34d", "#f59e0b", "#fde68a", "#d97706"],
```

- **colors**: Array of colors (amber/gold theme)
- Matches the app's brand colors

#### celebrateBig() - Big Celebration

```javascript
export const celebrateBig = () => {
  const duration = 800;
  const end = Date.now() + duration;
```

- **duration**: How long animation lasts (800ms)
- **end**: Timestamp when animation should stop

```javascript
  (function frame() {
```

- **IIFE**: Immediately Invoked Function Expression
- Runs immediately and can call itself recursively

```javascript
confetti({
  particleCount: 4,
  angle: 60,
  spread: 55,
  origin: { x: 0 },
  colors: ["#fbbf24", "#fcd34d", "#f59e0b"],
});
```

- **First burst**: From left side (x: 0)
- **angle: 60**: Shoots to the right

```javascript
confetti({
  particleCount: 4,
  angle: 120,
  spread: 55,
  origin: { x: 1 },
  colors: ["#fbbf24", "#fcd34d", "#f59e0b"],
});
```

- **Second burst**: From right side (x: 1)
- **angle: 120**: Shoots to the left

```javascript
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
};
```

- **requestAnimationFrame**: Calls frame() on next animation frame
- Creates continuous bursts from both sides
- Stops when duration is reached

### How to Use

```javascript
import { celebrate, celebrateBig } from "../utils/confetti.js";

// Small celebration (single burst)
celebrate();

// Custom origin
celebrate({ x: 0.3, y: 0.5 });

// Big celebration (continuous bursts from both sides)
celebrateBig();
```

---

## 📅 dateHelpers.js - Date Utilities

**Location**: `frontend/src/utils/dateHelpers.js`

**Purpose**: Provides functions for date manipulation, formatting, and streak calculations.

### Complete File

```javascript
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

export const toKey = (d) => format(d, "yyyy-MM-dd");
export const todayKey = () => toKey(new Date());

export const last7Days = () => {
  const end = new Date();
  const start = subDays(end, 6);
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};

export const last90Days = () => {
  const end = new Date();
  const start = subDays(end, 89);
  return eachDayOfInterval({ start, end }).map((d) => toKey(d));
};

export const weekKeys = () => weekKeysFor(new Date());

export const weekKeysFor = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};

export const prettyDate = (d) =>
  format(d instanceof Date ? d : new Date(d), "MMM d, yyyy");

export const streakFromKeys = (keys) => {
  if (!keys?.length) return { current: 0, longest: 0 };
  const set = new Set(keys);
  const today = todayKey();
  const yKey = toKey(subDays(new Date(), 1));
  let current = 0;
  let cursor = new Date();
  if (!set.has(today) && !set.has(yKey)) {
    current = 0;
  } else {
    if (!set.has(today)) cursor = subDays(cursor, 1);
    while (set.has(toKey(cursor))) {
      current += 1;
      cursor = subDays(cursor, 1);
    }
  }
  const sorted = [...keys].sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const k of sorted) {
    if (prev) {
      const diff = Math.round(
        (new Date(k) - new Date(prev)) / (1000 * 60 * 60 * 24),
      );
      run = diff === 1 ? run + 1 : 1;
    } else run = 1;
    if (run > longest) longest = run;
    prev = k;
  }
  return { current, longest };
};
```

### Function Explanations

#### toKey() - Convert Date to String

```javascript
export const toKey = (d) => format(d, "yyyy-MM-dd");
```

- Converts Date object to "2024-01-15" format
- Used as keys for storing/comparing dates

**Example**:

```javascript
toKey(new Date()); // "2024-01-15"
```

#### todayKey() - Get Today's Key

```javascript
export const todayKey = () => toKey(new Date());
```

- Returns today's date as a string key

**Example**:

```javascript
todayKey(); // "2024-01-15"
```

#### last7Days() - Get Last 7 Days

```javascript
export const last7Days = () => {
  const end = new Date();
  const start = subDays(end, 6);
```

- **end**: Today
- **start**: 6 days ago (total 7 days including today)

```javascript
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};
```

- **eachDayOfInterval**: Gets array of all dates in range
- Maps each date to an object with:
  - **key**: "2024-01-15"
  - **label**: "Mon"
  - **short**: "15"
  - **date**: Date object

**Example**:

```javascript
last7Days();
// [
//   { key: "2024-01-09", label: "Mon", short: "9", date: Date },
//   { key: "2024-01-10", label: "Tue", short: "10", date: Date },
//   ...
// ]
```

#### weekKeysFor() - Get Week Days

```javascript
export const weekKeysFor = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
```

- **startOfWeek**: Gets Monday of the week
- **endOfWeek**: Gets Sunday of the week
- **weekStartsOn: 1**: Week starts on Monday (0 = Sunday)

```javascript
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};
```

- Returns all 7 days of the week

#### streakFromKeys() - Calculate Streaks

This is the most complex function. It calculates current and longest streaks from an array of date keys.

```javascript
export const streakFromKeys = (keys) => {
  if (!keys?.length) return { current: 0, longest: 0 };
```

- If no keys, return zero streaks

```javascript
const set = new Set(keys);
const today = todayKey();
const yKey = toKey(subDays(new Date(), 1));
```

- **set**: Convert array to Set for fast lookups
- **today**: Today's date key
- **yKey**: Yesterday's date key

```javascript
let current = 0;
let cursor = new Date();
if (!set.has(today) && !set.has(yKey)) {
  current = 0;
}
```

- **Current streak logic**:
- If habit not done today AND not done yesterday → streak is 0

```javascript
  else {
    if (!set.has(today)) cursor = subDays(cursor, 1);
    while (set.has(toKey(cursor))) {
      current += 1;
      cursor = subDays(cursor, 1);
    }
  }
```

- If not done today, start from yesterday
- Count backwards while dates exist
- Stop when we hit a missing date

```javascript
const sorted = [...keys].sort();
let longest = 0;
let run = 0;
let prev = null;
for (const k of sorted) {
  if (prev) {
    const diff = Math.round(
      (new Date(k) - new Date(prev)) / (1000 * 60 * 60 * 24),
    );
    run = diff === 1 ? run + 1 : 1;
  } else run = 1;
  if (run > longest) longest = run;
  prev = k;
}
```

- **Longest streak logic**:
- Sort dates chronologically
- Loop through dates
- If consecutive (diff = 1 day), increment run
- If not consecutive, reset run to 1
- Track the longest run

```javascript
  return { current, longest };
};
```

- Returns both current and longest streaks

**Example**:

```javascript
streakFromKeys([
  "2024-01-13",
  "2024-01-14",
  "2024-01-15", // Today
]);
// { current: 3, longest: 3 }

streakFromKeys([
  "2024-01-10",
  "2024-01-11",
  "2024-01-12",
  // Gap here
  "2024-01-15", // Today
]);
// { current: 1, longest: 3 }
```

---

## 🎨 constants.js - App Constants

**Location**: `frontend/src/utils/constants.js`

**Purpose**: Stores constant values used throughout the app.

### Complete File

```javascript
export const CATEGORIES = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Social",
  "Finance",
  "Creative",
  "Other",
];

export const ICONS = [
  "💪",
  "🏃",
  "📚",
  "🧘",
  "💧",
  "😴",
  "🥗",
  "✍️",
  "🎯",
  "🧠",
  "💊",
  "🚶",
];

export const COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
];
```

### Explanation

**CATEGORIES**:

- Predefined habit categories
- Used in dropdowns and filters
- Users can choose from these when creating habits

**ICONS**:

- Emoji icons for habits
- Users can pick one when creating a habit
- Makes habits visually distinct

**COLORS**:

- Hex color codes
- Used for habit colors
- Provides visual variety

### How to Use

```javascript
import { CATEGORIES, ICONS, COLORS } from "../utils/constants.js";

// In a dropdown
<select>
  {CATEGORIES.map((cat) => (
    <option key={cat}>{cat}</option>
  ))}
</select>;

// Pick a random icon
const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)];

// Pick a random color
const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
```

---

## 📚 Summary

| File               | Purpose           | Key Functions                          |
| ------------------ | ----------------- | -------------------------------------- |
| **axios.js**       | API communication | Configured axios instance with auth    |
| **confetti.js**    | Celebrations      | celebrate(), celebrateBig()            |
| **dateHelpers.js** | Date utilities    | toKey(), last7Days(), streakFromKeys() |
| **constants.js**   | App constants     | CATEGORIES, ICONS, COLORS              |

---

## 🎯 Key Takeaways

1. **axios.js** automatically adds auth token to requests
2. **Interceptors** handle common logic (auth, errors)
3. **confetti.js** provides celebration animations
4. **dateHelpers.js** handles all date logic
5. **streakFromKeys()** calculates habit streaks
6. **constants.js** stores reusable values

---

## 📖 Next Steps

Now that you understand API calls and utilities, let's explore the page components!

Next: Read **[PART-5-Pages-Overview.md](./PART-5-Pages-Overview.md)** to understand all page components!
