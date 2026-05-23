# 📘 PART 6: ROUTES, UTILS & SCRIPTS FOLDERS

This document explains the remaining folders: `/routes`, `/utils`, and `/scripts`.

---

## 📁 ROUTES FOLDER

**Location:** `/backend/routes`

**Purpose:** Define API endpoints and connect them to controllers

### Folder Structure:

```
backend/
└── routes/
    ├── auth.js      ← Authentication endpoints
    ├── habits.js    ← Habit management endpoints
    ├── logs.js      ← Habit logging endpoints
    └── ai.js        ← AI feature endpoints
```

---

### What are Routes?

**Routes** define the **API endpoints** (URLs) that clients can access.

**Think of routes like:**

- A restaurant menu (lists what's available)
- A directory (shows where things are)
- A map (guides requests to the right place)

---

### Route Pattern:

```javascript
import express from "express";
import { protect } from "../middleware/auth.js";
import { getHabits, createHabit } from "../controllers/habitController.js";

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Define endpoints
router.get("/", getHabits); // GET /api/habits
router.post("/", createHabit); // POST /api/habits
router.put("/:id", updateHabit); // PUT /api/habits/:id
router.delete("/:id", deleteHabit); // DELETE /api/habits/:id

export default router;
```

---

### HTTP Methods:

| Method     | Purpose              | Example        |
| ---------- | -------------------- | -------------- |
| **GET**    | Retrieve data        | Get all habits |
| **POST**   | Create new data      | Create a habit |
| **PUT**    | Update existing data | Update a habit |
| **DELETE** | Delete data          | Delete a habit |

---

### Route Parameters:

```javascript
// URL: /api/habits/123
router.get("/:id", getHabit);

// In controller:
const habitId = req.params.id; // "123"
```

---

### Query Parameters:

```javascript
// URL: /api/habits?category=Health&archived=true
router.get("/", getHabits);

// In controller:
const category = req.query.category; // "Health"
const archived = req.query.archived; // "true"
```

---

### Your API Endpoints:

#### Auth Routes (`/api/auth`):

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user profile
```

#### Habit Routes (`/api/habits`):

```
GET    /api/habits           - Get all habits
POST   /api/habits           - Create new habit
PUT    /api/habits/:id       - Update habit
DELETE /api/habits/:id       - Delete habit
PUT    /api/habits/:id/archive - Archive/unarchive habit
PUT    /api/habits/reorder   - Reorder habits
```

#### Log Routes (`/api/logs`):

```
POST   /api/logs             - Mark habit complete
DELETE /api/logs             - Unmark habit
GET    /api/logs/today       - Get today's logs
GET    /api/logs/range       - Get logs in date range
GET    /api/logs/heatmap     - Get heatmap data
GET    /api/logs/stats       - Get all statistics
GET    /api/logs/stats/:habitId - Get habit statistics
```

#### AI Routes (`/api/ai`):

```
POST   /api/ai/weekly        - Generate weekly report
POST   /api/ai/chat          - Chat with AI
POST   /api/ai/suggest       - Get habit suggestions
```

---

## 📁 UTILS FOLDER

**Location:** `/backend/utils`

**Purpose:** Helper functions used across the application

### Folder Structure:

```
backend/
└── utils/
    ├── aiService.js     ← AI/Gemini integration
    └── dateHelper.js    ← Date manipulation functions
```

---

### 1. dateHelper.js - Date Utilities

**Purpose:** Functions for working with dates (formatting, calculating streaks, etc.)

**Common functions:**

```javascript
// Format date as YYYY-MM-DD
export const toDateKey = (date) => format(date, "yyyy-MM-dd");

// Get today's date key
export const todayKey = () => toDateKey(new Date());

// Get last N days
export const lastNDays = (n) => {
  const end = new Date();
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end }).map(toDateKey);
};

// Calculate streak from date keys
export const calcStreak = (sortedDateKeys) => {
  // Complex logic to calculate current and longest streak
  // Returns: { current: 5, longest: 12 }
};
```

**Why separate date utilities?**

- ✅ Reusable across controllers
- ✅ Easier to test
- ✅ Consistent date handling
- ✅ Single source of truth

---

### 2. aiService.js - AI Integration

**Purpose:** Wrapper for Google's Gemini AI API

**Common functions:**

```javascript
import { GoogleGenerativeAI } from "@google/genai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateText = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

**Why separate AI service?**

- ✅ Centralized AI configuration
- ✅ Easy to switch AI providers
- ✅ Reusable across controllers
- ✅ Easier to mock in tests

---

## 📁 SCRIPTS FOLDER

**Location:** `/backend/scripts`

**Purpose:** Utility scripts for development and maintenance

### Folder Structure:

```
backend/
└── scripts/
    └── seed.js      ← Database seeding script
```

---

### seed.js - Database Seeding

**Purpose:** Populate the database with test data

**What it does:**

1. Connects to MongoDB
2. Creates a test user
3. Creates sample habits
4. Generates 90 days of completion logs
5. Logs summary

**When to use:**

- Setting up development environment
- Creating demo data
- Testing the application
- Resetting database to known state

**How to run:**

```bash
pnpm run seed
```

**What gets created:**

- 1 test user (email: whahid@gmail.com)
- 9 sample habits (various categories)
- ~500-700 completion logs (90 days of data)

**Important notes:**

- ⚠️ Deletes existing data for the test user
- ⚠️ Should only be run in development
- ⚠️ Don't run in production!

---

## 🔗 How Everything Connects

```
Request Flow:
1. Client → 2. server.js → 3. Routes → 4. Middleware → 5. Controllers → 6. Models → 7. Database

Helper Flow:
Controllers → Utils (dateHelper, aiService) → External APIs/Libraries
```

---

## 🎯 File Organization Best Practices

### 1. Separation of Concerns

```
✅ Good:
- Routes: Define endpoints
- Controllers: Business logic
- Models: Data structure
- Utils: Helper functions

❌ Bad:
- Everything in one file
- Business logic in routes
- Database queries in routes
```

### 2. Naming Conventions

```
✅ Good:
- habitController.js (camelCase)
- auth.js (lowercase for routes)
- dateHelper.js (descriptive)

❌ Bad:
- HabitController.js (PascalCase for files)
- a.js (not descriptive)
- utils.js (too generic)
```

### 3. File Size

```
✅ Good:
- Keep files under 300 lines
- Split large controllers into multiple files
- Extract reusable logic to utils

❌ Bad:
- 1000+ line files
- Duplicate code across files
```

---

## 📊 Complete API Reference

### Authentication

```
POST /api/auth/register
Body: { name, email, password }
Response: { token, user }

POST /api/auth/login
Body: { email, password }
Response: { token, user }

GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user }
```

### Habits

```
GET /api/habits
Headers: { Authorization: "Bearer <token>" }
Query: { includeArchived: "true" }
Response: [ { habit }, ... ]

POST /api/habits
Headers: { Authorization: "Bearer <token>" }
Body: { name, description, category, frequency, targetDays, color, icon }
Response: { habit }

PUT /api/habits/:id
Headers: { Authorization: "Bearer <token>" }
Body: { name, description, ... }
Response: { habit }

DELETE /api/habits/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message: "Habit deleted" }

PUT /api/habits/:id/archive
Headers: { Authorization: "Bearer <token>" }
Response: { habit }

PUT /api/habits/reorder
Headers: { Authorization: "Bearer <token>" }
Body: { order: [id1, id2, id3, ...] }
Response: { message: "Reordered" }
```

### Logs

```
POST /api/logs
Headers: { Authorization: "Bearer <token>" }
Body: { habitId, date }
Response: { log }

DELETE /api/logs
Headers: { Authorization: "Bearer <token>" }
Body: { habitId, date }
Response: { message: "Unmarked" }

GET /api/logs/today
Headers: { Authorization: "Bearer <token>" }
Response: [ { log }, ... ]

GET /api/logs/range
Headers: { Authorization: "Bearer <token>" }
Query: { start: "2026-05-01", end: "2026-05-23" }
Response: [ { log }, ... ]

GET /api/logs/heatmap
Headers: { Authorization: "Bearer <token>" }
Response: [ { date, count }, ... ]

GET /api/logs/stats
Headers: { Authorization: "Bearer <token>" }
Response: { perHabit: [...], days: [...] }

GET /api/logs/stats/:habitId
Headers: { Authorization: "Bearer <token>" }
Response: { habit, totalCompletions, currentStreak, longestStreak, ... }
```

### AI

```
POST /api/ai/weekly
Headers: { Authorization: "Bearer <token>" }
Response: { content }

POST /api/ai/chat
Headers: { Authorization: "Bearer <token>" }
Body: { message }
Response: { content }

POST /api/ai/suggest
Headers: { Authorization: "Bearer <token>" }
Response: { suggestions: [...] }
```

---

## 🔍 Testing Your API

### Using curl:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get habits (with token)
curl http://localhost:8000/api/habits \
  -H "Authorization: Bearer <your-token-here>"
```

### Using Postman:

1. Create a new request
2. Set method (GET, POST, etc.)
3. Set URL (http://localhost:8000/api/...)
4. Add headers (Authorization: Bearer <token>)
5. Add body (for POST/PUT)
6. Send request

---

## 🎯 Summary

### Routes:

- Define API endpoints
- Connect URLs to controllers
- Apply middleware (auth, validation)

### Utils:

- Helper functions
- Reusable logic
- Date manipulation
- AI integration

### Scripts:

- Development utilities
- Database seeding
- Maintenance tasks

---

**Next:** Read [PART-7-Architecture-Overview.md](./PART-7-Architecture-Overview.md) to understand how everything connects together.
