# 📘 PART 5: CONTROLLERS FOLDER - OVERVIEW

This document provides an overview of the `/backend/controllers` folder. Due to the length and complexity, each controller has its own detailed document.

---

## 📁 Folder Structure

```
backend/
└── controllers/
    ├── authController.js      ← User authentication (login, register)
    ├── habitController.js     ← Habit CRUD operations
    ├── logController.js       ← Habit completion tracking
    └── aiController.js        ← AI-powered insights
```

---

## 🤔 What are Controllers?

**Controllers** contain the **business logic** of your application. They:

- Process requests
- Interact with the database (via models)
- Perform calculations
- Return responses

**Think of controllers like:**

- The chef in a restaurant (routes are the waiters, models are the ingredients)
- The brain of your application (routes are the nervous system, models are the memory)
- The workers in a factory (routes are the conveyor belt, models are the storage)

---

## 📊 Controller Responsibilities

| Controller          | Responsibilities                 | Example Operations                          |
| ------------------- | -------------------------------- | ------------------------------------------- |
| **authController**  | User authentication & management | Login, Register, Get Profile                |
| **habitController** | Habit management                 | Create, Update, Delete, Archive habits      |
| **logController**   | Habit completion tracking        | Mark complete, Get stats, Calculate streaks |
| **aiController**    | AI-powered features              | Generate insights, Chat, Suggestions        |

---

## 🔄 Request Flow

```
1. Client sends request
   ↓
2. Express receives request
   ↓
3. Middleware runs (CORS, auth, etc.)
   ↓
4. Route matches request
   ↓
5. Controller function executes
   ↓
6. Controller interacts with models
   ↓
7. Controller returns response
   ↓
8. Client receives response
```

---

## 📝 Controller Pattern

All controllers follow a similar pattern:

```javascript
export const functionName = async (req, res) => {
  try {
    // 1. Extract data from request
    const { param1, param2 } = req.body;
    const userId = req.user._id;

    // 2. Validate data
    if (!param1) {
      return res.status(400).json({ message: "param1 is required" });
    }

    // 3. Interact with database
    const result = await Model.create({ param1, param2, userId });

    // 4. Return response
    res.status(201).json(result);
  } catch (err) {
    // 5. Handle errors
    res.status(500).json({ message: err.message });
  }
};
```

---

## 🎯 Common Patterns

### Pattern 1: Create (POST)

```javascript
export const createItem = async (req, res) => {
  try {
    const data = req.body;
    const item = await Model.create(data);
    res.status(201).json(item); // 201 = Created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### Pattern 2: Read (GET)

```javascript
export const getItems = async (req, res) => {
  try {
    const items = await Model.find({ userId: req.user._id });
    res.json(items); // 200 = OK (default)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### Pattern 3: Update (PUT)

```javascript
export const updateItem = async (req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### Pattern 4: Delete (DELETE)

```javascript
export const deleteItem = async (req, res) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

---

## 📚 Detailed Documentation

Each controller has its own detailed document:

### 1. [PART-5A-Auth-Controller.md](./PART-5A-Auth-Controller.md)

- User registration
- User login
- JWT token generation
- Password hashing

### 2. [PART-5B-Habit-Controller.md](./PART-5B-Habit-Controller.md)

- Create habits
- Update habits
- Delete habits
- Archive habits
- Reorder habits

### 3. [PART-5C-Log-Controller.md](./PART-5C-Log-Controller.md)

- Mark habits complete
- Unmark habits
- Get completion logs
- Calculate streaks
- Generate statistics

### 4. [PART-5D-AI-Controller.md](./PART-5D-AI-Controller.md)

- Generate weekly reports
- AI chat functionality
- Habit suggestions
- Morning motivation

---

## 🔍 HTTP Status Codes Used

| Code    | Meaning               | When to Use                            |
| ------- | --------------------- | -------------------------------------- |
| **200** | OK                    | Successful GET, PUT, DELETE            |
| **201** | Created               | Successful POST (created new resource) |
| **400** | Bad Request           | Invalid input data                     |
| **401** | Unauthorized          | Not logged in or invalid token         |
| **404** | Not Found             | Resource doesn't exist                 |
| **500** | Internal Server Error | Server/database error                  |

---

## 🎯 Request/Response Objects

### Request Object (req)

```javascript
req.body; // Data sent in request body (POST, PUT)
req.params; // URL parameters (/habits/:id → req.params.id)
req.query; // Query string (?page=1 → req.query.page)
req.headers; // HTTP headers
req.user; // User object (added by protect middleware)
```

### Response Object (res)

```javascript
res.json(data); // Send JSON response
res.status(code); // Set HTTP status code
res.status(code).json(data); // Set status and send JSON
```

---

## 🔗 How Controllers Connect to Routes

**In routes file:**

```javascript
import { createHabit, getHabits } from "../controllers/habitController.js";

router.post("/", createHabit); // POST /api/habits
router.get("/", getHabits); // GET /api/habits
```

**Flow:**

1. Request comes in: `POST /api/habits`
2. Express matches route: `router.post("/")`
3. Calls controller: `createHabit(req, res)`
4. Controller executes and returns response

---

## 🛡️ Security Considerations

### 1. Always Validate User Ownership

```javascript
// Bad: Anyone can delete any habit
const habit = await Habit.findByIdAndDelete(req.params.id);

// Good: Only owner can delete their habit
const habit = await Habit.findOneAndDelete({
  _id: req.params.id,
  userId: req.user._id, // ← Ensures ownership
});
```

### 2. Sanitize Input

```javascript
// Trim whitespace
const name = req.body.name.trim();

// Validate required fields
if (!name) {
  return res.status(400).json({ message: "Name is required" });
}
```

### 3. Don't Expose Sensitive Data

```javascript
// Bad: Exposes password
res.json(user);

// Good: User model's toJSON removes password
res.json(user); // password is automatically removed
```

---

## 🔧 Error Handling Best Practices

### 1. Use Try-Catch

```javascript
export const someFunction = async (req, res) => {
  try {
    // Your code here
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### 2. Provide Meaningful Error Messages

```javascript
// Bad:
res.status(400).json({ message: "Error" });

// Good:
res.status(400).json({ message: "Habit name is required" });
```

### 3. Log Errors for Debugging

```javascript
catch (err) {
  console.error("Error in createHabit:", err);
  res.status(500).json({ message: err.message });
}
```

---

## 📊 Database Query Patterns

### Find One Document

```javascript
const user = await User.findOne({ email: "john@example.com" });
const habit = await Habit.findById(habitId);
```

### Find Multiple Documents

```javascript
const habits = await Habit.find({ userId: req.user._id });
const logs = await HabitLog.find({ completedDate: "2026-05-23" });
```

### Create Document

```javascript
const habit = await Habit.create({
  userId: req.user._id,
  name: "Drink water",
  category: "Health",
});
```

### Update Document

```javascript
// Method 1: Find and update
const habit = await Habit.findById(id);
habit.name = "New name";
await habit.save();

// Method 2: Update directly
await Habit.updateOne({ _id: id }, { name: "New name" });
```

### Delete Document

```javascript
await Habit.findByIdAndDelete(id);
await Habit.deleteMany({ userId: req.user._id });
```

---

## 🎯 Summary

Controllers are the **brain** of your backend:

- They contain business logic
- They interact with models (database)
- They validate input
- They return responses
- They handle errors

**Key principles:**

- ✅ Always validate input
- ✅ Always check user ownership
- ✅ Always handle errors
- ✅ Always return appropriate status codes
- ✅ Keep controllers focused (single responsibility)

---

**Next Steps:**

Read the detailed controller documents:

1. [PART-5A-Auth-Controller.md](./PART-5A-Auth-Controller.md) - Authentication
2. [PART-5B-Habit-Controller.md](./PART-5B-Habit-Controller.md) - Habit management
3. [PART-5C-Log-Controller.md](./PART-5C-Log-Controller.md) - Completion tracking
4. [PART-5D-AI-Controller.md](./PART-5D-AI-Controller.md) - AI features

Or continue to:

- [PART-6-Routes-Folder.md](./PART-6-Routes-Folder.md) - API endpoint definitions
