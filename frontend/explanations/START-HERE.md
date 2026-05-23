# START HERE - Frontend Overview

## 🎯 What Is This Application?

This is an **AI-powered Habit Tracker** web application. Users can:

- Create and track daily habits
- Mark habits as complete each day
- View their progress with charts and statistics
- Get AI-generated insights and suggestions
- Build and maintain streaks

## 🏗️ The Big Picture

Think of this frontend application like a **house with different rooms**:

```
┌─────────────────────────────────────────────────────────┐
│                    🏠 THE HOUSE                         │
│                                                         │
│  📦 Root Files (Foundation)                             │
│  ├── package.json (List of tools we use)               │
│  ├── vite.config.js (Build system settings)            │
│  └── index.html (The front door)                       │
│                                                         │
│  🚪 Entry Point (Hallway)                              │
│  ├── main.jsx (First code that runs)                   │
│  └── App.jsx (Main router/traffic controller)          │
│                                                         │
│  🧠 Context (Shared Memory)                            │
│  ├── AuthContext (Who is logged in?)                   │
│  └── ThemeContext (Light or dark mode?)                │
│                                                         │
│  🔌 API & Utils (Utilities Room)                       │
│  ├── axios.js (Talks to backend server)                │
│  ├── dateHelpers.js (Date calculations)                │
│  ├── confetti.js (Celebration animations)              │
│  └── constants.js (Fixed values)                       │
│                                                         │
│  📄 Pages (Different Rooms)                            │
│  ├── Landing (Welcome page)                            │
│  ├── Login (Sign in)                                   │
│  ├── Register (Sign up)                                │
│  ├── Dashboard (Main habit view)                       │
│  ├── Habits (Manage all habits)                        │
│  ├── Weekly (Week view)                                │
│  ├── Insights (AI insights)                            │
│  └── Stats (Statistics)                                │
│                                                         │
│  🧩 Components (Furniture/Decorations)                 │
│  ├── Layout (Sidebar, Navigation)                      │
│  ├── Habit Cards (Display habits)                      │
│  ├── Charts (Visual data)                              │
│  ├── AI Components (AI features)                       │
│  └── Modals (Popup windows)                            │
│                                                         │
│  🎨 Styles (Paint & Decoration)                        │
│  └── index.css (All the colors and styles)             │
└─────────────────────────────────────────────────────────┘
```

## 🔄 How Data Flows

Here's how information moves through the application:

```
1. USER OPENS APP
   ↓
2. index.html loads → main.jsx runs
   ↓
3. main.jsx sets up:
   - ThemeContext (light/dark mode)
   - AuthContext (login state)
   - Router (page navigation)
   ↓
4. App.jsx decides which page to show
   ↓
5. PAGE LOADS (e.g., Dashboard)
   ↓
6. Page fetches data from backend via axios
   ↓
7. Page displays COMPONENTS with that data
   ↓
8. USER INTERACTS (clicks, types, etc.)
   ↓
9. Component sends data to backend
   ↓
10. Backend responds → Page updates → User sees changes
```

## 🗂️ Folder Structure Explained

```
frontend/
│
├── public/                    # Static files (images, icons)
│   ├── favicon.svg           # Browser tab icon
│   └── icons.svg             # Icon sprite sheet
│
├── src/                       # All source code lives here
│   │
│   ├── api/                   # Backend communication
│   │   └── axios.js          # Configured HTTP client
│   │
│   ├── assets/                # Images and media
│   │   ├── hero.png          # Landing page image
│   │   ├── react.svg         # React logo
│   │   └── vite.svg          # Vite logo
│   │
│   ├── components/            # Reusable UI pieces
│   │   ├── Layout components (Sidebar, AppLayout, etc.)
│   │   ├── Habit components (HabitCard, HabitForm, etc.)
│   │   ├── Chart components (HeatmapChart, ProgressRing, etc.)
│   │   └── AI components (AIChat, AIWeeklyReport, etc.)
│   │
│   ├── context/               # Global state management
│   │   ├── AuthContext.jsx   # User authentication state
│   │   └── ThemeContext.jsx  # Theme (light/dark) state
│   │
│   ├── pages/                 # Full page components
│   │   ├── Landing.jsx       # Home/marketing page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Sign up page
│   │   ├── Dashboard.jsx     # Main app page
│   │   ├── Habits.jsx        # All habits management
│   │   ├── Weekly.jsx        # Weekly view
│   │   ├── Insights.jsx      # AI insights page
│   │   └── Stats.jsx         # Statistics page
│   │
│   ├── utils/                 # Helper functions
│   │   ├── confetti.js       # Celebration animations
│   │   ├── constants.js      # App-wide constants
│   │   └── dateHelpers.js    # Date manipulation
│   │
│   ├── App.jsx                # Main app component (router)
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
│
├── .env                       # Environment variables (API URL)
├── .env.example               # Example environment file
├── .gitignore                 # Files to ignore in git
├── eslint.config.js           # Code quality rules
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── postcss.config.js          # CSS processing config
├── tailwind.config.js         # Tailwind CSS config (if exists)
└── vite.config.js             # Vite build tool config
```

## 🔑 Key Concepts You Need to Know

### 1. **React Components**

Components are like LEGO blocks. Each component is a piece of UI that can be reused.

Example:

```jsx
// A simple component
function Button() {
  return <button>Click me</button>;
}
```

### 2. **Props**

Props are like **arguments** you pass to components.

```jsx
function Button({ text, color }) {
  return <button style={{ color }}>{text}</button>;
}

// Usage:
<Button text="Save" color="blue" />;
```

### 3. **State**

State is **data that can change**. When state changes, React re-renders the component.

```jsx
const [count, setCount] = useState(0);
// count = current value
// setCount = function to update it
```

### 4. **Context**

Context is like a **global variable** that any component can access without passing props down.

```jsx
// AuthContext provides user info to all components
const { user } = useAuth();
```

### 5. **Hooks**

Hooks are special functions that let you use React features:

- `useState` - manage state
- `useEffect` - run code when something changes
- `useContext` - access context
- `useMemo` - optimize calculations
- `useCallback` - optimize functions

### 6. **Routing**

Routing means showing different pages based on the URL:

- `/` → Landing page
- `/login` → Login page
- `/dashboard` → Dashboard page

## 🛠️ Technologies Used

| Technology          | Purpose      | Why We Use It                     |
| ------------------- | ------------ | --------------------------------- |
| **React 19**        | UI framework | Build interactive user interfaces |
| **Vite**            | Build tool   | Fast development and building     |
| **React Router**    | Navigation   | Handle page routing               |
| **Axios**           | HTTP client  | Make API calls to backend         |
| **Tailwind CSS**    | Styling      | Utility-first CSS framework       |
| **Lucide React**    | Icons        | Beautiful icon library            |
| **Recharts**        | Charts       | Data visualization                |
| **date-fns**        | Dates        | Date manipulation                 |
| **canvas-confetti** | Animations   | Celebration effects               |

## 🎨 Styling Approach

This app uses **Tailwind CSS** with **custom CSS variables** for theming:

1. **Tailwind classes** - Utility classes like `flex`, `p-4`, `text-lg`
2. **Custom classes** - Defined in `index.css` like `.card`, `.btn-primary`
3. **CSS variables** - For colors that change with theme (light/dark)

Example:

```jsx
<div className="card p-5">
  <button className="btn-primary">Click me</button>
</div>
```

## 🔐 Authentication Flow

```
1. User visits app
   ↓
2. AuthContext checks localStorage for token
   ↓
3. If token exists → fetch user data from backend
   ↓
4. If valid → user is logged in
   ↓
5. If invalid → redirect to login page
   ↓
6. User logs in → token saved to localStorage
   ↓
7. All API requests include this token in headers
```

## 📊 Data Flow Example: Completing a Habit

Let's trace what happens when you click a habit to mark it complete:

```
1. USER clicks habit checkbox
   ↓
2. TodayHabitCard component calls onToggle()
   ↓
3. Dashboard.jsx's toggle() function runs
   ↓
4. axios sends POST request to backend: /api/logs
   ↓
5. Backend saves the log and responds with data
   ↓
6. Dashboard updates local state (todayLogs)
   ↓
7. React re-renders TodayHabitCard
   ↓
8. Checkbox appears checked ✓
   ↓
9. Confetti animation plays 🎉
```

## 🚀 Development Workflow

When you run `npm run dev`:

1. Vite starts a development server
2. Opens browser to `http://localhost:5173`
3. Watches for file changes
4. Hot-reloads when you save files
5. Shows errors in browser console

## 📝 Next Steps

Now that you understand the big picture, you can:

1. Read **[GLOSSARY.md](./GLOSSARY.md)** to learn important terms
2. Read **[PART-1-Root-Files.md](./PART-1-Root-Files.md)** to understand configuration
3. Continue through all the PART files in order

## 💡 Pro Tips

- **Open the actual files** as you read the documentation
- **Try making small changes** to see what happens
- **Use browser DevTools** to inspect components
- **Read error messages carefully** - they usually tell you what's wrong
- **Don't memorize everything** - understanding the structure is more important

Ready to dive deeper? Let's go to **[GLOSSARY.md](./GLOSSARY.md)** next!
