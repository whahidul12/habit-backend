# Visual Diagrams

This document contains visual diagrams to help you understand how the application works.

## 📊 Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    index.html                               │ │
│  │                        │                                    │ │
│  │                        ↓                                    │ │
│  │                    main.jsx                                 │ │
│  │                        │                                    │ │
│  │                        ↓                                    │ │
│  │              ┌─────────────────────┐                        │ │
│  │              │   ThemeProvider     │                        │ │
│  │              │   (Light/Dark)      │                        │ │
│  │              └──────────┬──────────┘                        │ │
│  │                         │                                   │ │
│  │              ┌──────────▼──────────┐                        │ │
│  │              │   AuthProvider      │                        │ │
│  │              │   (User Login)      │                        │ │
│  │              └──────────┬──────────┘                        │ │
│  │                         │                                   │ │
│  │              ┌──────────▼──────────┐                        │ │
│  │              │   BrowserRouter     │                        │ │
│  │              │   (Navigation)      │                        │ │
│  │              └──────────┬──────────┘                        │ │
│  │                         │                                   │ │
│  │              ┌──────────▼──────────┐                        │ │
│  │              │      App.jsx        │                        │ │
│  │              │   (Route Manager)   │                        │ │
│  │              └──────────┬──────────┘                        │ │
│  │                         │                                   │ │
│  │         ┌───────────────┼───────────────┐                  │ │
│  │         │               │               │                  │ │
│  │    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐              │ │
│  │    │ Landing │    │  Login  │    │Protected│              │ │
│  │    │  Page   │    │  Page   │    │ Routes  │              │ │
│  │    └─────────┘    └─────────┘    └────┬────┘              │ │
│  │                                        │                   │ │
│  │                    ┌───────────────────┼────────────┐      │ │
│  │                    │                   │            │      │ │
│  │              ┌─────▼─────┐      ┌─────▼─────┐ ┌───▼───┐  │ │
│  │              │ Dashboard │      │  Habits   │ │ Stats │  │ │
│  │              └───────────┘      └───────────┘ └───────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Components                               │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │ │
│  │  │ HabitCard│ │  Charts  │ │   Modal  │ │ Sidebar  │     │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Layer (axios.js)                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ HTTP Requests
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                              │
│                    (Node.js + Express)                           │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Routes     │  │ Controllers  │  │   Models     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              MongoDB Database                     │          │
│  │  ┌────────┐  ┌────────┐  ┌────────┐             │          │
│  │  │ Users  │  │ Habits │  │  Logs  │             │          │
│  │  └────────┘  └────────┘  └────────┘             │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER COMPLETES A HABIT                        │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  1. User clicks checkbox on TodayHabitCard component            │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. TodayHabitCard calls onToggle() prop function               │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. Dashboard.jsx's toggle() function executes                  │
│     - Checks if habit is already completed                      │
│     - Prepares API request                                      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. axios sends POST request to backend                         │
│     POST /api/logs                                              │
│     Body: { habitId: "123", date: "2024-01-15" }               │
│     Headers: { Authorization: "Bearer token..." }              │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. Backend receives request                                    │
│     - Validates token                                           │
│     - Saves log to database                                     │
│     - Returns saved log data                                    │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. Frontend receives response                                  │
│     Response: { _id: "456", habitId: "123", ... }              │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. Dashboard updates state                                     │
│     setTodayLogs([...todayLogs, newLog])                        │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  8. React re-renders components                                 │
│     - TodayHabitCard shows checkmark                            │
│     - Progress ring updates                                     │
│     - Confetti animation plays 🎉                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGS IN                                  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  1. User enters email and password on Login page                │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. Login.jsx calls AuthContext.login(email, password)          │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. AuthContext sends POST /api/auth/login                      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. Backend validates credentials                               │
│     - Checks if user exists                                     │
│     - Verifies password hash                                    │
│     - Generates JWT token                                       │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. Backend returns { token, user }                             │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. AuthContext saves to localStorage                           │
│     localStorage.setItem("token", token)                        │
│     localStorage.setItem("user", JSON.stringify(user))          │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. AuthContext updates state                                   │
│     setUser(user)                                               │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  8. App redirects to /dashboard                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  9. All future API requests include token                       │
│     Headers: { Authorization: "Bearer token..." }              │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Component Hierarchy

```
App
├── Landing (public)
├── Login (public)
├── Register (public)
└── ProtectedRoute
    └── AppLayout
        ├── Sidebar
        │   └── Navigation Links
        ├── MobileNav
        │   └── Bottom Navigation
        └── Outlet (renders current page)
            ├── Dashboard
            │   ├── MorningMotivation
            │   ├── StreakRecoveryCard
            │   ├── SummaryCards
            │   ├── TodayHabitCard (multiple)
            │   │   └── ProgressRing
            │   ├── AIWeeklyReport
            │   ├── WeeklyGrid
            │   ├── HeatmapChart
            │   ├── Modal
            │   │   └── HabitForm
            │   └── HabitSuggestionModal
            │
            ├── Habits
            │   ├── HabitStatsCard (multiple)
            │   ├── Modal
            │   │   └── HabitForm
            │   └── Drag & Drop functionality
            │
            ├── Weekly
            │   ├── WeeklyGrid
            │   └── HabitCard (multiple)
            │
            ├── Insights
            │   ├── AIWeeklyReport
            │   ├── AIChat
            │   │   └── Markdown
            │   └── StreakRecoveryCard
            │
            └── Stats
                ├── SummaryCards
                ├── WeeklyBarChart
                ├── MonthlyBarChart
                ├── CategoryPieChart
                └── HeatmapChart
```

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL STATE (Context)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AuthContext                                              │  │
│  │  ├── user (object or null)                                │  │
│  │  ├── loading (boolean)                                    │  │
│  │  ├── login(email, password)                               │  │
│  │  ├── register(name, email, password)                      │  │
│  │  ├── logout()                                             │  │
│  │  └── updateUser(user)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ThemeContext                                             │  │
│  │  ├── theme ("light" or "dark")                            │  │
│  │  ├── toggle()                                             │  │
│  │  └── setTheme(theme)                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Accessible by all components
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL STATE (useState)                        │
│                                                                  │
│  Dashboard.jsx                                                   │
│  ├── habits (array)                                             │
│  ├── todayLogs (array)                                          │
│  ├── weekLogs (array)                                           │
│  ├── heatmap (array)                                            │
│  ├── loading (boolean)                                          │
│  ├── formOpen (boolean)                                         │
│  ├── editing (object or null)                                   │
│  └── ... more state                                             │
│                                                                  │
│  Login.jsx                                                       │
│  ├── email (string)                                             │
│  ├── password (string)                                          │
│  ├── error (string)                                             │
│  └── loading (boolean)                                          │
│                                                                  │
│  ... each component manages its own local state                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 API Request Flow

```
Component
    │
    │ 1. Calls API function
    │
    ↓
axios.js (configured instance)
    │
    │ 2. Adds Authorization header with token
    │
    ↓
HTTP Request
    │
    │ 3. Sends to backend
    │
    ↓
Backend Server
    │
    │ 4. Validates token
    │ 5. Processes request
    │ 6. Queries database
    │
    ↓
HTTP Response
    │
    │ 7. Returns data or error
    │
    ↓
axios.js
    │
    │ 8. Intercepts response
    │ 9. Handles 401 errors (logout)
    │
    ↓
Component
    │
    │ 10. Updates state with data
    │ 11. React re-renders
    │
    ↓
User sees updated UI
```

## 🎨 Styling Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    index.css                                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  @import "tailwindcss"                                    │  │
│  │  - Imports all Tailwind utility classes                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  @theme { ... }                                           │  │
│  │  - Custom color palette                                   │  │
│  │  - Brand colors (amber/gold)                              │  │
│  │  - Ink colors (grays)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  :root { ... }                                            │  │
│  │  - CSS variables for light mode                           │  │
│  │  - --text, --surface, --bg-base, etc.                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  html.dark { ... }                                        │  │
│  │  - CSS variables for dark mode                            │  │
│  │  - Overrides light mode values                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  @layer components { ... }                                │  │
│  │  - Custom component classes                               │  │
│  │  - .card, .btn-primary, .input, etc.                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  @keyframes { ... }                                       │  │
│  │  - Animation definitions                                  │  │
│  │  - fade-in, slide-up, pop, etc.                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Applied to components
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Component JSX                                 │
│                                                                  │
│  <div className="card p-5">                                     │
│    <button className="btn-primary">                             │
│      Click me                                                   │
│    </button>                                                    │
│  </div>                                                         │
│                                                                  │
│  - Uses Tailwind utilities: p-5, flex, gap-2, etc.             │
│  - Uses custom classes: card, btn-primary, etc.                │
│  - Uses CSS variables: var(--text), var(--surface), etc.       │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 React Rendering Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Component Function Executes                                 │
│     - Runs all hooks (useState, useEffect, etc.)                │
│     - Calculates derived values                                 │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. JSX is Returned                                             │
│     - Creates virtual DOM representation                        │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. React Compares Virtual DOM to Previous Version             │
│     - Finds differences (diffing)                               │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. React Updates Real DOM                                      │
│     - Only changes what's different (reconciliation)            │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. Browser Paints Updated UI                                   │
│     - User sees changes                                         │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. useEffect Hooks Run (if dependencies changed)               │
│     - Side effects execute                                      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ State or props change?
                           │
                           ↓
                    Cycle repeats
```

## 📱 Responsive Design Breakpoints

```
┌─────────────────────────────────────────────────────────────────┐
│  Mobile (default)                                               │
│  < 768px                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Single column layout                                    │   │
│  │  Bottom navigation (MobileNav)                           │   │
│  │  Stacked cards                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  Tablet (md:)                                                   │
│  >= 768px                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Two column layout                                       │   │
│  │  Sidebar appears                                         │   │
│  │  Grid layouts: 2 columns                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  Desktop (lg:)                                                  │
│  >= 1024px                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Full sidebar                                            │   │
│  │  Multi-column layouts                                    │   │
│  │  Grid layouts: 3-4 columns                               │   │
│  │  Larger text and spacing                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

These diagrams should help you visualize how everything connects!

Next: Start reading **[PART-1-Root-Files.md](./PART-1-Root-Files.md)** for detailed explanations!
