# PART 2: Entry Points (main.jsx & App.jsx)

This part explains the first code that runs when your app starts. These are the "entry points" that bootstrap the entire React application.

## 🚪 main.jsx - The Very First Code

**Location**: `frontend/src/main.jsx`

**Purpose**: This is the **first JavaScript file** that runs. It sets up React and mounts it to the DOM.

### Complete File

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

### Line-by-Line Explanation

```jsx
import { StrictMode } from "react";
```

- **StrictMode**: A React component that helps find bugs
- Activates additional checks and warnings in development
- Does nothing in production
- Helps you write better React code

```jsx
import { createRoot } from "react-dom/client";
```

- **createRoot**: The modern way to mount React to the DOM
- Replaces the old `ReactDOM.render()` method
- Enables React 18+ features like concurrent rendering

```jsx
import { BrowserRouter } from "react-router-dom";
```

- **BrowserRouter**: Enables client-side routing
- Allows navigation without full page reloads
- Uses the browser's History API
- Wraps the entire app to enable routing

```jsx
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
```

- **AuthProvider**: Provides authentication state to all components
- **ThemeProvider**: Provides theme (light/dark) state to all components
- These are Context Providers (explained in PART-3)

```jsx
import "./index.css";
```

- Imports global CSS styles
- Includes Tailwind CSS and custom styles
- Applied to the entire app

```jsx
import App from "./App.jsx";
```

- Imports the main App component
- Contains all routing logic

```jsx
createRoot(document.getElementById("root")).render(
```

- **createRoot()**: Creates a React root
- **document.getElementById("root")**: Finds the `<div id="root">` in index.html
- **.render()**: Renders React components into that div

### The Wrapper Structure

```jsx
<StrictMode>
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
</StrictMode>
```

This is like **nesting Russian dolls**. Each wrapper provides functionality to everything inside it:

```
StrictMode (outermost)
  └─ BrowserRouter (enables routing)
      └─ ThemeProvider (provides theme state)
          └─ AuthProvider (provides auth state)
              └─ App (your actual app)
```

**Why this order?**

1. **StrictMode** - Wraps everything for development checks
2. **BrowserRouter** - Must wrap anything that uses routing
3. **ThemeProvider** - Provides theme to all components
4. **AuthProvider** - Provides user info to all components
5. **App** - The actual application

### What Happens When This Runs?

```
1. Browser loads index.html
   ↓
2. Browser runs main.jsx
   ↓
3. React finds <div id="root">
   ↓
4. React creates a root and renders into it
   ↓
5. All providers initialize
   ↓
6. App component renders
   ↓
7. User sees the UI
```

---

## 🗺️ App.jsx - The Route Manager

**Location**: `frontend/src/App.jsx`

**Purpose**: Defines all routes (URLs) and which components to show for each route.

### Complete File

```jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Habits from "./pages/Habits.jsx";
import Weekly from "./pages/Weekly.jsx";
import Insights from "./pages/Insights.jsx";
import Stats from "./pages/Stats.jsx";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/stats" element={<Stats />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

### Line-by-Line Explanation

```jsx
import { Routes, Route, Navigate } from "react-router-dom";
```

- **Routes**: Container for all routes
- **Route**: Defines a single route (URL → Component mapping)
- **Navigate**: Redirects to another route

```jsx
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
// ... more page imports
```

- Imports all page components
- Each page is a full-screen view

```jsx
import AppLayout from "./components/AppLayout.jsx";
```

- **AppLayout**: The main layout with sidebar and navigation
- Wraps all authenticated pages

```jsx
import ProtectedRoute from "./components/ProtectedRoute.jsx";
```

- **ProtectedRoute**: Checks if user is logged in
- Redirects to login if not authenticated

```jsx
export default function App() {
  return (
    <Routes>
```

- **App**: The main component
- **Routes**: Container that holds all Route definitions

### Public Routes

```jsx
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
```

These routes are **public** (anyone can access):

- `/` → Landing page (home/marketing page)
- `/login` → Login page
- `/register` → Registration page

**How it works**:

- When URL is `/`, React Router renders `<Landing />`
- When URL is `/login`, React Router renders `<Login />`
- And so on...

### Protected Routes (Nested)

```jsx
<Route
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/habits" element={<Habits />} />
  <Route path="/weekly" element={<Weekly />} />
  <Route path="/insights" element={<Insights />} />
  <Route path="/stats" element={<Stats />} />
</Route>
```

This is a **nested route structure**. Let's break it down:

**Outer Route** (no path):

```jsx
<Route
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
```

- This route has no `path` attribute
- It wraps all child routes
- Renders `ProtectedRoute` → `AppLayout` for all children

**Inner Routes** (children):

```jsx
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/habits" element={<Habits />} />
// ... etc
```

- These are **child routes**
- They inherit the parent's wrapper (ProtectedRoute + AppLayout)

**What this means**:
When you visit `/dashboard`:

1. ProtectedRoute checks if you're logged in
2. If yes, AppLayout renders (sidebar + navigation)
3. Dashboard renders inside AppLayout
4. If no, redirects to `/login`

**Visual representation**:

```
/dashboard URL
  ↓
ProtectedRoute (checks auth)
  ↓
AppLayout (sidebar + nav)
  ↓
Dashboard (page content)
```

### Catch-All Route

```jsx
<Route path="*" element={<Navigate to="/" replace />} />
```

- **path="\*"**: Matches any URL that doesn't match above routes
- **Navigate**: Redirects to another route
- **to="/"**: Redirect to home page
- **replace**: Replace history entry (can't go back)

**Example**:

- User visits `/some-random-page`
- No route matches
- Catch-all route matches
- Redirects to `/`

---

## 🔄 How Routing Works

### URL Changes

When you click a link or navigate:

```
1. User clicks <Link to="/dashboard">
   ↓
2. React Router updates URL to /dashboard
   ↓
3. React Router finds matching <Route>
   ↓
4. React Router renders that Route's element
   ↓
5. Page updates (no full page reload!)
```

### Route Matching

React Router matches routes **in order**:

```jsx
<Routes>
  <Route path="/" element={<Landing />} /> // Matches /
  <Route path="/login" element={<Login />} /> // Matches /login
  <Route path="/dashboard" element={<Dashboard />} /> // Matches /dashboard
  <Route path="*" element={<Navigate to="/" />} /> // Matches everything else
</Routes>
```

**First match wins!** That's why the catch-all (`*`) is last.

---

## 🎯 Route Protection Flow

Let's trace what happens when you visit `/dashboard`:

```
1. URL: /dashboard
   ↓
2. App.jsx finds matching route
   ↓
3. Route renders ProtectedRoute
   ↓
4. ProtectedRoute checks: Is user logged in?
   ├─ YES → Render AppLayout
   │         ↓
   │    AppLayout renders (sidebar + nav)
   │         ↓
   │    Dashboard renders inside AppLayout
   │         ↓
   │    User sees dashboard
   │
   └─ NO → Redirect to /login
            ↓
         User sees login page
```

---

## 🧩 Component Hierarchy

Here's the full component tree when viewing `/dashboard`:

```
main.jsx
  └─ StrictMode
      └─ BrowserRouter
          └─ ThemeProvider
              └─ AuthProvider
                  └─ App
                      └─ Routes
                          └─ Route (protected)
                              └─ ProtectedRoute
                                  └─ AppLayout
                                      ├─ Sidebar
                                      ├─ MobileNav
                                      └─ Outlet
                                          └─ Dashboard
                                              ├─ MorningMotivation
                                              ├─ SummaryCards
                                              ├─ TodayHabitCard (multiple)
                                              ├─ AIWeeklyReport
                                              ├─ WeeklyGrid
                                              └─ HeatmapChart
```

---

## 💡 Key Concepts

### 1. Single Page Application (SPA)

This app is an **SPA**:

- Only loads once (initial page load)
- Navigation happens without full page reloads
- React Router changes what's displayed
- Feels faster and smoother

### 2. Client-Side Routing

**Traditional websites**:

```
Click link → Browser requests new page → Server sends HTML → Full page reload
```

**React Router (SPA)**:

```
Click link → React Router updates URL → React renders new component → No reload!
```

### 3. Nested Routes

Nested routes allow **shared layouts**:

```jsx
<Route element={<AppLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/habits" element={<Habits />} />
</Route>
```

Both `/dashboard` and `/habits` share the same `AppLayout` (sidebar, navigation).

### 4. Route Protection

Protected routes ensure only logged-in users can access certain pages:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

If not logged in → redirect to login.

---

## 🎨 Adding a New Route

Want to add a new page? Here's how:

### Step 1: Create the page component

```jsx
// src/pages/MyNewPage.jsx
export default function MyNewPage() {
  return (
    <div>
      <h1>My New Page</h1>
      <p>This is my new page!</p>
    </div>
  );
}
```

### Step 2: Import it in App.jsx

```jsx
import MyNewPage from "./pages/MyNewPage.jsx";
```

### Step 3: Add a route

**For a public page**:

```jsx
<Route path="/my-new-page" element={<MyNewPage />} />
```

**For a protected page** (requires login):

```jsx
<Route
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
  {/* ... existing routes ... */}
  <Route path="/my-new-page" element={<MyNewPage />} />
</Route>
```

### Step 4: Add navigation link

In `Sidebar.jsx`:

```jsx
<Link to="/my-new-page">My New Page</Link>
```

Done! Now `/my-new-page` works.

---

## 📚 Summary

| File       | Purpose       | Key Responsibility                     |
| ---------- | ------------- | -------------------------------------- |
| `main.jsx` | Entry point   | Mounts React to DOM, sets up providers |
| `App.jsx`  | Route manager | Defines all routes and navigation      |

### Execution Flow

```
1. Browser loads index.html
2. index.html loads main.jsx
3. main.jsx sets up React with providers
4. main.jsx renders App
5. App sets up routes
6. React Router matches current URL to a route
7. Matched route's component renders
8. User sees the page
```

---

## 🎯 Key Takeaways

1. **main.jsx** is the first code that runs
2. It sets up **providers** (Auth, Theme, Router)
3. **App.jsx** defines all **routes** (URL → Component mappings)
4. Routes can be **public** or **protected**
5. **Nested routes** share layouts (like AppLayout)
6. **React Router** enables navigation without page reloads

---

## 📖 Next Steps

Now that you understand how the app starts and routes work, let's look at how global state is managed!

Next: Read **[PART-3-Context-State.md](./PART-3-Context-State.md)** to understand AuthContext and ThemeContext!
