# Complete File Index

This is a complete list of every file in the frontend folder with a brief description of what it does.

## 📁 Root Level Files

| File                | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `package.json`      | Lists all dependencies and scripts for the project |
| `package-lock.json` | Locks exact versions of dependencies               |
| `pnpm-lock.yaml`    | PNPM package manager lock file                     |
| `vite.config.js`    | Configuration for Vite build tool                  |
| `eslint.config.js`  | Code linting rules                                 |
| `postcss.config.js` | PostCSS configuration for CSS processing           |
| `index.html`        | Main HTML file - entry point for the browser       |
| `.env`              | Environment variables (API URL, etc.)              |
| `.env.example`      | Example environment file for reference             |
| `.gitignore`        | Files to exclude from git version control          |
| `README.md`         | Project documentation                              |

## 📁 public/

Static files served directly by the web server.

| File          | Purpose                    |
| ------------- | -------------------------- |
| `favicon.svg` | Icon shown in browser tab  |
| `icons.svg`   | SVG sprite sheet for icons |

## 📁 src/

All source code for the application.

### 📁 src/ (Root)

| File        | Purpose                                             |
| ----------- | --------------------------------------------------- |
| `main.jsx`  | Application entry point - first code that runs      |
| `App.jsx`   | Main app component with routing logic               |
| `index.css` | Global styles, theme variables, and Tailwind config |

### 📁 src/api/

Backend communication setup.

| File       | Purpose                                 |
| ---------- | --------------------------------------- |
| `axios.js` | Configured Axios instance for API calls |

### 📁 src/assets/

Images and media files.

| File        | Purpose                     |
| ----------- | --------------------------- |
| `hero.png`  | Hero image for landing page |
| `react.svg` | React logo                  |
| `vite.svg`  | Vite logo                   |

### 📁 src/context/

Global state management using React Context API.

| File               | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `AuthContext.jsx`  | Manages user authentication state (login/logout) |
| `ThemeContext.jsx` | Manages theme state (light/dark mode)            |

### 📁 src/utils/

Helper functions and constants.

| File             | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `confetti.js`    | Celebration animation functions                |
| `constants.js`   | App-wide constants (categories, icons, colors) |
| `dateHelpers.js` | Date manipulation and formatting functions     |

### 📁 src/pages/

Full-page components (one per route).

| File            | Purpose                                           |
| --------------- | ------------------------------------------------- |
| `Landing.jsx`   | Home/marketing page (public)                      |
| `Login.jsx`     | User login page                                   |
| `Register.jsx`  | User registration page                            |
| `Dashboard.jsx` | Main dashboard - today's habits and overview      |
| `Habits.jsx`    | Manage all habits (create, edit, delete, reorder) |
| `Weekly.jsx`    | Weekly calendar view of habits                    |
| `Insights.jsx`  | AI-generated insights and chat                    |
| `Stats.jsx`     | Detailed statistics and analytics                 |

### 📁 src/components/

Reusable UI components.

#### Layout Components

| File                 | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| `AppLayout.jsx`      | Main layout wrapper with sidebar and navigation |
| `Sidebar.jsx`        | Left sidebar navigation                         |
| `MobileNav.jsx`      | Bottom navigation for mobile devices            |
| `ProtectedRoute.jsx` | Route wrapper that requires authentication      |

#### Habit Components

| File                       | Purpose                                |
| -------------------------- | -------------------------------------- |
| `TodayHabitCard.jsx`       | Individual habit card for today's view |
| `HabitForm.jsx`            | Form for creating/editing habits       |
| `HabitStatsCard.jsx`       | Displays statistics for a single habit |
| `HabitSuggestionModal.jsx` | AI-powered habit suggestion modal      |

#### Chart & Visualization Components

| File                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `HeatmapChart.jsx`     | 90-day heatmap showing completion patterns |
| `WeeklyGrid.jsx`       | Grid showing this week's habit completions |
| `WeeklyBarChart.jsx`   | Bar chart for weekly statistics            |
| `MonthlyBarChart.jsx`  | Bar chart for monthly statistics           |
| `CategoryPieChart.jsx` | Pie chart showing habits by category       |
| `ProgressRing.jsx`     | Circular progress indicator                |

#### AI Components

| File                     | Purpose                                 |
| ------------------------ | --------------------------------------- |
| `AIChat.jsx`             | Chat interface for AI conversations     |
| `AIWeeklyReport.jsx`     | AI-generated weekly summary report      |
| `MorningMotivation.jsx`  | AI-generated morning motivation message |
| `StreakRecoveryCard.jsx` | AI-powered streak recovery suggestions  |

#### Utility Components

| File                 | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `Modal.jsx`          | Reusable modal/dialog component                       |
| `LoadingSpinner.jsx` | Loading indicator                                     |
| `Markdown.jsx`       | Renders markdown text (for AI responses)              |
| `SummaryCards.jsx`   | Dashboard summary statistics cards                    |
| `OrbitingHabits.jsx` | Animated orbiting habits visualization (landing page) |

## 📊 File Count Summary

```
Total Files: ~60 files

Root Configuration: 11 files
Public Assets: 2 files
Source Code: ~47 files
  ├── Entry Points: 3 files
  ├── Context: 2 files
  ├── API & Utils: 4 files
  ├── Pages: 8 files
  └── Components: 30 files
```

## 🗺️ File Dependency Map

Here's how files depend on each other:

```
index.html
  └── main.jsx
      └── App.jsx
          ├── ThemeContext.jsx
          ├── AuthContext.jsx
          └── Pages (Landing, Login, Register, Dashboard, etc.)
              ├── Components (TodayHabitCard, Modal, Charts, etc.)
              ├── axios.js (API calls)
              └── Utils (dateHelpers, confetti, constants)
```

## 📖 How to Use This Index

1. **Find a file** - Use Ctrl+F to search for a filename
2. **Understand its purpose** - Read the brief description
3. **Read detailed docs** - Go to the corresponding PART file for full explanation
4. **See relationships** - Check the dependency map to understand connections

## 🔍 Quick Lookup by Feature

### Authentication

- `AuthContext.jsx` - Auth state management
- `Login.jsx` - Login page
- `Register.jsx` - Registration page
- `ProtectedRoute.jsx` - Route protection
- `axios.js` - Token handling

### Theming

- `ThemeContext.jsx` - Theme state
- `index.css` - Theme variables and styles

### Habit Management

- `Dashboard.jsx` - Main habit view
- `Habits.jsx` - Full habit management
- `TodayHabitCard.jsx` - Habit display
- `HabitForm.jsx` - Habit creation/editing

### Data Visualization

- `HeatmapChart.jsx` - 90-day heatmap
- `WeeklyGrid.jsx` - Week view
- `WeeklyBarChart.jsx` - Weekly stats
- `MonthlyBarChart.jsx` - Monthly stats
- `CategoryPieChart.jsx` - Category breakdown
- `ProgressRing.jsx` - Progress circles

### AI Features

- `AIChat.jsx` - AI chat interface
- `AIWeeklyReport.jsx` - Weekly AI summary
- `MorningMotivation.jsx` - Daily motivation
- `StreakRecoveryCard.jsx` - Streak recovery
- `HabitSuggestionModal.jsx` - Habit suggestions

### Navigation

- `AppLayout.jsx` - Main layout
- `Sidebar.jsx` - Desktop navigation
- `MobileNav.jsx` - Mobile navigation
- `App.jsx` - Route definitions

Next: Read **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** for common tasks and patterns!
