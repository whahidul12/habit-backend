# 📘 PART 3: MODELS FOLDER EXPLAINED

This document explains the `/backend/models` folder, which defines the structure of your data (database schemas).

---

## 📁 Folder Structure

```
backend/
└── models/
    ├── Users.js        ← User accounts
    ├── Habits.js       ← Habit definitions
    ├── HabitsLog.js    ← Habit completion tracking
    └── AIinsight.js    ← AI-generated insights
```

---

## 🤔 What are Models?

**Models** are like blueprints for your data. They define:

- What fields each document has
- What type each field is (String, Number, Boolean, etc.)
- Which fields are required
- Default values
- Validation rules
- Relationships between collections

**Think of it like:**

- A **form** that defines what information you need
- A **contract** that ensures data consistency
- A **template** for creating database documents

---

## 1️⃣ **Users.js** - User Account Model 👤

**Location:** `/backend/models/Users.js`

**What it stores:** User account information (name, email, password, preferences)

### Complete Code Breakdown:

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
```

**Imports:**

- `mongoose` - Database ORM
- `bcrypt` - Password hashing library (security)

---

### Schema Definition:

```javascript
const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
```

**Breaking down the `name` field:**

- `type: String` - Must be text
- `required: true` - Cannot be empty (validation)
- `trim: true` - Removes whitespace from start/end

**Example:**

```javascript
// Input: "  John Doe  "
// Stored: "John Doe"
```

---

```javascript
email: { type: String, required: true, trim: true, unique: true, lowercase: true },
```

**The `email` field:**

- `type: String` - Text field
- `required: true` - Must provide an email
- `trim: true` - Remove whitespace
- `unique: true` - No two users can have the same email (enforced by database index)
- `lowercase: true` - Converts to lowercase automatically

**Example:**

```javascript
// Input: "  John@EXAMPLE.com  "
// Stored: "john@example.com"
```

**Why lowercase?**

- Prevents duplicate accounts: "john@example.com" and "John@Example.com" are the same
- Makes email comparison easier

---

```javascript
password: { type: String, required: true, trim: true },
```

**The `password` field:**

- Stores the **hashed** password (not plain text!)
- We'll see how it gets hashed in the `pre("save")` hook below

---

```javascript
avatar: { type: String, default: "" },
```

**The `avatar` field:**

- Stores user's avatar/profile picture
- `default: ""` - Empty string if not provided
- Could be a URL or base64 image

---

```javascript
morningMotivation: { type: Boolean, default: true }
```

**The `morningMotivation` field:**

- User preference: show morning motivation message?
- `type: Boolean` - true or false
- `default: true` - Enabled by default

---

```javascript
    },
    { timestamps: true }
);
```

**The `timestamps` option:**

- Automatically adds two fields:
  - `createdAt` - When the user was created
  - `updatedAt` - When the user was last modified
- Mongoose manages these automatically

**Example document:**

```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$12$...", // hashed
  avatar: "",
  morningMotivation: true,
  createdAt: "2026-05-23T10:00:00.000Z",
  updatedAt: "2026-05-23T10:00:00.000Z"
}
```

---

### Password Hashing Middleware:

```javascript
UserSchema.pre("save", async function (next) {
```

**What is `pre("save")`?**

- A **middleware** that runs **before** saving a user to the database
- `async function` - Can use `await` for asynchronous operations
- `next` - Callback to continue to the next middleware

---

```javascript
if (!this.isModified("password")) return;
```

**What this does:**

- `this` - The user document being saved
- `this.isModified("password")` - Checks if the password field was changed
- `if (!...)` - If password was NOT modified, skip hashing
- `return` - Exit the middleware early

**Why check this?**

- If you're updating the user's name, you don't want to re-hash the already-hashed password
- Only hash when the password is new or changed

---

```javascript
const salt = await bcrypt.genSalt(12);
```

**What is a salt?**

- A random string added to the password before hashing
- Makes the hash unique even if two users have the same password
- `12` - The "cost factor" (higher = more secure but slower)

**Example:**

```javascript
// Password: "password123"
// Salt: "$2a$12$randomsaltstring"
// Result: Different hash each time!
```

---

```javascript
this.password = await bcrypt.hash(this.password, salt);
```

**What this does:**

- Takes the plain text password
- Hashes it with the salt
- Replaces `this.password` with the hashed version

**Example:**

```javascript
// Before: this.password = "password123"
// After:  this.password = "$2a$12$K8nzJ3X7..."
```

**Why hash passwords?**

- If your database is hacked, attackers can't see real passwords
- Even you (the developer) can't see users' passwords
- Industry standard security practice

---

### Custom Methods:

```javascript
UserSchema.methods.matchPassword = async function (plainPass) {
  return await bcrypt.compare(plainPass, this.password);
};
```

**What this does:**

- Adds a custom method to every User document
- `matchPassword(plainPass)` - Compares a plain text password with the hashed password
- Returns `true` if they match, `false` otherwise

**How it's used (in login):**

```javascript
const user = await User.findOne({ email: "john@example.com" });
const isMatch = await user.matchPassword("password123");
if (isMatch) {
  // Login successful
} else {
  // Wrong password
}
```

**Why use bcrypt.compare?**

- You can't "decrypt" a hashed password
- `bcrypt.compare` hashes the input and compares the hashes
- Secure way to verify passwords

---

```javascript
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
```

**What this does:**

- Overrides the default `toJSON()` method
- `this.toObject()` - Converts Mongoose document to plain JavaScript object
- `delete obj.password` - Removes the password field
- Returns the object without the password

**Why do this?**

- When you send a user object in an API response, you don't want to include the password
- This happens automatically when you do `res.json(user)`

**Example:**

```javascript
// Without toJSON override:
res.json(user);
// Returns: { name: "John", email: "john@example.com", password: "$2a$12$..." }

// With toJSON override:
res.json(user);
// Returns: { name: "John", email: "john@example.com" }
```

---

### Export:

```javascript
export default mongoose.model("User", UserSchema);
```

**What this does:**

- Creates a Mongoose model from the schema
- `"User"` - Model name (MongoDB will create a collection called "users")
- `UserSchema` - The schema we defined
- `export default` - Makes it available to other files

**How it's used:**

```javascript
import User from "./models/Users.js";

// Create a new user
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
});

// Find a user
const user = await User.findOne({ email: "john@example.com" });

// Update a user
await User.updateOne({ _id: userId }, { name: "Jane Doe" });

// Delete a user
await User.deleteOne({ _id: userId });
```

---

## 2️⃣ **Habits.js** - Habit Definition Model 🎯

**Location:** `/backend/models/Habits.js`

**What it stores:** Habit definitions (name, category, target, etc.)

### Constants:

```javascript
const CATEGORISE = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Social",
  "Finance",
  "Creative",
  "Other",
];
```

**What this is:**

- An array of allowed habit categories
- Used for validation (only these values are allowed)
- Exported so other files can use it

---

### Schema Fields:

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Users",
  required: true,
  index: true,
},
```

**The `userId` field:**

- `type: ObjectId` - MongoDB's unique identifier type
- `ref: "Users"` - References the Users collection (relationship)
- `required: true` - Every habit must belong to a user
- `index: true` - Creates a database index for faster queries

**What is a reference?**

- Links this habit to a user
- Allows you to "populate" the user data later

**Example:**

```javascript
// Find habits and include user data
const habits = await Habit.find().populate("userId");
// Result: Each habit includes the full user object
```

---

```javascript
name: {
  type: String,
  required: true,
  trim: true,
},
```

**The `name` field:**

- The habit's name (e.g., "Drink 2L of water")
- Required and trimmed

---

```javascript
description: {
  type: String,
  default: "",
  trim: true,
},
```

**The `description` field:**

- Optional description of the habit
- Defaults to empty string if not provided

---

```javascript
category: {
  type: String,
  enum: CATEGORISE,
  default: "Other",
  required: true,
},
```

**The `category` field:**

- `enum: CATEGORISE` - Must be one of the values in the CATEGORISE array
- `default: "Other"` - If not specified, use "Other"
- Validation: Mongoose will reject values not in the enum

**Example:**

```javascript
// Valid:
{
  category: "Health";
}
{
  category: "Fitness";
}

// Invalid (will throw error):
{
  category: "InvalidCategory";
}
```

---

```javascript
frequency: {
  type: String,
  enum: ["daily", "weekly"],
  default: "daily",
},
```

**The `frequency` field:**

- How often the habit should be done
- Only "daily" or "weekly" allowed
- Defaults to "daily"

---

```javascript
targetDays: {
  type: Number,
  default: 7,
  min: 1,
  max: 7,
},
```

**The `targetDays` field:**

- How many days per week the user wants to do this habit
- `type: Number` - Must be a number
- `min: 1` - At least 1 day per week
- `max: 7` - At most 7 days per week
- `default: 7` - Every day by default

**Validation:**

```javascript
// Valid:
{
  targetDays: 3;
}
{
  targetDays: 7;
}

// Invalid (will throw error):
{
  targetDays: 0;
} // Less than min
{
  targetDays: 8;
} // More than max
{
  targetDays: "three";
} // Not a number
```

---

```javascript
color: {
  type: String,
  default: "#6366f1",
},
```

**The `color` field:**

- Hex color code for the habit (used in UI)
- Defaults to indigo (#6366f1)

---

```javascript
icon: {
  type: String,
  default: "🎯",
},
```

**The `icon` field:**

- Emoji icon for the habit
- Defaults to target emoji 🎯

---

```javascript
isArchived: {
  type: Boolean,
  default: false,
},
```

**The `isArchived` field:**

- Whether the habit is archived (hidden from main view)
- Defaults to false (active)
- Allows "soft delete" (keep data but hide it)

---

```javascript
order: {
  type: Number,
  default: 0,
},
```

**The `order` field:**

- Display order in the UI
- Lower numbers appear first
- Allows users to reorder their habits

---

### Exports:

```javascript
export const HABIT_CATEGORISE = CATEGORISE;
export default mongoose.model("Habit", HabitSchema);
```

**Two exports:**

1. `HABIT_CATEGORISE` - The categories array (for use in other files)
2. `default` - The Habit model

---

## 3️⃣ **HabitsLog.js** - Habit Completion Tracking 📝

**Location:** `/backend/models/HabitsLog.js`

**What it stores:** Records of when habits were completed

### Schema Fields:

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true,
},
```

**The `userId` field:**

- Which user completed the habit
- References the User model

---

```javascript
habitId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Habits",
  required: true,
  index: true,
},
```

**The `habitId` field:**

- Which habit was completed
- References the Habit model

---

```javascript
completedDate: {
  type: String, //YYYY-MM-DD
  required: true,
},
```

**The `completedDate` field:**

- **Important:** Stored as a String, not a Date!
- Format: "YYYY-MM-DD" (e.g., "2026-05-23")
- Required field

**Why String instead of Date?**

- Easier to query by exact date (no time component)
- Simpler to compare dates
- Avoids timezone issues

**Example:**

```javascript
// Good:
{
  completedDate: "2026-05-23";
}

// Bad (will cause issues):
{
  completedDate: new Date();
} // Includes time
```

---

```javascript
notes: {
  type: String,
  default: "",
},
```

**The `notes` field:**

- Optional notes about the completion
- Could be used for journaling

---

### Compound Index:

```javascript
HabitLogSchema.index(
  { userId: 1, habitId: 1, completedDate: 1 },
  { unique: true },
);
```

**What this does:**

- Creates a **compound index** on three fields
- `{ unique: true }` - Ensures no duplicate entries

**What it prevents:**

```javascript
// First log: ✅ Allowed
{ userId: "123", habitId: "456", completedDate: "2026-05-23" }

// Second log (same user, habit, date): ❌ Rejected
{ userId: "123", habitId: "456", completedDate: "2026-05-23" }

// Different date: ✅ Allowed
{ userId: "123", habitId: "456", completedDate: "2026-05-24" }
```

**Why this is important:**

- Prevents accidentally marking a habit complete twice on the same day
- Ensures data integrity
- Makes queries faster (indexed fields)

---

## 4️⃣ **AIinsight.js** - AI-Generated Insights 🤖

**Location:** `/backend/models/AIinsight.js`

**What it stores:** AI-generated content (weekly reports, suggestions, chat responses)

### Schema Fields:

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true
},
```

**The `userId` field:**

- Which user this insight is for
- Indexed for fast queries

---

```javascript
type: {
  type: String,
  enum: ["weekly", "suggestion", "recovery", "chat", "morning"],
  required: true
},
```

**The `type` field:**

- What kind of AI insight this is
- **Types explained:**
  - `"weekly"` - Weekly progress report
  - `"suggestion"` - Habit suggestion
  - `"recovery"` - Streak recovery motivation
  - `"chat"` - Chat conversation response
  - `"morning"` - Morning motivation message

---

```javascript
content: { type: String, required: true },
```

**The `content` field:**

- The actual AI-generated text
- Required field

---

```javascript
meta: { type: mongoose.Schema.Types.Mixed, default: {} },
```

**The `meta` field:**

- `type: Mixed` - Can store any type of data (object, array, string, etc.)
- Used for additional metadata
- Defaults to empty object

**Example:**

```javascript
// For a weekly report:
{
  type: "weekly",
  content: "Great week! You completed...",
  meta: {
    weekStart: "2026-05-17",
    weekEnd: "2026-05-23",
    totalCompletions: 42
  }
}

// For a suggestion:
{
  type: "suggestion",
  content: "Try meditating for 10 minutes...",
  meta: {
    category: "Mindfulness",
    difficulty: "easy"
  }
}
```

---

```javascript
generatedAt: { type: Date, default: Date.now() },
```

**The `generatedAt` field:**

- When the AI generated this insight
- `default: Date.now()` - Automatically set to current time

**Note:** There's a bug here! Should be `default: Date.now` (without parentheses)

**Correct version:**

```javascript
generatedAt: { type: Date, default: Date.now },
```

---

## 🔗 Relationships Between Models

```
User (1) ──────┬──────> Habit (many)
               │
               └──────> HabitLog (many)
               │
               └──────> AIinsight (many)

Habit (1) ─────────────> HabitLog (many)
```

**Explained:**

- One User can have many Habits
- One User can have many HabitLogs
- One User can have many AIinsights
- One Habit can have many HabitLogs

---

## 🎯 Summary Table

| Model         | Collection Name | Purpose              | Key Fields                 |
| ------------- | --------------- | -------------------- | -------------------------- |
| **User**      | users           | User accounts        | email, password, name      |
| **Habit**     | habits          | Habit definitions    | name, category, targetDays |
| **HabitLog**  | habitlogs       | Completion tracking  | habitId, completedDate     |
| **AIinsight** | aiinsights      | AI-generated content | type, content              |

---

## 🔍 Common Patterns

### Creating Documents:

```javascript
// Create a user
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
});

// Create a habit
const habit = await Habit.create({
  userId: user._id,
  name: "Drink water",
  category: "Health",
});

// Create a log
const log = await HabitLog.create({
  userId: user._id,
  habitId: habit._id,
  completedDate: "2026-05-23",
});
```

### Querying Documents:

```javascript
// Find all habits for a user
const habits = await Habit.find({ userId: user._id });

// Find logs for a specific date
const logs = await HabitLog.find({ completedDate: "2026-05-23" });

// Find with population (include related data)
const habits = await Habit.find().populate("userId");
```

---

**Next:** Read [PART-4-Middleware-Folder.md](./PART-4-Middleware-Folder.md) to understand request interceptors and error handling.
