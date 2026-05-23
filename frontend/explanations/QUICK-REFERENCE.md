# Quick Reference Guide

This is your cheat sheet for common tasks and patterns in this codebase.

## 🚀 Common Tasks

### How to Add a New Page

1. Create a new file in `src/pages/`, e.g., `MyPage.jsx`
2. Add the route in `App.jsx`:

```jsx
import MyPage from "./pages/MyPage.jsx";

// Inside <Routes>:
<Route path="/mypage" element={<MyPage />} />;
```

3. Add navigation link in `Sidebar.jsx`

### How to Create a New Component

1. Create file in `src/components/`, e.g., `MyComponent.jsx`
2. Basic structure:

```jsx
export default function MyComponent({ prop1, prop2 }) {
  return (
    <div className="card p-5">
      <h2>{prop1}</h2>
      <p>{prop2}</p>
    </div>
  );
}
```

3. Import and use it:

```jsx
import MyComponent from "../components/MyComponent.jsx";

<MyComponent prop1="Hello" prop2="World" />;
```

### How to Make an API Call

```jsx
import api from "../api/axios.js";

// GET request
const response = await api.get("/habits");
const habits = response.data;

// POST request
const response = await api.post("/habits", {
  name: "Exercise",
  category: "Fitness",
});

// PUT request
await api.put(`/habits/${habitId}`, { name: "New Name" });

// DELETE request
await api.delete(`/habits/${habitId}`);
```

### How to Use Authentication

```jsx
import { useAuth } from "../context/AuthContext.jsx";

function MyComponent() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### How to Toggle Theme

```jsx
import { useTheme } from "../context/ThemeContext.jsx";

function MyComponent() {
  const { theme, toggle } = useTheme();

  return <button onClick={toggle}>Current theme: {theme}</button>;
}
```

### How to Show a Modal

```jsx
import { useState } from "react";
import Modal from "../components/Modal.jsx";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>

      <Modal open={open} onClose={() => setOpen(false)} title="My Modal">
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### How to Format Dates

```jsx
import { toKey, prettyDate, last7Days } from "../utils/dateHelpers.js";

// Get today's date as "2024-01-15"
const today = toKey(new Date());

// Format date nicely: "Jan 15, 2024"
const formatted = prettyDate(new Date());

// Get last 7 days
const days = last7Days();
// Returns: [{ key: "2024-01-15", label: "Mon", short: "15", date: Date }]
```

### How to Trigger Confetti

```jsx
import { celebrate, celebrateBig } from "../utils/confetti.js";

// Small celebration
celebrate();

// Big celebration (from both sides)
celebrateBig();
```

## 🎨 Styling Patterns

### Common CSS Classes

```jsx
// Cards
<div className="card p-5">Content</div>

// Buttons
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<button className="btn-ghost">Ghost Button</button>

// Inputs
<input className="input" placeholder="Enter text" />

// Labels
<label className="label">Field Name</label>

// Chips/Tags
<span className="chip">Tag</span>

// Text colors
<p className="text-soft">Soft text</p>
<p className="text-muted">Muted text</p>
<p className="text-faint">Faint text</p>

// Glass effect
<div className="glass p-4">Glass morphism</div>
```

### Responsive Design

```jsx
// Mobile-first approach
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="md:hidden">Mobile only</div>
```

### Animations

```jsx
// Fade in
<div className="animate-fade-in">Content</div>

// Slide up
<div className="animate-slide-up">Content</div>

// Pop animation
<div className="animate-pop">Content</div>

// Float animation
<div className="animate-float">Content</div>
```

## 🔄 State Management Patterns

### Local State (useState)

```jsx
import { useState } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
}
```

### Side Effects (useEffect)

```jsx
import { useEffect, useState } from "react";

function MyComponent() {
  const [data, setData] = useState([]);

  // Run once on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Run when dependency changes
  useEffect(() => {
    console.log("Data changed:", data);
  }, [data]);

  return <div>{data.length} items</div>;
}
```

### Memoization (useMemo)

```jsx
import { useMemo } from "react";

function MyComponent({ habits, logs }) {
  // Only recalculate when habits or logs change
  const completedCount = useMemo(() => {
    return habits.filter((h) => logs.some((l) => l.habitId === h._id)).length;
  }, [habits, logs]);

  return <div>{completedCount} completed</div>;
}
```

## 📊 Data Patterns

### Fetching Data

```jsx
import { useEffect, useState } from "react";
import api from "../api/axios.js";

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/endpoint");
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{data.length} items</div>;
}
```

### Updating Data

```jsx
// Add item to array
setItems([...items, newItem]);

// Remove item from array
setItems(items.filter((item) => item.id !== idToRemove));

// Update item in array
setItems(
  items.map((item) =>
    item.id === idToUpdate ? { ...item, name: "New Name" } : item,
  ),
);

// Update object
setUser({ ...user, name: "New Name" });
```

## 🧭 Navigation Patterns

### Programmatic Navigation

```jsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### Link Navigation

```jsx
import { Link } from "react-router-dom";

<Link to="/dashboard" className="btn-primary">
  Go to Dashboard
</Link>;
```

### Get Current Location

```jsx
import { useLocation } from "react-router-dom";

function MyComponent() {
  const location = useLocation();

  return <div>Current path: {location.pathname}</div>;
}
```

## 🎯 Common Patterns

### Conditional Rendering

```jsx
// If-else
{
  user ? <Dashboard /> : <Login />;
}

// Show only if true
{
  isLoading && <LoadingSpinner />;
}

// Show if true, else show alternative
{
  error ? <ErrorMessage /> : <Content />;
}
```

### Lists

```jsx
{
  habits.map((habit) => <HabitCard key={habit._id} habit={habit} />);
}
```

### Forms

```jsx
function MyForm() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn-primary">
        Submit
      </button>
    </form>
  );
}
```

## 🔍 Debugging Tips

### Console Logging

```jsx
// Log state changes
useEffect(() => {
  console.log("Habits changed:", habits);
}, [habits]);

// Log props
console.log("Props:", { prop1, prop2 });

// Log API responses
const response = await api.get("/habits");
console.log("API Response:", response.data);
```

### React DevTools

1. Install React DevTools browser extension
2. Open browser DevTools (F12)
3. Go to "Components" tab
4. Inspect component props and state

### Network Tab

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Filter by "Fetch/XHR"
4. See all API requests and responses

## 📝 File Naming Conventions

- **Components**: PascalCase, e.g., `MyComponent.jsx`
- **Pages**: PascalCase, e.g., `Dashboard.jsx`
- **Utils**: camelCase, e.g., `dateHelpers.js`
- **Context**: PascalCase with "Context" suffix, e.g., `AuthContext.jsx`

## 🎨 Color Variables

```css
/* Light mode */
--text: Main text color --text-soft: Softer text --text-muted: Muted text
  --text-faint: Faintest text --surface: Card background
  --surface-strong: Stronger card background --surface-hover: Hover state
  --surface-border: Border color --brand-500: Primary brand color (amber)
  --brand-600: Darker brand color --brand-700: Even darker brand color;
```

## 🚨 Common Errors & Solutions

### "Cannot read property of undefined"

**Solution**: Check if data exists before accessing it

```jsx
{
  user?.name;
} // Safe navigation
{
  habits.length > 0 && habits[0].name;
} // Check length first
```

### "Maximum update depth exceeded"

**Solution**: Don't call setState directly in render

```jsx
// ❌ Wrong
function MyComponent() {
  setCount(count + 1); // Infinite loop!
  return <div>{count}</div>;
}

// ✅ Correct
function MyComponent() {
  useEffect(() => {
    setCount(count + 1);
  }, []);
  return <div>{count}</div>;
}
```

### "401 Unauthorized"

**Solution**: Check if user is logged in and token is valid

```jsx
const { user } = useAuth();
if (!user) {
  navigate("/login");
}
```

## 📚 Next Steps

- Read **[GLOSSARY.md](./GLOSSARY.md)** for term definitions
- Read **[PART-1-Root-Files.md](./PART-1-Root-Files.md)** to start detailed explanations
- Keep this file open as a reference while coding!
