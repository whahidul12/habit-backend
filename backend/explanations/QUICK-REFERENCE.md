# 🚀 QUICK REFERENCE GUIDE

A cheat sheet for common tasks and commands.

---

## 📦 Installation & Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
pnpm install

# Copy environment template
copy .env.example .env

# Edit .env with your values
# (MongoDB URI, JWT Secret, Gemini API Key, etc.)

# Seed database with test data
pnpm run seed

# Start development server
pnpm run dev
```

---

## 🔧 Common Commands

```bash
# Development (auto-restart on changes)
pnpm run dev

# Production
pnpm start

# Seed database
pnpm run seed

# Install new package
pnpm add package-name

# Install dev dependency
pnpm add -D package-name
```

---

## 📁 File Locations

| What                  | Where                                    |
| --------------------- | ---------------------------------------- |
| Main entry point      | `/backend/server.js`                     |
| Environment variables | `/backend/.env`                          |
| Database config       | `/backend/config/db.js`                  |
| User model            | `/backend/models/Users.js`               |
| Habit model           | `/backend/models/Habits.js`              |
| Auth middleware       | `/backend/middleware/auth.js`            |
| Auth controller       | `/backend/controllers/authController.js` |
| Auth routes           | `/backend/routes/auth.js`                |

---

## 🌐 API Endpoints

### Authentication

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Habits

```
GET    /api/habits           - Get all habits
POST   /api/habits           - Create habit
PUT    /api/habits/:id       - Update habit
DELETE /api/habits/:id       - Delete habit
PUT    /api/habits/:id/archive - Archive habit
PUT    /api/habits/reorder   - Reorder habits
```

### Logs

```
POST   /api/logs             - Mark complete
DELETE /api/logs             - Unmark
GET    /api/logs/today       - Today's logs
GET    /api/logs/range       - Date range logs
GET    /api/logs/stats       - All statistics
```

### AI

```
POST   /api/ai/weekly        - Weekly report
POST   /api/ai/chat          - Chat with AI
POST   /api/ai/suggest       - Get suggestions
```

---

## 🔐 Authentication

### Register/Login Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "J",
    "morningMotivation": true
  }
}
```

### Using Token:

```javascript
// Frontend
fetch("/api/habits", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 🗄️ Database Models

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  morningMotivation: Boolean
}
```

### Habit

```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  category: String (enum),
  frequency: String (daily/weekly),
  targetDays: Number (1-7),
  color: String,
  icon: String,
  isArchived: Boolean,
  order: Number
}
```

### HabitLog

```javascript
{
  userId: ObjectId,
  habitId: ObjectId,
  completedDate: String (YYYY-MM-DD),
  notes: String
}
```

---

## 🔍 Common Queries

### Find all habits for a user:

```javascript
const habits = await Habit.find({ userId: req.user._id });
```

### Find logs in date range:

```javascript
const logs = await HabitLog.find({
  userId: req.user._id,
  completedDate: { $gte: startDate, $lte: endDate },
});
```

### Create a habit:

```javascript
const habit = await Habit.create({
  userId: req.user._id,
  name: "Drink water",
  category: "Health",
  targetDays: 7,
});
```

### Update a habit:

```javascript
const habit = await Habit.findOneAndUpdate(
  { _id: habitId, userId: req.user._id },
  { name: "New name" },
  { new: true },
);
```

### Delete a habit:

```javascript
await Habit.findOneAndDelete({
  _id: habitId,
  userId: req.user._id,
});
```

---

## 🛠️ Debugging

### Check if server is running:

```bash
curl http://localhost:8000/api/health
```

### View server logs:

```bash
# In terminal where server is running
# Look for errors, warnings, or console.log output
```

### Test authentication:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## ⚠️ Common Issues

### "MongoDB uri is not defined"

**Fix:** Check `.env` file has `MONGODB_URI=...`

### "Port 8000 already in use"

**Fix:** Change `PORT=8001` in `.env` or kill other process

### "Not Authorized, No Token!"

**Fix:** Include `Authorization: Bearer <token>` header

### "User no longer exists"

**Fix:** User was deleted, need to register/login again

### CORS errors

**Fix:** Add frontend URL to `CLIENT_URL` in `.env`

---

## 📊 HTTP Status Codes

| Code | Meaning      | When                        |
| ---- | ------------ | --------------------------- |
| 200  | OK           | Successful GET, PUT, DELETE |
| 201  | Created      | Successful POST             |
| 400  | Bad Request  | Invalid input               |
| 401  | Unauthorized | Not logged in               |
| 404  | Not Found    | Resource doesn't exist      |
| 500  | Server Error | Server/database error       |

---

## 🔐 Environment Variables

```env
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=long_random_string_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
CLIENT_URL=http://localhost:5173
```

---

## 📝 Code Snippets

### Create a new controller function:

```javascript
export const functionName = async (req, res) => {
  try {
    // Your logic here
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### Add a new route:

```javascript
import { functionName } from "../controllers/controller.js";
router.get("/path", protect, functionName);
```

### Create a new model:

```javascript
import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    field: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("ModelName", Schema);
```

---

## 🎯 Best Practices

✅ **DO:**

- Always validate input
- Check user ownership
- Use try-catch for async operations
- Return appropriate status codes
- Hash passwords
- Use environment variables for secrets

❌ **DON'T:**

- Store passwords in plain text
- Expose sensitive data in responses
- Skip authentication checks
- Commit `.env` file to git
- Use `console.log` in production
- Trust client-side data

---

## 📚 Useful Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 🆘 Getting Help

1. Check the detailed PART documents
2. Read error messages carefully
3. Check server logs
4. Test with curl or Postman
5. Verify environment variables
6. Check database connection

---

**Quick Navigation:**

- [README](./README.md) - Start here
- [PART 1](./PART-1-Root-Files.md) - Root files
- [PART 2](./PART-2-Config-Folder.md) - Database config
- [PART 3](./PART-3-Models-Folder.md) - Data models
- [PART 4](./PART-4-Middleware-Folder.md) - Middleware
- [PART 5](./PART-5-Controllers-Overview.md) - Controllers
- [PART 6](./PART-6-Routes-Utils-Scripts.md) - Routes & Utils
- [PART 7](./PART-7-Architecture-Overview.md) - Architecture
