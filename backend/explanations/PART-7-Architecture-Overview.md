# 📘 PART 7: ARCHITECTURE OVERVIEW

This document explains how all the pieces of your backend fit together.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│                    (React Frontend)                          │
│                  http://localhost:5173                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         │ (JSON + JWT Token)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                          │
│                   http://localhost:8000                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    MIDDLEWARE                           │ │
│  │  • CORS (allow frontend)                               │ │
│  │  • Body Parser (parse JSON)                            │ │
│  │  • Auth (verify JWT token)                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                      ROUTES                             │ │
│  │  • /api/auth    → authRoutes                           │ │
│  │  • /api/habits  → habitRoutes                          │ │
│  │  • /api/logs    → logsRoutes                           │ │
│  │  • /api/ai      → aiRoutes                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   CONTROLLERS                           │ │
│  │  • authController (login, register)                    │ │
│  │  • habitController (CRUD habits)                       │ │
│  │  • logController (track completions)                   │ │
│  │  • aiController (AI insights)                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     MODELS                              │ │
│  │  • User (accounts)                                     │ │
│  │  • Habit (habit definitions)                           │ │
│  │  • HabitLog (completions)                              │ │
│  │  • AIinsight (AI content)                              │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ Mongoose
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      MONGODB                                 │
│                   (Cloud Database)                           │
│                                                              │
│  Collections:                                                │
│  • users                                                     │
│  • habits                                                    │
│  • habitlogs                                                 │
│  • aiinsights                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example

Let's trace a request to create a habit:

### 1. Client Sends Request

```javascript
// Frontend code
fetch("http://localhost:8000/api/habits", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  },
  body: JSON.stringify({
    name: "Drink 2L of water",
    category: "Health",
    targetDays: 7,
  }),
});
```

---

### 2. Express Receives Request

```javascript
// server.js
const app = express();
app.listen(8000); // Listening on port 8000
```

---

### 3. CORS Middleware

```javascript
// server.js
app.use(cors(corsOptions));
// ✅ Checks if origin is allowed
// ✅ Sets CORS headers
// ✅ Allows request to continue
```

---

### 4. Body Parser Middleware

```javascript
// server.js
app.use(express.json());
// ✅ Parses JSON body
// ✅ Attaches to req.body
// req.body = { name: "Drink 2L of water", category: "Health", targetDays: 7 }
```

---

### 5. Route Matching

```javascript
// server.js
app.use("/api/habits", habitRoutes);
// ✅ Matches "/api/habits"
// ✅ Forwards to habitRoutes
```

---

### 6. Auth Middleware

```javascript
// routes/habits.js
router.use(protect);
// ✅ Extracts JWT token from Authorization header
// ✅ Verifies token
// ✅ Fetches user from database
// ✅ Attaches user to req.user
```

---

### 7. Route Handler

```javascript
// routes/habits.js
router.post("/", createHabit);
// ✅ Matches POST /
// ✅ Calls createHabit controller
```

---

### 8. Controller Logic

```javascript
// controllers/habitController.js
export const createHabit = async (req, res) => {
  try {
    // Extract data
    const { name, category, targetDays } = req.body;
    const userId = req.user._id;

    // Validate
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Create habit
    const habit = await Habit.create({
      userId,
      name,
      category,
      targetDays,
      // ... other fields with defaults
    });

    // Return response
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

---

### 9. Model Interaction

```javascript
// models/Habits.js
const habit = await Habit.create({ ... });
// ✅ Validates data against schema
// ✅ Applies defaults
// ✅ Saves to MongoDB
// ✅ Returns created document
```

---

### 10. Database Operation

```
MongoDB:
✅ Inserts document into "habits" collection
✅ Generates unique _id
✅ Adds timestamps (createdAt, updatedAt)
✅ Returns inserted document
```

---

### 11. Response Sent

```javascript
res.status(201).json(habit);
// ✅ Sets status code to 201 (Created)
// ✅ Converts habit object to JSON
// ✅ Sends response to client
```

---

### 12. Client Receives Response

```javascript
// Frontend code
const response = await fetch(...);
const habit = await response.json();
// habit = {
//   _id: "507f1f77bcf86cd799439011",
//   userId: "507f1f77bcf86cd799439012",
//   name: "Drink 2L of water",
//   category: "Health",
//   targetDays: 7,
//   color: "#6366f1",
//   icon: "🎯",
//   isArchived: false,
//   order: 0,
//   createdAt: "2026-05-23T10:00:00.000Z",
//   updatedAt: "2026-05-23T10:00:00.000Z"
// }
```

---

## 📂 Folder Structure Explained

```
backend/
├── config/              ← Configuration files
│   └── db.js           ← Database connection
│
├── controllers/         ← Business logic
│   ├── authController.js
│   ├── habitController.js
│   ├── logController.js
│   └── aiController.js
│
├── middleware/          ← Request interceptors
│   ├── auth.js         ← JWT verification
│   └── errorHandler.js ← Error handling
│
├── models/              ← Data schemas
│   ├── Users.js
│   ├── Habits.js
│   ├── HabitsLog.js
│   └── AIinsight.js
│
├── routes/              ← API endpoints
│   ├── auth.js
│   ├── habits.js
│   ├── logs.js
│   └── ai.js
│
├── scripts/             ← Utility scripts
│   └── seed.js         ← Database seeding
│
├── utils/               ← Helper functions
│   ├── aiService.js    ← AI integration
│   └── dateHelper.js   ← Date utilities
│
├── .env                 ← Environment variables (secrets)
├── .env.example         ← Environment template
├── .gitignore           ← Git ignore rules
├── package.json         ← Project configuration
├── pnpm-lock.yaml       ← Locked dependencies
└── server.js            ← Main entry point
```

---

## 🎯 Design Patterns Used

### 1. MVC Pattern (Model-View-Controller)

```
Model      → Defines data structure (models/)
View       → Frontend (React app)
Controller → Business logic (controllers/)
```

### 2. Middleware Pattern

```
Request → Middleware 1 → Middleware 2 → ... → Route Handler → Response
```

### 3. Repository Pattern

```
Controller → Model → Database
(Business logic uses models to access data)
```

### 4. Separation of Concerns

```
Routes      → Define endpoints
Controllers → Business logic
Models      → Data structure
Utils       → Helper functions
```

---

## 🔐 Authentication Flow

### Registration:

```
1. User submits registration form
   ↓
2. POST /api/auth/register
   ↓
3. authController.register
   ↓
4. Hash password with bcrypt
   ↓
5. Create user in database
   ↓
6. Generate JWT token
   ↓
7. Return token + user to client
   ↓
8. Client stores token in localStorage
```

### Login:

```
1. User submits login form
   ↓
2. POST /api/auth/login
   ↓
3. authController.login
   ↓
4. Find user by email
   ↓
5. Compare password with bcrypt
   ↓
6. Generate JWT token
   ↓
7. Return token + user to client
   ↓
8. Client stores token in localStorage
```

### Protected Requests:

```
1. Client sends request with token
   ↓
2. protect middleware extracts token
   ↓
3. Verify token with JWT
   ↓
4. Fetch user from database
   ↓
5. Attach user to req.user
   ↓
6. Continue to route handler
```

---

## 📊 Data Flow

### Creating a Habit:

```
Frontend
  ↓ POST /api/habits
  ↓ { name, category, targetDays }
  ↓
Middleware (CORS, Body Parser, Auth)
  ↓
Route (POST /)
  ↓
Controller (createHabit)
  ↓ Validate input
  ↓ Create habit
  ↓
Model (Habit.create)
  ↓ Validate schema
  ↓ Apply defaults
  ↓
Database (MongoDB)
  ↓ Insert document
  ↓ Return document
  ↓
Controller
  ↓ Return response
  ↓
Frontend
  ↓ Update UI
```

### Tracking a Habit:

```
Frontend
  ↓ POST /api/logs
  ↓ { habitId, date }
  ↓
Middleware (Auth)
  ↓
Route (POST /)
  ↓
Controller (markComplete)
  ↓ Validate habit exists
  ↓ Create log entry
  ↓
Model (HabitLog.create)
  ↓ Check unique constraint
  ↓ (userId + habitId + date must be unique)
  ↓
Database (MongoDB)
  ↓ Insert log
  ↓
Controller
  ↓ Return log
  ↓
Frontend
  ↓ Update UI (show checkmark)
```

---

## 🔗 Database Relationships

```
User (1) ──────┬──────> Habit (many)
               │        • userId references User._id
               │
               ├──────> HabitLog (many)
               │        • userId references User._id
               │
               └──────> AIinsight (many)
                        • userId references User._id

Habit (1) ─────────────> HabitLog (many)
                         • habitId references Habit._id
```

**Example:**

```javascript
// User
{
  _id: "user123",
  name: "John Doe",
  email: "john@example.com"
}

// Habits (belonging to user123)
{
  _id: "habit1",
  userId: "user123",  // ← References User
  name: "Drink water"
}
{
  _id: "habit2",
  userId: "user123",  // ← References User
  name: "Exercise"
}

// Logs (belonging to user123 and habit1)
{
  _id: "log1",
  userId: "user123",   // ← References User
  habitId: "habit1",   // ← References Habit
  completedDate: "2026-05-23"
}
{
  _id: "log2",
  userId: "user123",   // ← References User
  habitId: "habit1",   // ← References Habit
  completedDate: "2026-05-24"
}
```

---

## 🛡️ Security Layers

### 1. CORS Protection

```javascript
// Only allows requests from specified origins
corsOptions: {
  origin: ["http://localhost:5173"],
  credentials: true
}
```

### 2. JWT Authentication

```javascript
// Verifies user identity on every request
protect middleware:
  ✅ Extracts token
  ✅ Verifies signature
  ✅ Checks expiration
  ✅ Fetches user
```

### 3. Password Hashing

```javascript
// Passwords are never stored in plain text
UserSchema.pre("save"):
  ✅ Generates salt
  ✅ Hashes password with bcrypt
  ✅ Stores hash (not password)
```

### 4. Input Validation

```javascript
// Controllers validate all input
if (!name) {
  return res.status(400).json({ message: "Name is required" });
}
```

### 5. User Ownership Checks

```javascript
// Users can only access their own data
const habit = await Habit.findOne({
  _id: habitId,
  userId: req.user._id, // ← Ensures ownership
});
```

---

## 🚀 Performance Optimizations

### 1. Database Indexes

```javascript
// Faster queries on indexed fields
HabitSchema: userId: {
  index: true;
}

HabitLogSchema: index(
  { userId: 1, habitId: 1, completedDate: 1 },
  { unique: true },
);
```

### 2. Efficient Queries

```javascript
// Only fetch needed fields
const habits = await Habit.find({ userId })
  .select("name category icon") // Only these fields
  .lean(); // Return plain objects (faster)
```

### 3. Batch Operations

```javascript
// Update multiple documents at once
await Promise.all(
  order.map((id, idx) => Habit.updateOne({ _id: id }, { order: idx })),
);
```

---

## 🎯 Key Takeaways

### Architecture Principles:

1. **Separation of Concerns**
   - Routes define endpoints
   - Controllers contain logic
   - Models define data
   - Middleware handles cross-cutting concerns

2. **Single Responsibility**
   - Each file has one job
   - Each function does one thing
   - Easy to understand and maintain

3. **DRY (Don't Repeat Yourself)**
   - Reusable utilities (dateHelper, aiService)
   - Shared middleware (auth, errorHandler)
   - Common patterns across controllers

4. **Security First**
   - Authentication on all protected routes
   - Password hashing
   - Input validation
   - User ownership checks

5. **Scalability**
   - Modular structure (easy to add features)
   - Database indexes (fast queries)
   - Efficient data access patterns

---

## 📚 Technology Stack

| Layer              | Technology    | Purpose                 |
| ------------------ | ------------- | ----------------------- |
| **Runtime**        | Node.js       | JavaScript runtime      |
| **Framework**      | Express       | Web server framework    |
| **Database**       | MongoDB       | NoSQL database          |
| **ODM**            | Mongoose      | MongoDB object modeling |
| **Authentication** | JWT           | Token-based auth        |
| **Password**       | bcrypt        | Password hashing        |
| **AI**             | Google Gemini | AI-powered insights     |
| **Dates**          | date-fns      | Date manipulation       |
| **CORS**           | cors          | Cross-origin requests   |

---

## 🔍 Common Workflows

### Adding a New Feature:

1. **Create Model** (if needed)

   ```javascript
   // models/NewFeature.js
   const schema = new mongoose.Schema({ ... });
   export default mongoose.model("NewFeature", schema);
   ```

2. **Create Controller**

   ```javascript
   // controllers/newFeatureController.js
   export const getFeatures = async (req, res) => { ... };
   export const createFeature = async (req, res) => { ... };
   ```

3. **Create Routes**

   ```javascript
   // routes/newFeature.js
   router.get("/", getFeatures);
   router.post("/", createFeature);
   ```

4. **Register Routes**
   ```javascript
   // server.js
   import newFeatureRoutes from "./routes/newFeature.js";
   app.use("/api/features", newFeatureRoutes);
   ```

---

## 🎓 Learning Path

If you're new to backend development, study in this order:

1. ✅ **PART 1** - Root files (understand project setup)
2. ✅ **PART 2** - Config (database connection)
3. ✅ **PART 3** - Models (data structure)
4. ✅ **PART 4** - Middleware (request processing)
5. ✅ **PART 5** - Controllers (business logic)
6. ✅ **PART 6** - Routes, Utils, Scripts
7. ✅ **PART 7** - Architecture (this document)

---

## 🎯 Summary

Your backend is a well-structured Express application that:

- ✅ Handles user authentication with JWT
- ✅ Manages habits and completion tracking
- ✅ Provides AI-powered insights
- ✅ Follows best practices and design patterns
- ✅ Is secure, scalable, and maintainable

**Congratulations!** You now understand how your entire backend works! 🎉

---

**Need more help?** Refer back to the specific PART documents for detailed explanations of each component.
