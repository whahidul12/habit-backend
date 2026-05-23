# 📘 PART 2: CONFIG FOLDER EXPLAINED

This document explains the `/backend/config` folder, which contains configuration files for your application.

---

## 📁 Folder Structure

```
backend/
└── config/
    └── db.js          ← Database connection configuration
```

---

## 1️⃣ **db.js** - Database Connection 🗄️

**Location:** `/backend/config/db.js`

**What it is:** This file handles the connection to your MongoDB database. It's one of the most critical files in your backend.

### Complete Code Breakdown:

```javascript
import mongoose from "mongoose";
```

**What is Mongoose?**

- Mongoose is an **ODM** (Object Data Modeling) library for MongoDB
- It provides a schema-based solution to model your application data
- Think of it as a translator between your JavaScript code and MongoDB

**Why use Mongoose instead of raw MongoDB?**

- ✅ Provides data validation
- ✅ Easier to define data structures (schemas)
- ✅ Built-in type casting
- ✅ Query building helpers
- ✅ Middleware support

---

### The connectDB Function:

```javascript
export const connectDB = async () => {
```

**Breaking this down:**

- `export` - Makes this function available to other files
- `const connectDB` - Function name
- `async` - This function performs asynchronous operations (waits for database connection)
- `() =>` - Arrow function syntax

**Why async?**

- Connecting to a database takes time (network request)
- `async` allows us to use `await` to wait for the connection
- Without `async`, the code would continue before the connection is established

---

### Inside the Function:

```javascript
try {
```

**What is try-catch?**

- A way to handle errors gracefully
- Code in `try` block runs normally
- If an error occurs, `catch` block handles it
- Prevents your entire app from crashing

---

```javascript
const uri = process.env.MONGODB_URI;
```

**What's happening:**

- Reads the MongoDB connection string from environment variables
- `process.env` - Object containing all environment variables
- `MONGODB_URI` - The key we defined in `.env` file

**Example URI format:**

```
mongodb+srv://username:password@cluster.mongodb.net/databaseName?retryWrites=true&w=majority
```

**URI parts explained:**

- `mongodb+srv://` - Protocol (srv means it uses DNS seedlist)
- `username:password` - Database credentials
- `@cluster.mongodb.net` - Database server address
- `/databaseName` - Which database to use
- `?retryWrites=true&w=majority` - Connection options

---

```javascript
if (!uri) throw new Error("MongoDB uri is not defined");
```

**What this does:**

- Checks if `uri` exists
- `!uri` means "if uri is undefined, null, or empty string"
- `throw new Error(...)` - Creates and throws an error
- This stops execution and jumps to the `catch` block

**Why check this?**

- If the URI is missing, there's no point trying to connect
- Provides a clear error message instead of a cryptic connection error
- Fails fast (better to crash immediately than to fail later)

---

```javascript
const connection = await mongoose.connect(uri);
```

**What's happening:**

- `mongoose.connect(uri)` - Attempts to connect to MongoDB
- `await` - Waits for the connection to complete before continuing
- `connection` - Stores the connection object

**What happens behind the scenes:**

1. Mongoose opens a TCP connection to MongoDB
2. Authenticates with username/password
3. Selects the database
4. Returns a connection object

**Connection object contains:**

- `connection.connection.host` - Database server address
- `connection.connection.name` - Database name
- `connection.connection.readyState` - Connection status (0=disconnected, 1=connected)

---

```javascript
console.log(`MongoDB connected: ${connection.connection.host}`);
```

**What this does:**

- Logs a success message to the console
- `${connection.connection.host}` - Shows which server you connected to
- Template literal (backticks) allows embedding variables

**Example output:**

```
MongoDB connected: cluster0-shard-00-00.mongodb.net
```

**Why log this?**

- Confirms the connection succeeded
- Shows which database server you're connected to
- Useful for debugging (especially if you have multiple databases)

---

### Error Handling:

```javascript
} catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
}
```

**What happens if connection fails:**

1. **`catch (err)`** - Catches any error that occurred in the `try` block
   - `err` is the error object
   - Contains `err.message` (human-readable error)
   - Contains `err.stack` (detailed error trace)

2. **`console.error(...)`** - Logs the error to console
   - `console.error` is like `console.log` but for errors (shows in red in most terminals)
   - `${err.message}` - Shows the error message

3. **`process.exit(1)`** - Exits the entire Node.js process
   - `process.exit()` - Terminates the program
   - `1` - Exit code (0 = success, 1 = error)
   - This stops your server from starting

**Why exit the process?**

- If the database is down, your app can't function
- Better to crash immediately than to start a broken server
- Deployment tools (like Docker, Kubernetes) will restart the app automatically
- Prevents cascading errors (routes trying to access a non-existent database)

---

## 🔍 Common Connection Errors & Solutions

### Error 1: "MongoDB uri is not defined"

**Cause:** `.env` file missing or `MONGODB_URI` not set

**Fix:**

1. Check if `.env` file exists in `/backend` folder
2. Verify it contains: `MONGODB_URI=mongodb+srv://...`
3. Make sure you're running with `--env-file=.env` flag

---

### Error 2: "Authentication failed"

**Cause:** Wrong username or password in connection string

**Fix:**

1. Check your MongoDB Atlas dashboard
2. Verify username and password
3. Make sure the user has read/write permissions
4. Check if password contains special characters (they need to be URL-encoded)

**Example:**

```
# If password is "p@ssw0rd!", encode it as:
mongodb+srv://user:p%40ssw0rd%21@cluster.mongodb.net/db
```

---

### Error 3: "Connection timeout"

**Cause:**

- Firewall blocking connection
- Wrong IP address in MongoDB Atlas whitelist
- Network issues

**Fix:**

1. Go to MongoDB Atlas → Network Access
2. Add your IP address (or use `0.0.0.0/0` for development - allows all IPs)
3. Check your firewall settings
4. Try a different network

---

### Error 4: "Server selection timeout"

**Cause:**

- MongoDB cluster is down
- Wrong cluster address
- DNS issues

**Fix:**

1. Check MongoDB Atlas dashboard - is the cluster running?
2. Verify the connection string is correct
3. Try pinging the cluster address
4. Check if you're using the correct connection string format

---

## 🎯 How This File is Used

### In server.js:

```javascript
import { connectDB } from "./config/db.js";

// ... other code ...

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running...`));
});
```

**Flow:**

1. Import `connectDB` function
2. Call `connectDB()` - Returns a Promise
3. `.then(() => ...)` - Runs after successful connection
4. Start the Express server only after database is connected

**Why this order matters:**

- If database connection fails, server won't start
- Prevents routes from trying to access a non-existent database
- Provides clear error messages

---

## 🔧 Advanced: Connection Options

You can pass options to `mongoose.connect()` for more control:

```javascript
const connection = await mongoose.connect(uri, {
  useNewUrlParser: true, // Use new URL parser
  useUnifiedTopology: true, // Use new connection management engine
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds
});
```

**Common options:**

- `serverSelectionTimeoutMS` - How long to wait for server selection
- `socketTimeoutMS` - How long to wait for socket operations
- `maxPoolSize` - Maximum number of connections in the pool (default: 100)
- `minPoolSize` - Minimum number of connections to maintain

**Note:** Most of these are optional. Mongoose has good defaults.

---

## 🔍 Monitoring Connection Status

You can listen to connection events:

```javascript
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});
```

**Useful for:**

- Logging connection status
- Reconnecting after disconnection
- Monitoring in production

---

## 📊 Connection Lifecycle

```
1. App starts
   ↓
2. Import connectDB
   ↓
3. Call connectDB()
   ↓
4. Read MONGODB_URI from .env
   ↓
5. Validate URI exists
   ↓
6. mongoose.connect(uri)
   ↓
7. Wait for connection...
   ↓
8a. SUCCESS → Log message → Start server
   ↓
8b. FAILURE → Log error → Exit process (code 1)
```

---

## 🎯 Summary

| Concept               | Explanation                                      |
| --------------------- | ------------------------------------------------ |
| **Purpose**           | Connect to MongoDB database                      |
| **Library**           | Mongoose (ODM for MongoDB)                       |
| **Connection String** | Read from `MONGODB_URI` environment variable     |
| **Error Handling**    | Try-catch block, exits process on failure        |
| **Async**             | Uses `async/await` for asynchronous connection   |
| **Validation**        | Checks if URI exists before connecting           |
| **Logging**           | Logs success message with host, or error message |

---

## 🔗 Related Files

- **Used by:** `server.js` (main entry point)
- **Requires:** `.env` file with `MONGODB_URI`
- **Depends on:** `mongoose` package

---

**Next:** Read [PART-3-Models-Folder.md](./PART-3-Models-Folder.md) to understand database schemas and data structures.
