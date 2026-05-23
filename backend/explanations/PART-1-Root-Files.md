# 📘 PART 1: ROOT LEVEL FILES EXPLAINED

This document explains all the files at the root of the `/backend` folder.

---

## 1️⃣ **server.js** - The Heart of Your Backend ❤️

**Location:** `/backend/server.js`

**What it is:** This is the **main entry point** of your entire backend application. When you run `pnpm run dev`, this file starts everything.

### Line-by-Line Breakdown:

```javascript
import express from "express";
```

- **Express** is a framework that makes building web servers easy
- Think of it as the foundation of your house
- Without Express, you'd have to write hundreds of lines of low-level code

```javascript
import cors from "cors";
```

- **CORS** = Cross-Origin Resource Sharing
- Allows your frontend (running on `http://localhost:5173`) to talk to your backend (running on `http://localhost:8000`)
- Without this, browsers would block the connection for security reasons
- **Why?** Browsers don't allow websites to make requests to different domains by default

```javascript
import { connectDB } from "./config/db.js";
```

- Imports the function that connects to your MongoDB database
- We'll see this file in PART 2
- This function must run before the server starts accepting requests

```javascript
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import logsRoutes from "./routes/logs.js";
import aiRoutes from "./routes/ai.js";
```

- Imports all your **route handlers** (we'll explain these in PART 6)
- Routes are like different doors in your house - each leads to different functionality:
  - `authRoutes` → Login, Register, User management
  - `habitRoutes` → Create, Read, Update, Delete habits
  - `logsRoutes` → Track habit completions
  - `aiRoutes` → AI-powered insights and suggestions

```javascript
import { notFound, errorHandler } from "./middleware/errorHandler.js";
```

- Imports error handling middleware (we'll explain in PART 4)
- These catch errors and format error responses

```javascript
const app = express();
```

- Creates your Express application
- This `app` object is your entire web server
- Everything else configures this `app`

### CORS Configuration:

```javascript
const allowedOrigins = process.env.CLIENT_URL.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
```

**What this does:**

1. Reads `CLIENT_URL` from environment variables (e.g., `"http://localhost:5173"`)
2. Splits by comma (in case you have multiple frontends like `"http://localhost:5173,https://myapp.com"`)
3. `.map((s) => s.trim())` - Removes whitespace from each URL
4. `.filter(Boolean)` - Removes empty strings

**Example:**

```javascript
// If CLIENT_URL = "http://localhost:5173, https://myapp.com"
// Result: ["http://localhost:5173", "https://myapp.com"]
```

```javascript
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

**Breaking down the `origin` function:**

- `if (!origin)` - Allows requests with no origin (like Postman, curl)
- `if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))` - Allows any localhost request (development)
- `if (allowedOrigins.includes(origin))` - Checks if origin is in your allowed list
- Otherwise, rejects with an error

**Other options:**

- `credentials: true` - Allows cookies and authentication headers
- `methods: [...]` - Which HTTP methods are allowed
- `allowedHeaders: [...]` - Which headers the frontend can send

### Middleware Setup:

```javascript
app.use(cors(corsOptions));
app.options("/*any", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
```

**What is Middleware?**

- Functions that run **before** your route handlers
- They can modify the request, check authentication, parse data, etc.
- Think of them as security checkpoints or data processors

**Each middleware:**

1. `app.use(cors(corsOptions))` - Applies CORS rules to all requests
2. `app.options("/*any", cors(corsOptions))` - Handles preflight requests (browsers send OPTIONS before actual request)
3. `app.use(express.json({ limit: "1mb" }))` - Parses JSON data from request body (max 1MB to prevent abuse)

### Health Check Endpoint:

```javascript
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});
```

**What it does:**

- Creates a simple endpoint to check if the server is running
- Visit `http://localhost:8000/api/health` in your browser
- Returns: `{"status":"ok","time":"2026-05-23T10:30:00.000Z"}`

**Why it's useful:**

- Monitoring tools can ping this to check server health
- Quick way to verify the server is responding
- Useful for deployment health checks

### Route Mounting:

```javascript
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/ai", aiRoutes);
```

**What "mounting" means:**

- Attaches route handlers to specific URL paths
- All routes in `authRoutes` will start with `/api/auth`
- All routes in `habitRoutes` will start with `/api/habits`

**Example:**

```javascript
// If authRoutes has a route: router.post("/login", ...)
// The full URL becomes: POST /api/auth/login

// If habitRoutes has a route: router.get("/", ...)
// The full URL becomes: GET /api/habits
```

### Error Handling:

```javascript
app.use(notFound);
app.use(errorHandler);
```

**Important:** These must come **AFTER** all other routes!

**How it works:**

1. If a request doesn't match any route, `notFound` catches it (404 error)
2. If any route throws an error, `errorHandler` catches it and formats the response

### Starting the Server:

```javascript
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
});
```

**What happens:**

1. Reads `PORT` from environment variables (default: 8000)
2. Calls `connectDB()` to connect to MongoDB
3. `.then(() => ...)` - Only runs if database connection succeeds
4. `app.listen(PORT, ...)` - Starts the server
5. Logs a message when ready

**Why connect to DB first?**

- If the database is down, there's no point starting the server
- Prevents errors when routes try to access the database

---

## 2️⃣ **package.json** - Project Configuration 📦

**Location:** `/backend/package.json`

**What it is:** The **blueprint** of your project. Tells Node.js what your project is and what it needs.

### Key Sections Explained:

```json
{
  "name": "ai-habit-traker-backend",
  "version": "1.0.0",
  "description": "This is a AI Insights Habit Tracker's Backend",
  "main": "server.js",
  "type": "module",
```

**Each field:**

- `name` - Your project's name (note: typo "traker" should be "tracker")
- `version` - Current version (follows semantic versioning: major.minor.patch)
- `description` - What your project does
- `main` - Entry point file (what runs when you start the app)
- `type: "module"` - **CRITICAL:** Enables ES6 modules (allows `import/export` instead of `require()`)

### Scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon --env-file=.env server.js",
  "seed": "node --env-file=.env scripts/seed.js"
}
```

**Commands you can run:**

| Command         | What it does                           | When to use  |
| --------------- | -------------------------------------- | ------------ |
| `pnpm start`    | Runs server normally                   | Production   |
| `pnpm run dev`  | Runs with auto-restart on file changes | Development  |
| `pnpm run seed` | Populates database with test data      | Testing/Demo |

**Flags explained:**

- `--env-file=.env` - Loads environment variables from `.env` file
- `nodemon` - Watches for file changes and auto-restarts

### Dependencies:

```json
"dependencies": {
  "@google/genai": "^2.2.0",
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "date-fns": "^4.1.0",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.6.2"
}
```

**What each package does:**

| Package         | Purpose                | Example Use                     |
| --------------- | ---------------------- | ------------------------------- |
| `@google/genai` | Google's Gemini AI SDK | Generate habit insights         |
| `bcryptjs`      | Password hashing       | Secure password storage         |
| `cors`          | Cross-origin requests  | Allow frontend to connect       |
| `date-fns`      | Date manipulation      | Format dates, calculate streaks |
| `express`       | Web server framework   | Handle HTTP requests            |
| `jsonwebtoken`  | JWT authentication     | Create login tokens             |
| `mongoose`      | MongoDB ORM            | Database operations             |

**Version numbers explained:**

- `^2.2.0` means "2.2.0 or higher, but less than 3.0.0"
- The `^` allows minor and patch updates, but not major updates

### Dev Dependencies:

```json
"devDependencies": {
  "nodemon": "^3.1.14"
}
```

**What's the difference?**

- `dependencies` - Required to **run** your app (production)
- `devDependencies` - Only needed during **development**

---

## 3️⃣ **.env.example** - Environment Variables Template 🔐

**Location:** `/backend/.env.example`

**What it is:** A **template** showing what environment variables your app needs. This file is committed to git, but your actual `.env` file is not.

### Each Variable Explained:

```env
PORT=8000
```

- **What:** The port your server runs on
- **Default:** 8000
- **Why:** Allows you to change the port without editing code

```env
MONGODB_URI=your_mongodb_connection_string_here
```

- **What:** Connection string to your MongoDB database
- **Format:** `mongodb+srv://username:password@cluster.mongodb.net/database`
- **Example:** `mongodb+srv://habitum:password123@cluster.mongodb.net/habitTracker`
- **Why:** Keeps database credentials out of your code

```env
JWT_SECRET=replace_this_wih_a_long_randome_string
```

- **What:** Secret key for signing authentication tokens
- **Should be:** A long, random string (like a password for your tokens)
- **Example:** `a23be6c3150de7bcc66cee9edf963b241a16fc77...` (64+ characters)
- **CRITICAL:** NEVER share this publicly! Anyone with this can create fake login tokens

```env
JWT_EXPIRES_IN=7d
```

- **What:** How long authentication tokens last
- **Format:** `7d` (7 days), `24h` (24 hours), `30m` (30 minutes)
- **Why:** After this time, users need to log in again (security)

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

- **What:** API key for Google's Gemini AI
- **Get it from:** https://makersuite.google.com/app/apikey
- **Used for:** Generating habit insights, suggestions, weekly reports

```env
GEMINI_MODEL=your_gemini_model_here
```

- **What:** Which Gemini model to use
- **Example:** `gemini-2.5-flash` (fast), `gemini-pro` (more capable)
- **Why:** Different models have different speeds and capabilities

```env
CLIENT_URL=http://localhost:5173
```

- **What:** Your frontend's URL
- **Used for:** CORS security (only this URL can access your API)
- **Multiple URLs:** Separate with commas: `http://localhost:5173,https://myapp.com`

### How to Use:

1. Copy `.env.example` to `.env`
2. Replace placeholder values with real ones
3. Never commit `.env` to git (it's in `.gitignore`)

---

## 4️⃣ **.gitignore** - Files to Ignore in Git 🚫

**Location:** `/backend/.gitignore`

**What it is:** Tells Git which files NOT to track/upload to GitHub.

```
.env
node_module
```

**Each line:**

- `.env` - **CRITICAL:** Never upload your `.env` file (contains secrets!)
- `node_module` - **BUG:** Should be `node_modules` (with 's')

**Why ignore these?**

- `.env` - Contains API keys, passwords, secrets
- `node_modules/` - Huge folder (100+ MB), can be regenerated with `pnpm install`

**Fix the typo:**
Change `node_module` to `node_modules`

---

## 5️⃣ **pnpm-lock.yaml** - Dependency Lock File 🔒

**Location:** `/backend/pnpm-lock.yaml`

**What it is:** Locks the exact versions of all dependencies and their sub-dependencies.

**Why it exists:**

- Ensures everyone on your team installs the **exact same** package versions
- Prevents "works on my machine" bugs
- Auto-generated by pnpm

**Should you edit it?** ❌ NO - It's auto-generated

---

## 6️⃣ **pnpm-workspace.yaml** - Workspace Configuration

**Location:** `/backend/pnpm-workspace.yaml`

**What it is:** Configures pnpm workspace (for monorepos with multiple projects).

**In your case:** Probably not needed since you only have one backend project.

---

## 7️⃣ **node_modules/** - Installed Packages 📚

**Location:** `/backend/node_modules/`

**What it is:** A folder containing all the code from packages you installed (express, mongoose, etc.)

**Size:** Usually 100-500 MB

**Important Rules:**

- ❌ **NEVER edit files here** - They get overwritten when you install packages
- ❌ **NEVER commit to git** - It's huge and can be regenerated
- ✅ **Regenerate with:** `pnpm install`

---

## 🎯 SUMMARY TABLE

| File                  | Purpose                         | Can You Edit?          | Committed to Git? |
| --------------------- | ------------------------------- | ---------------------- | ----------------- |
| `server.js`           | Main entry point, starts server | ✅ Yes                 | ✅ Yes            |
| `package.json`        | Project configuration           | ✅ Yes (carefully)     | ✅ Yes            |
| `.env`                | Secret configuration values     | ✅ Yes                 | ❌ NO (secrets!)  |
| `.env.example`        | Template for .env               | ✅ Yes                 | ✅ Yes            |
| `.gitignore`          | Files to ignore in git          | ✅ Yes                 | ✅ Yes            |
| `pnpm-lock.yaml`      | Locked dependency versions      | ❌ No (auto-generated) | ✅ Yes            |
| `pnpm-workspace.yaml` | Workspace config                | ✅ Yes                 | ✅ Yes            |
| `node_modules/`       | Installed packages              | ❌ No (auto-generated) | ❌ NO (huge)      |

---

## 🔍 Common Issues & Fixes

### Issue 1: "Cannot find module 'express'"

**Cause:** `node_modules` not installed  
**Fix:** Run `pnpm install`

### Issue 2: "MongoDB uri is not defined"

**Cause:** `.env` file missing or not loaded  
**Fix:**

1. Copy `.env.example` to `.env`
2. Fill in real values
3. Make sure script uses `--env-file=.env`

### Issue 3: "Port 8000 already in use"

**Cause:** Another process is using port 8000  
**Fix:**

1. Change `PORT=8001` in `.env`
2. Or kill the other process

### Issue 4: CORS errors in browser

**Cause:** Frontend URL not in `CLIENT_URL`  
**Fix:** Add your frontend URL to `.env`: `CLIENT_URL=http://localhost:5173`

---

**Next:** Read [PART-2-Config-Folder.md](./PART-2-Config-Folder.md) to understand database configuration.
