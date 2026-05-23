# 📘 PART 4: MIDDLEWARE FOLDER EXPLAINED

This document explains the `/backend/middleware` folder, which contains functions that intercept and process requests.

---

## 📁 Folder Structure

```
backend/
└── middleware/
    ├── auth.js           ← Authentication middleware
    └── errorHandler.js   ← Error handling middleware
```

---

## 🤔 What is Middleware?

**Middleware** are functions that run **between** receiving a request and sending a response.

**Think of middleware like:**

- Security checkpoints at an airport
- Filters in a water purification system
- Inspectors on an assembly line

**Middleware can:**

- ✅ Check authentication
- ✅ Validate data
- ✅ Log requests
- ✅ Parse request bodies
- ✅ Handle errors
- ✅ Modify request/response objects

**Flow:**

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

---

## 1️⃣ **auth.js** - Authentication Middleware 🔐

**Location:** `/backend/middleware/auth.js`

**Purpose:** Protects routes by verifying the user is logged in (has a valid JWT token)

### Complete Code Breakdown:

```javascript
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
```

**Imports:**

- `jwt` - JSON Web Token library (for verifying tokens)
- `User` - User model (to fetch user data)

---

### The protect Function:

```javascript
export const protect = async (req, res, next) => {
```

**Function signature:**

- `export const protect` - Named export (can be imported by other files)
- `async` - Can use `await` for database queries
- `(req, res, next)` - Standard middleware parameters:
  - `req` - Request object (contains headers, body, params, etc.)
  - `res` - Response object (used to send responses)
  - `next` - Function to call the next middleware

---

### Step 1: Extract Token from Headers

```javascript
try {
    let token = null;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
```

**What's happening:**

1. **Initialize token variable:**

   ```javascript
   let token = null;
   ```

2. **Check if Authorization header exists:**

   ```javascript
   if (req.headers.authorization && ...)
   ```

   - `req.headers` - Object containing all HTTP headers
   - `authorization` - The Authorization header

3. **Check if it starts with "Bearer":**

   ```javascript
   req.headers.authorization.startsWith("Bearer");
   ```

   - JWT tokens are sent as: `Bearer <token>`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **Extract the token:**
   ```javascript
   token = req.headers.authorization.split(" ")[1];
   ```

   - `split(" ")` - Splits "Bearer token" into ["Bearer", "token"]
   - `[1]` - Gets the second element (the actual token)

**Example:**

```javascript
// Header: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// After split: ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."]
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Step 2: Validate Token Exists

```javascript
if (!token) {
  return res.status(401).json({ message: "Not Authorized, No Token!" });
}
```

**What this does:**

- Checks if token was found
- `401` - HTTP status code for "Unauthorized"
- Returns error message
- `return` - Stops execution (doesn't call `next()`)

**When this happens:**

- User didn't send an Authorization header
- Header doesn't start with "Bearer"
- Header is malformed

---

### Step 3: Verify Token

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**What `jwt.verify()` does:**

- Checks if the token is valid
- Verifies it was signed with your `JWT_SECRET`
- Decodes the token payload
- Throws an error if token is invalid or expired

**Token structure:**

```javascript
// Token payload (what's inside the token):
{
  id: "507f1f77bcf86cd799439011",  // User ID
  iat: 1716460800,                  // Issued at (timestamp)
  exp: 1717065600                   // Expires at (timestamp)
}
```

**After verification:**

```javascript
// decoded = { id: "507f1f77bcf86cd799439011", iat: ..., exp: ... }
```

**Why verify?**

- Ensures the token wasn't tampered with
- Checks if it's expired
- Confirms it was issued by your server

---

### Step 4: Fetch User from Database

```javascript
const user = await User.findById(decoded.id);
```

**What this does:**

- Uses the user ID from the token
- Queries the database for that user
- Returns the user document (or null if not found)

**Why fetch the user?**

- Token might be valid, but user could be deleted
- Need fresh user data (not stale data from token)
- Allows checking if user is still active

---

### Step 5: Check if User Exists

```javascript
if (!user) {
  return res.status(401).json({ message: "User no longer exists" });
}
```

**What this does:**

- Checks if user was found in database
- Returns 401 error if user doesn't exist

**When this happens:**

- User was deleted after token was issued
- User ID in token is invalid
- Database connection issues

---

### Step 6: Attach User to Request

```javascript
req.user = user;
next();
```

**What this does:**

- `req.user = user` - Adds the user object to the request
- `next()` - Calls the next middleware/route handler

**Why attach user to request?**

- Route handlers can access `req.user` to know who's logged in
- No need to fetch user again in every route
- Convenient access to user data

**Example usage in a route:**

```javascript
router.get("/profile", protect, (req, res) => {
  // req.user is available here!
  res.json({
    name: req.user.name,
    email: req.user.email,
  });
});
```

---

### Error Handling:

```javascript
} catch (err) {
    return res.status(401).json({ message: "Not Authorized, No Token!" })
}
```

**What errors are caught:**

- `jwt.verify()` throws if token is invalid
- `jwt.verify()` throws if token is expired
- `User.findById()` throws if database error

**Response:**

- Returns 401 Unauthorized
- Generic error message (doesn't reveal why token failed)

**Why generic message?**

- Security: Don't tell attackers why authentication failed
- Could be invalid token, expired token, or missing user
- All treated the same: "Not Authorized"

---

## 🔒 How Authentication Works (Full Flow)

### 1. User Logs In:

```javascript
// POST /api/auth/login
// Body: { email: "john@example.com", password: "password123" }

// Server creates a token:
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

// Returns token to client:
res.json({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." });
```

### 2. Client Stores Token:

```javascript
// Frontend stores token in localStorage
localStorage.setItem("token", token);
```

### 3. Client Sends Token with Requests:

```javascript
// Frontend includes token in Authorization header
fetch("/api/habits", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### 4. Server Verifies Token:

```javascript
// protect middleware runs
// Extracts token → Verifies token → Fetches user → Attaches to req
```

### 5. Route Handler Accesses User:

```javascript
router.get("/habits", protect, async (req, res) => {
  // req.user is available!
  const habits = await Habit.find({ userId: req.user._id });
  res.json(habits);
});
```

---

## 2️⃣ **errorHandler.js** - Error Handling Middleware ⚠️

**Location:** `/backend/middleware/errorHandler.js`

**Purpose:** Catches errors and formats error responses

### Function 1: notFound

```javascript
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};
```

**What this does:**

- Catches requests to non-existent routes
- `404` - HTTP status code for "Not Found"
- `req.originalUrl` - The URL that was requested

**Example:**

```javascript
// Request: GET /api/nonexistent
// Response: { message: "Route not found: /api/nonexistent" }
```

**When it runs:**

- After all route handlers
- Only if no route matched the request

**Usage in server.js:**

```javascript
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
// ... other routes ...

app.use(notFound); // ← Catches unmatched routes
```

---

### Function 2: errorHandler

```javascript
export const errorHandler = (err, req, res, next) => {
```

**Function signature:**

- `err` - The error object (first parameter!)
- `req, res, next` - Standard middleware parameters

**Important:** Error handling middleware has **4 parameters** (not 3)

---

```javascript
console.error(err);
```

**What this does:**

- Logs the full error to the console
- Useful for debugging
- In production, you'd log to a file or service

---

```javascript
const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
```

**What this does:**

- Checks if a status code was already set
- If yes and it's not 200, use that status code
- Otherwise, default to 500 (Internal Server Error)

**Why this logic?**

```javascript
// If route handler set a status:
res.status(400);
throw new Error("Invalid input");
// errorHandler uses 400

// If no status was set:
throw new Error("Something broke");
// errorHandler uses 500
```

---

```javascript
res.status(status).json({
  message: err.message || "Server Error",
});
```

**What this does:**

- Sets the HTTP status code
- Returns JSON with error message
- Falls back to "Server Error" if no message

**Example responses:**

```javascript
// Custom error:
throw new Error("Habit not found");
// Response: { message: "Habit not found" }

// Generic error:
throw new Error();
// Response: { message: "Server Error" }
```

---

## 🎯 How Errors are Handled

### Synchronous Errors:

```javascript
router.get("/test", (req, res) => {
  throw new Error("Something went wrong");
  // errorHandler catches this automatically
});
```

### Asynchronous Errors:

```javascript
router.get("/test", async (req, res, next) => {
  try {
    await someAsyncOperation();
  } catch (err) {
    next(err); // Pass error to errorHandler
  }
});
```

### Express 5+ (Your Version):

```javascript
// Express 5 automatically catches async errors!
router.get("/test", async (req, res) => {
  await someAsyncOperation();
  // If this throws, errorHandler catches it automatically
});
```

---

## 🔗 Middleware Order Matters!

**In server.js:**

```javascript
// 1. CORS (runs first)
app.use(cors());

// 2. Body parser
app.use(express.json());

// 3. Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

// 4. 404 handler (runs if no route matched)
app.use(notFound);

// 5. Error handler (runs if any error occurred)
app.use(errorHandler);
```

**Why this order?**

- CORS must run before routes (to set headers)
- Body parser must run before routes (to parse JSON)
- Routes run in the middle
- 404 handler runs after routes (catches unmatched)
- Error handler runs last (catches all errors)

---

## 🎯 Summary Table

| Middleware     | Purpose               | When it Runs            | Parameters              |
| -------------- | --------------------- | ----------------------- | ----------------------- |
| `protect`      | Verify authentication | Before protected routes | `(req, res, next)`      |
| `notFound`     | Handle 404 errors     | After all routes        | `(req, res, next)`      |
| `errorHandler` | Handle all errors     | After all middleware    | `(err, req, res, next)` |

---

## 🔍 Common Issues & Solutions

### Issue 1: "Not Authorized, No Token!"

**Causes:**

- Frontend not sending Authorization header
- Token not prefixed with "Bearer "
- Token is expired
- Token is invalid

**Debug:**

```javascript
// In protect middleware, add logging:
console.log("Headers:", req.headers.authorization);
console.log("Token:", token);
```

---

### Issue 2: "User no longer exists"

**Causes:**

- User was deleted after token was issued
- User ID in token is wrong

**Fix:**

- User needs to log in again to get a new token

---

### Issue 3: Errors not being caught

**Cause:**

- Async errors not being passed to `next(err)`
- Error handler not registered in server.js

**Fix:**

```javascript
// Wrap async routes in try-catch:
router.get("/test", async (req, res, next) => {
  try {
    await someOperation();
  } catch (err) {
    next(err); // Pass to error handler
  }
});
```

---

## 🔐 Security Best Practices

### 1. Use Strong JWT Secrets:

```env
# Bad:
JWT_SECRET=secret

# Good:
JWT_SECRET=a23be6c3150de7bcc66cee9edf963b241a16fc77650efc51b7b4d8183b2564093da1e6dd4b926468cae8d1d59edb36fa765e69ee90a52474712309eb041ac02d
```

### 2. Set Token Expiration:

```javascript
// Don't make tokens last forever
jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });
```

### 3. Don't Expose Error Details in Production:

```javascript
// Development:
res.json({ message: err.message, stack: err.stack });

// Production:
res.json({ message: "Server Error" });
```

### 4. Validate Token on Every Request:

```javascript
// Don't trust the client
// Always verify token server-side
```

---

**Next:** Read [PART-5-Controllers-Folder.md](./PART-5-Controllers-Folder.md) to understand business logic and route handlers.
