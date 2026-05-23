# PART 5: Page Components Overview

This part provides an overview of all page components. Each page is a full-screen view that users navigate to via the sidebar or URL.

## 📄 What is a Page Component?

A **page component** is a React component that represents a complete view/screen in the application. Each page corresponds to a route in `App.jsx`.

### Page vs Component

| Page               | Regular Component  |
| ------------------ | ------------------ |
| Full-screen view   | Part of a page     |
| Has its own route  | Used within pages  |
| Example: Dashboard | Example: HabitCard |

---

## 🗺️ All Pages

| Page          | Route        | Access    | Purpose                   |
| ------------- | ------------ | --------- | ------------------------- |
| **Landing**   | `/`          | Public    | Marketing/home page       |
| **Login**     | `/login`     | Public    | User login                |
| **Register**  | `/register`  | Public    | User registration         |
| **Dashboard** | `/dashboard` | Protected | Main habit tracking view  |
| **Habits**    | `/habits`    | Protected | Manage all habits         |
| **Weekly**    | `/weekly`    | Protected | Weekly calendar view      |
| **Insights**  | `/insights`  | Protected | AI insights and analytics |
| **Stats**     | `/stats`     | Protected | Detailed statistics       |

---

## 🏠 Landing Page

**File**: `src/pages/Landing.jsx`  
**Route**: `/`  
**Access**: Public

### Purpose

The marketing/home page that visitors see first. Showcases features and encourages sign-up.

### Key Features

- Hero section with animated orbiting habits
- Feature cards explaining the app
- Demo habit cards showing the UI
- Call-to-action buttons (Sign up, Log in)
- Theme toggle button

### Main Sections

1. **Header** - Logo, navigation, theme toggle
2. **Hero** - Main headline and CTA buttons
3. **Demo Cards** - Preview of habit tracking
4. **Features Grid** - 4 feature cards
5. **Final CTA** - Encouragement to sign up
6. **Footer** - Copyright info

### Logic

```jsx
const { user } = useAuth();
if (user) return <Navigate to="/dashboard" replace />;
```

- If user is already logged in, redirect to dashboard
- Prevents logged-in users from seeing landing page

---

## 🔐 Login Page

**File**: `src/pages/Login.jsx`  
**Route**: `/login`  
**Access**: Public

### Purpose

Allows existing users to log in with email and password.

### Key Features

- Email and password inputs
- Form validation
- Error message display
- Loading state during login
- Link to registration page
- Theme toggle button

### State Management

```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [err, setErr] = useState("");
const [loading, setLoading] = useState(false);
```

### Login Flow

```jsx
const submit = async (e) => {
  e.preventDefault();
  setErr("");
  setLoading(true);
  try {
    await login(email, password);
    navigate(loc.state?.from || "/dashboard", { replace: true });
  } catch (e) {
    setErr(e.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
```

1. Prevent form default submission
2. Clear previous errors
3. Set loading state
4. Call `login()` from AuthContext
5. On success: Navigate to dashboard (or previous page)
6. On error: Show error message
7. Always: Clear loading state

---

## 📝 Register Page

**File**: `src/pages/Register.jsx`  
**Route**: `/register`  
**Access**: Public

### Purpose

Allows new users to create an account.

### Key Features

- Name, email, and password inputs
- Password length validation (min 6 characters)
- Error message display
- Loading state during registration
- Link to login page
- Theme toggle button

### State Management

```jsx
const [form, setForm] = useState({ name: "", email: "", password: "" });
const [err, setErr] = useState("");
const [loading, setLoading] = useState(false);
```

### Registration Flow

Similar to login, but calls `register()` instead:

```jsx
await register(form.name, form.email, form.password);
navigate("/dashboard", { replace: true });
```

---

## 📊 Dashboard Page

**File**: `src/pages/Dashboard.jsx`  
**Route**: `/dashboard`  
**Access**: Protected

### Purpose

The main page users see after logging in. Shows today's habits, progress, and weekly overview.

### Key Features

- Greeting with user's name
- Morning motivation message
- Streak recovery suggestions
- Summary cards (total habits, active streaks, etc.)
- Today's habit list with checkboxes
- Progress ring showing completion percentage
- AI weekly report
- Weekly grid
- 90-day heatmap
- Habit creation/editing modals

### State Management

```jsx
const [habits, setHabits] = useState([]);
const [todayLogs, setTodayLogs] = useState([]);
const [weekLogs, setWeekLogs] = useState([]);
const [heatmap, setHeatmap] = useState([]);
const [allLogsByHabit, setAllLogsByHabit] = useState({});
const [loading, setLoading] = useState(true);
```

### Data Loading

```jsx
const loadAll = async () => {
  setLoading(true);
  try {
    const [habitsRes, todayRes, rangeRes, heatRes] = await Promise.all([
      api.get("/habits"),
      api.get("/logs/today"),
      api.get("/logs/range", { params: { start, end } }),
      api.get("/logs/heatmap"),
    ]);
    // ... set state with responses
  } finally {
    setLoading(false);
  }
};
```

- Uses `Promise.all()` to fetch multiple endpoints in parallel
- Faster than sequential requests

### Toggle Habit

```jsx
const toggle = async (habit) => {
  const done = completedToday.has(String(habit._id));
  const today = todayKey();
  if (done) {
    // Uncomplete: DELETE request
    await api.delete("/logs", { data: { habitId: habit._id, date: today } });
    // Update local state
  } else {
    // Complete: POST request
    const res = await api.post("/logs", { habitId: habit._id, date: today });
    // Update local state
    celebrate(); // 🎉
  }
};
```

### Computed Values

```jsx
const completedToday = useMemo(
  () => new Set(todayLogs.map((l) => String(l.habitId))),
  [todayLogs],
);

const todayProgress = habits.length
  ? Math.round((completedToday.size / habits.length) * 100)
  : 0;
```

- Uses `useMemo` to avoid recalculating on every render
- Only recalculates when dependencies change

---

## 📋 Habits Page

**File**: `src/pages/Habits.jsx`  
**Route**: `/habits`  
**Access**: Protected

### Purpose

Manage all habits (active and archived). Search, filter, edit, archive, and delete habits.

### Key Features

- Search bar (filter by name)
- Category filter dropdown
- Active/Archived toggle
- Habit cards with:
  - Icon and color
  - Name, description, category
  - Current and longest streaks
  - Edit, archive, delete buttons
- Habit creation modal
- AI habit suggestion modal
- Delete confirmation modal

### State Management

```jsx
const [habits, setHabits] = useState([]);
const [showArchived, setShowArchived] = useState(false);
const [query, setQuery] = useState("");
const [category, setCategory] = useState("All");
```

### Filtering Logic

```jsx
const filtered = useMemo(() => {
  const q = query.trim().toLowerCase();
  return habits.filter((h) => {
    if (!showArchived && h.isArchived) return false;
    if (showArchived && !h.isArchived) return false;
    if (category !== "All" && h.category !== category) return false;
    if (q && !h.name.toLowerCase().includes(q)) return false;
    return true;
  });
}, [habits, query, category, showArchived]);
```

- Filters by archived status, category, and search query
- Uses `useMemo` for performance

---

## 📅 Weekly Page

**File**: `src/pages/Weekly.jsx`  
**Route**: `/weekly`  
**Access**: Protected

### Purpose

Shows a weekly calendar view of all habits. Navigate between weeks.

### Key Features

- Week navigation (previous/next buttons)
- Current week indicator
- "Today" button to jump to current week
- Summary cards (week rate, total completions, best day, top habit)
- Weekly grid showing all habits × 7 days

### State Management

```jsx
const [cursor, setCursor] = useState(new Date());
const [habits, setHabits] = useState([]);
const [logs, setLogs] = useState([]);
```

### Week Navigation

```jsx
<button onClick={() => setCursor((d) => addWeeks(d, -1))}>
  Previous Week
</button>
<button onClick={() => setCursor((d) => addWeeks(d, 1))}>
  Next Week
</button>
<button onClick={() => setCursor(new Date())}>
  Today
</button>
```

### Computed Values

```jsx
const days = useMemo(() => weekKeysFor(cursor), [cursor]);
const isCurrentWeek = isSameWeek(cursor, new Date(), { weekStartsOn: 1 });
```

---

## 💡 Insights Page

**File**: `src/pages/Insights.jsx`  
**Route**: `/insights`  
**Access**: Protected

### Purpose

Shows AI-generated weekly insights and detailed analytics with charts.

### Key Features

- AI weekly report (generated or cached)
- Regenerate report button
- Summary cards (completions, completion rate, best day, top habit)
- Charts:
  - Completions by day (bar chart)
  - This week vs last week (bar chart)
  - By category (pie chart)
  - Habit performance (progress bars)
- Active streaks board

### AI Report

```jsx
const generateReport = async () => {
  setReportLoading(true);
  try {
    const res = await api.post("/ai/weekly-report");
    setReport(res.data.content);
    // Cache in localStorage
    localStorage.setItem(
      REPORT_CACHE_KEY(thisWeek[0].key),
      JSON.stringify({ content: res.data.content, generatedAt: now }),
    );
  } finally {
    setReportLoading(false);
  }
};
```

### Charts

Uses **Recharts** library for data visualization:

```jsx
<BarChart data={dailyData}>
  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
  <XAxis dataKey="label" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="count" fill="url(#day-bar)" />
</BarChart>
```

---

## 📈 Stats Page

**File**: `src/pages/Stats.jsx`  
**Route**: `/stats`  
**Access**: Protected

### Purpose

Shows detailed statistics and analytics for all habits.

### Key Features

- Highlight cards (best streak, longest ever, needs attention)
- Weekly bar chart (last 7 days)
- Monthly bar chart (last 30 days)
- Category pie chart
- Top habits by completion (progress bars)
- Individual habit stats cards
- AI chat interface

### Data Loading

```jsx
const [statsRes, habitsRes] = await Promise.all([
  api.get("/logs/stats"),
  api.get("/habits"),
]);
```

### Computed Values

```jsx
const sortedByStreak = [...stats.perHabit].sort(
  (a, b) => b.currentStreak - a.currentStreak,
);
const best = sortedByStreak[0];
```

---

## 🔄 Common Patterns Across Pages

### 1. Loading State

```jsx
const [loading, setLoading] = useState(true);

if (loading) return <LoadingSpinner full />;
```

### 2. Data Fetching

```jsx
useEffect(() => {
  loadData();
}, []);
```

### 3. Error Handling

```jsx
try {
  await api.get("/endpoint");
} catch (error) {
  setError(error.message);
}
```

### 4. Modals

```jsx
const [modalOpen, setModalOpen] = useState(false);

<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  {/* Modal content */}
</Modal>;
```

---

## 📚 Summary

| Page          | Main Purpose   | Key Data                                 |
| ------------- | -------------- | ---------------------------------------- |
| **Landing**   | Marketing      | None (static)                            |
| **Login**     | Authentication | Email, password                          |
| **Register**  | Sign up        | Name, email, password                    |
| **Dashboard** | Today's habits | Habits, today's logs, week logs, heatmap |
| **Habits**    | Manage habits  | All habits, logs for streaks             |
| **Weekly**    | Week view      | Habits, week's logs                      |
| **Insights**  | AI analytics   | Habits, logs, AI report                  |
| **Stats**     | Statistics     | Stats, habits, logs                      |

---

## 🎯 Key Takeaways

1. **Pages** are full-screen views with their own routes
2. **Public pages** (Landing, Login, Register) don't require auth
3. **Protected pages** require authentication
4. Most pages follow similar patterns: loading → fetch data → display
5. **useMemo** optimizes computed values
6. **useEffect** handles data fetching on mount

---

## 📖 Next Steps

Now that you understand all pages, let's dive into the reusable components!

Next: Read **[PART-6-Components-Layout.md](./PART-6-Components-Layout.md)** for layout components!
