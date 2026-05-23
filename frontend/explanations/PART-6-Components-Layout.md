# PART 6: Layout Components

This part explains the layout components that structure the application's UI. These components provide the frame within which page content is displayed.

## 🏗️ Layout Component Overview

Layout components create the structure and navigation of the app:

- **AppLayout** - Main layout wrapper
- **Sidebar** - Desktop navigation
- **MobileNav** - Mobile bottom navigation
- **ProtectedRoute** - Route authentication wrapper
- **Modal** - Popup dialog component

---

## 📐 AppLayout - Main Layout Wrapper

**File**: `src/components/AppLayout.jsx`

**Purpose**: Wraps all protected pages with sidebar and navigation.

### Complete File

```jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileNav />
      <main className="md:ml-64 px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-10 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

### Explanation

```jsx
import { Outlet } from "react-router-dom";
```

- **Outlet**: Renders the matched child route
- Like a placeholder for page content

```jsx
<div className="min-h-screen">
```

- **min-h-screen**: Minimum height of 100vh (full viewport height)
- Ensures layout fills the screen

```jsx
<Sidebar />
<MobileNav />
```

- **Sidebar**: Desktop navigation (hidden on mobile)
- **MobileNav**: Mobile navigation (hidden on desktop)

```jsx
<main className="md:ml-64 px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-10 max-w-6xl mx-auto">
  <Outlet />
</main>
```

- **md:ml-64**: On desktop, add left margin for sidebar (64 = 256px)
- **px-4 md:px-8**: Horizontal padding (responsive)
- **py-6 md:py-8**: Vertical padding (responsive)
- **pb-24 md:pb-10**: Extra bottom padding for mobile nav
- **max-w-6xl**: Maximum width constraint
- **mx-auto**: Center horizontally
- **Outlet**: Renders current page (Dashboard, Habits, etc.)

### Visual Structure

```
┌─────────────────────────────────────────────┐
│  Sidebar (desktop only)                     │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │  Main Content Area                    │  │
│  │  ┌─────────────────────────────────┐ │  │
│  │  │                                 │ │  │
│  │  │  <Outlet /> renders here        │ │  │
│  │  │  (Dashboard, Habits, etc.)      │ │  │
│  │  │                                 │ │  │
│  │  └─────────────────────────────────┘ │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  MobileNav (mobile only, bottom)            │
└─────────────────────────────────────────────┘
```

---

## 🧭 Sidebar - Desktop Navigation

**File**: `src/components/Sidebar.jsx`

**Purpose**: Provides navigation links, theme toggle, settings, and user profile on desktop.

### Key Features

- App logo and branding
- Navigation links (Dashboard, Habits, Weekly, Insights, Stats)
- Active link highlighting
- Theme toggle button
- Settings button with modal
- User profile section
- Logout button

### Navigation Array

```jsx
const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/weekly", label: "Weekly", icon: CalendarDays },
  { to: "/insights", label: "Insights", icon: Brain },
  { to: "/stats", label: "Statistics", icon: BarChart3 },
];
```

- Array of navigation items
- Each has: route, label, and icon

### Active Link Styling

```jsx
<NavLink
  to={to}
  className={({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-gradient-to-r from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/20"
        : "text-soft hover:bg-[var(--surface-hover)]"
    }`
  }
>
```

- **NavLink**: React Router component that knows if it's active
- **isActive**: Boolean indicating if this is the current route
- **Conditional classes**: Different styles for active vs inactive

### Settings Modal

```jsx
const [settingsOpen, setSettingsOpen] = useState(false);
const [morning, setMorning] = useState(user?.morningMotivation || false);
const [name, setName] = useState(user?.name || "");

const save = async () => {
  setSaving(true);
  try {
    const res = await api.put("/auth/profile", {
      name,
      morningMotivation: morning,
    });
    updateUser(res.data.user);
    setSettingsOpen(false);
  } finally {
    setSaving(false);
  }
};
```

- Allows user to update name and morning motivation preference
- Saves to backend and updates AuthContext

### User Profile Section

```jsx
<div className="px-2 py-2 flex items-center gap-3">
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold flex items-center justify-center shadow-md shadow-brand-500/30">
    {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
  </div>
  <div className="flex-1 min-w-0">
    <div className="text-sm font-medium truncate">{user?.name}</div>
    <div className="text-xs text-faint truncate">{user?.email}</div>
  </div>
  <button onClick={logout} title="Log out">
    <LogOut size={16} />
  </button>
</div>
```

- Shows user avatar (first letter of name)
- Displays name and email
- Logout button

---

## 📱 MobileNav - Mobile Bottom Navigation

**File**: `src/components/MobileNav.jsx`

**Purpose**: Provides bottom navigation bar for mobile devices.

### Key Features

- Fixed to bottom of screen
- Only visible on mobile (hidden on desktop)
- Same navigation links as Sidebar
- Icon-only display (no labels)
- Active link highlighting

### Structure

```jsx
<nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t">
  <div className="flex items-center justify-around px-2 py-2">
    {nav.map(({ to, icon: Icon }) => (
      <NavLink to={to} className={...}>
        <Icon size={20} />
      </NavLink>
    ))}
  </div>
</nav>
```

- **md:hidden**: Hidden on desktop (≥768px)
- **fixed bottom-0**: Stuck to bottom
- **inset-x-0**: Full width
- **justify-around**: Evenly space links

---

## 🔒 ProtectedRoute - Authentication Wrapper

**File**: `src/components/ProtectedRoute.jsx`

**Purpose**: Protects routes from unauthenticated access. Redirects to login if not logged in.

### Complete File

```jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner full />;
  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}
```

### Logic Flow

```
1. Get user and loading from AuthContext
   ↓
2. If still loading (checking auth)
   → Show loading spinner
   ↓
3. If no user (not logged in)
   → Redirect to /login
   → Save current location in state
   ↓
4. If user exists (logged in)
   → Render children (the protected content)
```

### Saving Previous Location

```jsx
<Navigate to="/login" state={{ from: location.pathname }} replace />
```

- **state={{ from: location.pathname }}**: Saves where user was trying to go
- After login, can redirect back to this page
- Example: User tries to visit `/dashboard` → redirected to `/login` → after login, redirected back to `/dashboard`

### Usage in App.jsx

```jsx
<Route
  element={
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<Dashboard />} />
  {/* ... more protected routes */}
</Route>
```

---

## 🪟 Modal - Popup Dialog Component

**File**: `src/components/Modal.jsx`

**Purpose**: Reusable modal/dialog component for forms, confirmations, etc.

### Complete File

```jsx
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`${maxWidth} w-full max-h-[90vh] glass-strong rounded-2xl animate-slide-up shadow-2xl flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-3 shrink-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="btn-ghost p-2"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 pb-6 overflow-y-auto flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Props

- **open**: Boolean - whether modal is visible
- **onClose**: Function - called when modal should close
- **title**: String - modal title
- **children**: React nodes - modal content
- **maxWidth**: String - Tailwind max-width class (default: "max-w-lg")

### Key Features

#### 1. Escape Key Handler

```jsx
const handler = (e) => e.key === "Escape" && onClose();
window.addEventListener("keydown", handler);
```

- Closes modal when Escape key is pressed
- Improves accessibility

#### 2. Body Scroll Lock

```jsx
document.body.style.overflow = "hidden";
return () => {
  document.body.style.overflow = "";
};
```

- Prevents scrolling page behind modal
- Cleanup function restores scrolling when modal closes

#### 3. Click Outside to Close

```jsx
<div onClick={onClose}>
  <div onClick={(e) => e.stopPropagation()}>{/* Modal content */}</div>
</div>
```

- Clicking backdrop closes modal
- **stopPropagation**: Prevents clicks inside modal from closing it

#### 4. Animations

```jsx
className = "... animate-fade-in";
className = "... animate-slide-up";
```

- **animate-fade-in**: Backdrop fades in
- **animate-slide-up**: Modal slides up from bottom

### Usage Example

```jsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open Modal</button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="My Modal"
  maxWidth="max-w-md"
>
  <p>Modal content goes here</p>
  <button onClick={() => setOpen(false)}>Close</button>
</Modal>
```

---

## 🎨 Responsive Design

### Desktop (≥768px)

- Sidebar visible on left
- Main content has left margin
- MobileNav hidden

### Mobile (<768px)

- Sidebar hidden
- MobileNav visible at bottom
- Main content full width with bottom padding

### Breakpoint Classes

```jsx
// Hidden on mobile, visible on desktop
className = "hidden md:flex";

// Visible on mobile, hidden on desktop
className = "md:hidden";

// Different margins
className = "px-4 md:px-8"; // 16px mobile, 32px desktop
```

---

## 📚 Summary

| Component          | Purpose             | Key Features                           |
| ------------------ | ------------------- | -------------------------------------- |
| **AppLayout**      | Main layout wrapper | Sidebar + MobileNav + Outlet           |
| **Sidebar**        | Desktop navigation  | Links, theme toggle, settings, profile |
| **MobileNav**      | Mobile navigation   | Bottom bar with icon links             |
| **ProtectedRoute** | Auth guard          | Redirects if not logged in             |
| **Modal**          | Popup dialog        | Escape key, click outside, animations  |

---

## 🎯 Key Takeaways

1. **AppLayout** provides consistent structure for all protected pages
2. **Outlet** is where page content renders
3. **Sidebar** and **MobileNav** provide responsive navigation
4. **ProtectedRoute** ensures only logged-in users access protected pages
5. **Modal** is reusable for all popup dialogs
6. Responsive design uses Tailwind breakpoints (md:, lg:, etc.)

---

## 📖 Next Steps

Now that you understand layout components, let's explore habit-related components!

Next: Read **[PART-7-Components-Habits.md](./PART-7-Components-Habits.md)** for habit components!
