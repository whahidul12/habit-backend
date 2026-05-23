# PART 1: Root Configuration Files

This part explains all the configuration files at the root of the frontend folder. These files tell the tools how to build and run your application.

## 📦 package.json

**Location**: `frontend/package.json`

**Purpose**: This is the most important configuration file. It lists all the libraries (dependencies) your project needs and defines scripts to run common tasks.

### Line-by-Line Explanation

```json
{
  "name": "ai-habit-tracker",
```

- **name**: The name of your project
- Used internally by npm

```json
  "private": true,
```

- **private**: Prevents accidental publishing to npm registry
- This is a private app, not a public library

```json
  "version": "0.1.0",
```

- **version**: Current version of your app
- Follows semantic versioning (major.minor.patch)

```json
  "type": "module",
```

- **type**: Tells Node.js to use ES modules
- Allows you to use `import` instead of `require`

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
```

- **scripts**: Commands you can run with `npm run <script-name>`
  - `npm run dev` - Starts development server
  - `npm run build` - Builds production-ready files
  - `npm run lint` - Checks code for errors
  - `npm run preview` - Previews production build locally

```json
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
```

- **@dnd-kit**: Drag-and-drop library
- Used in Habits page to reorder habits

```json
    "axios": "^1.7.2",
```

- **axios**: HTTP client for making API calls
- Easier to use than built-in `fetch`

```json
    "canvas-confetti": "^1.9.3",
```

- **canvas-confetti**: Celebration animation library
- Creates confetti when you complete habits

```json
    "date-fns": "^3.6.0",
```

- **date-fns**: Date manipulation library
- Used for formatting dates, calculating streaks, etc.

```json
    "lucide-react": "^0.411.0",
```

- **lucide-react**: Icon library
- Provides beautiful icons like `<Sparkles />`, `<Flame />`

```json
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
```

- **react**: Core React library
- **react-dom**: React's DOM rendering library
- Version 19 is the latest

```json
    "react-icons": "^5.6.0",
```

- **react-icons**: Another icon library
- Provides additional icon sets

```json
    "react-markdown": "^10.1.0",
```

- **react-markdown**: Renders markdown text
- Used for AI responses

```json
    "react-router-dom": "^6.25.1",
```

- **react-router-dom**: Navigation/routing library
- Handles page navigation without full page reloads

```json
    "recharts": "^2.12.7"
```

- **recharts**: Charting library
- Used for bar charts, pie charts, heatmaps

```json
  "devDependencies": {
```

- **devDependencies**: Tools only needed during development
- Not included in production build

```json
    "@eslint/js": "^10.0.1",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
```

- **ESLint**: Code quality checker
- Finds bugs and enforces coding standards

```json
    "@tailwindcss/postcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
```

- **Tailwind CSS**: Utility-first CSS framework
- Provides classes like `flex`, `p-4`, `text-lg`

```json
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
```

- **PostCSS**: CSS processing tool
- **autoprefixer**: Adds browser-specific CSS prefixes automatically

```json
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
```

- **@types**: TypeScript type definitions
- Provides better autocomplete in editors (even without TypeScript)

```json
    "@vitejs/plugin-react": "^6.0.1",
    "vite": "^8.0.10"
```

- **Vite**: Modern build tool
- **@vitejs/plugin-react**: Vite plugin for React support

### Version Numbers Explained

```
^1.7.2
│ │ │
│ │ └─ Patch version (bug fixes)
│ └─── Minor version (new features, backwards compatible)
└───── Major version (breaking changes)

^ means: Install this version or any newer minor/patch version
```

---

## ⚙️ vite.config.js

**Location**: `frontend/vite.config.js`

**Purpose**: Configures Vite build tool

### Complete File

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
```

### Line-by-Line Explanation

```javascript
import { defineConfig } from "vite";
```

- Imports Vite's configuration helper
- Provides TypeScript autocomplete for config options

```javascript
import react from "@vitejs/plugin-react";
```

- Imports React plugin for Vite
- Enables React features like JSX and Fast Refresh

```javascript
import tailwindcss from "@tailwindcss/vite";
```

- Imports Tailwind CSS plugin
- Processes Tailwind classes during build

```javascript
export default defineConfig({
```

- Exports the configuration object
- `defineConfig` wraps it for better IDE support

```javascript
  plugins: [react(), tailwindcss()],
```

- **plugins**: Array of Vite plugins to use
- `react()` - Enables React support
- `tailwindcss()` - Enables Tailwind CSS processing

```javascript
  server: {
    port: 5173,
  },
```

- **server**: Development server configuration
- **port**: Which port to run on (default is 5173)
- Access app at `http://localhost:5173`

---

## 📄 index.html

**Location**: `frontend/index.html`

**Purpose**: The main HTML file - entry point for the browser

### Complete File

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://rsms.me/" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    <title>Habit Tracker — AI Habit Tracker</title>
    <meta
      name="description"
      content="Track habits, build streaks, and get personalised AI insights about your progress."
    />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Line-by-Line Explanation

```html
<!doctype html>
```

- Declares this is an HTML5 document
- Required at the top of every HTML file

```html
<html lang="en"></html>
```

- Root HTML element
- `lang="en"` - Tells browsers and screen readers the language is English

```html
<head></head>
```

- Contains metadata (information about the page)
- Not visible to users

```html
<meta charset="UTF-8" />
```

- Sets character encoding to UTF-8
- Supports all languages and special characters

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- Sets the favicon (icon in browser tab)
- Points to `/public/favicon.svg`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- Makes the site responsive on mobile devices
- `width=device-width` - Use device's width
- `initial-scale=1.0` - Don't zoom in or out

```html
<link rel="preconnect" href="https://rsms.me/" />
```

- Preconnects to the font server
- Speeds up font loading

```html
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```

- Loads the Inter font from external server
- Inter is a clean, modern font

```html
<title>Habit Tracker — AI Habit Tracker</title>
```

- Sets the page title (shown in browser tab)
- Also used by search engines

```html
<meta
  name="description"
  content="Track habits, build streaks, and get personalised AI insights about your progress."
/>
```

- Page description for search engines
- Shows up in Google search results

```html
<body></body>
```

- Contains the visible content

```html
<div id="root"></div>
```

- **MOST IMPORTANT ELEMENT**
- React will render the entire app inside this div
- `main.jsx` finds this element and mounts React to it

```html
<script type="module" src="/src/main.jsx"></script>
```

- Loads the JavaScript entry point
- `type="module"` - Uses ES modules
- Points to `src/main.jsx` (first code that runs)

---

## 🔐 .env and .env.example

**Location**: `frontend/.env` and `frontend/.env.example`

**Purpose**: Store environment-specific configuration

### .env.example

```
VITE_API_URL=http://localhost:5000/api
```

- **Example file** - Shows what variables are needed
- Committed to git (safe to share)
- Developers copy this to create their own `.env`

### .env

```
VITE_API_URL=http://localhost:5000/api
```

- **Actual file** - Contains real values
- NOT committed to git (in `.gitignore`)
- Each developer has their own version

### How to Use Environment Variables

```javascript
// In your code:
const apiUrl = import.meta.env.VITE_API_URL;
// Returns: "http://localhost:5000/api"
```

**Important Rules**:

1. Variable names MUST start with `VITE_`
2. Changes require restarting dev server
3. Never commit `.env` to git

---

## 🚫 .gitignore

**Location**: `frontend/.gitignore`

**Purpose**: Tells git which files to ignore

### Common Entries

```
# Dependencies
node_modules/
```

- Don't commit installed packages
- Too large and can be reinstalled with `npm install`

```
# Build output
dist/
```

- Don't commit build files
- Generated by `npm run build`

```
# Environment variables
.env
.env.local
```

- Don't commit environment files
- May contain secrets

```
# Editor files
.vscode/
.idea/
```

- Don't commit editor-specific settings
- Each developer has their own preferences

---

## 📝 eslint.config.js

**Location**: `frontend/eslint.config.js`

**Purpose**: Configures ESLint code quality checker

This file sets up rules for:

- Code style consistency
- Catching common bugs
- React-specific best practices

You don't need to understand this file in detail yet. Just know it helps catch errors before they become bugs.

---

## 🎨 postcss.config.js

**Location**: `frontend/postcss.config.js`

**Purpose**: Configures PostCSS (CSS processor)

This file tells PostCSS to:

1. Process Tailwind CSS classes
2. Add browser-specific prefixes (autoprefixer)

You don't need to modify this file.

---

## 📚 Summary

| File                | Purpose                        | Do You Need to Edit It?                   |
| ------------------- | ------------------------------ | ----------------------------------------- |
| `package.json`      | Lists dependencies and scripts | Rarely (when adding new packages)         |
| `vite.config.js`    | Configures build tool          | Rarely (when changing build settings)     |
| `index.html`        | HTML entry point               | Rarely (when changing title or meta tags) |
| `.env`              | Environment variables          | Yes (when API URL changes)                |
| `.env.example`      | Example environment file       | When adding new variables                 |
| `.gitignore`        | Files to ignore in git         | Rarely                                    |
| `eslint.config.js`  | Code quality rules             | Rarely                                    |
| `postcss.config.js` | CSS processing                 | Rarely                                    |

## 🎯 Key Takeaways

1. **package.json** is the heart of your project - it lists everything you need
2. **vite.config.js** tells Vite how to build your app
3. **index.html** is where React mounts to the DOM
4. **.env** stores configuration that changes between environments
5. Most of these files you'll rarely need to touch

## 📖 Next Steps

Now that you understand the configuration files, let's look at the actual code!

Next: Read **[PART-2-Entry-Points.md](./PART-2-Entry-Points.md)** to understand how the app starts!
