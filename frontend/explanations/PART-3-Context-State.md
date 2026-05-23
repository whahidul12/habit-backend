# PART 3: Context & State Management

This part explains how global state is managed in the application using React Context API. We have two contexts: **AuthContext** (user authentication) and **ThemeContext** (light/dark mode).

## 🧠 What is Context?

**Context** is React's way of sharing data across many components without passing props down manually at every level.

### The Problem Context Solves

**Without Context** (Prop Drilling):

```jsx
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserProfile user={user} /> {/* Finally used here! */}
    </Sidebar>
  </Layout>
</App>
```

**With Context**:

```jsx
<AuthProvider>
  {" "}
  {/* Provides user to all children */}
  <App>
    <Layout>
      <Sidebar>
        <UserProfile /> {/* Gets user from context directly */}
      </Sidebar>
    </Layout>
  </App>
</AuthProvider>
```

---

## 🔐 AuthContext - User Authentication

**Location**: `frontend/src/context/AuthContext.jsx`

**Purpose**: Manages user authentication state and provides login/logout functions to all components.

### Complete File

```jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### Line-by-Line Explanation

#### Creating the Context

```jsx
import { createContext, useContext, useEffect, useState } from "react";
```

- **createContext**: Creates a new context
- **useContext**: Hook to access context values
- **useEffect**: Hook for side effects (API calls, etc.)
- **useState**: Hook for managing state

```jsx
import api from "../api/axios.js";
```

- Imports configured axios instance for API calls

```jsx
const AuthContext = createContext(null);
```

- **createContext(null)**: Creates the context with default value `null`
- This context will hold user authentication data
- `null` means "no user logged in" by default

```jsx
export const useAuth = () => useContext(AuthContext);
```

- **Custom hook** for accessing auth context
- Makes it easier to use: `const { user } = useAuth()`
- Instead of: `const { user } = useContext(AuthContext)`

#### The Provider Component

```jsx
export const AuthProvider = ({ children }) => {
```

- **AuthProvider**: Component that provides auth state to children
- **children**: All components wrapped by this provider

#### State Management

```jsx
const [user, setUser] = useState(() => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
});
```

- **user**: Current logged-in user (or `null`)
- **Lazy initialization**: Function runs only once on mount
- Checks localStorage for saved user data
- If found, parse JSON and use it
- If not found, start with `null`

**Why check localStorage?**

- Persists login across page refreshes
- User stays logged in even after closing browser

```jsx
const [loading, setLoading] = useState(true);
```

- **loading**: Tracks if we're checking authentication
- Starts as `true` (checking...)
- Set to `false` when done

#### Authentication Check on Mount

```jsx
  useEffect(() => {
```

- Runs once when component mounts
- Checks if user is still authenticated

```jsx
const token = localStorage.getItem("token");
if (!token) {
  setLoading(false);
  return;
}
```

- Get token from localStorage
- If no token exists, user is not logged in
- Set loading to false and exit

```jsx
api.get("/auth/me").then((res) => {
  setUser(res.data.user);
  localStorage.setItem("user", JSON.stringify(res.data.user));
});
```

- **If token exists**: Verify it with backend
- Call `/auth/me` endpoint
- If valid, update user state
- Save user data to localStorage

```jsx
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
```

- **If token is invalid**: Clear everything
- Remove token and user from localStorage
- Set user to null (logged out)

```jsx
      .finally(() => setLoading(false));
  }, []);
```

- **finally**: Runs whether success or error
- Set loading to false (done checking)
- **[]**: Empty dependency array = run once on mount

#### Login Function

```jsx
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
```

- **async function**: Can use `await`
- Sends POST request to `/auth/login`
- Sends email and password in request body

```jsx
localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
```

- Save token to localStorage
- Save user data to localStorage (as JSON string)

```jsx
    setUser(res.data.user);
    return res.data.user;
  };
```

- Update user state
- Return user data (so caller can use it)

#### Register Function

```jsx
const register = async (name, email, password) => {
  const res = await api.post("/auth/register", { name, email, password });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  setUser(res.data.user);
  return res.data.user;
};
```

- Similar to login, but for registration
- Sends name, email, and password
- Saves token and user data
- Updates state

#### Logout Function

```jsx
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};
```

- Remove token from localStorage
- Remove user from localStorage
- Set user state to null
- User is now logged out

#### Update User Function

```jsx
const updateUser = (u) => {
  setUser(u);
  localStorage.setItem("user", JSON.stringify(u));
};
```

- Updates user data (e.g., after profile edit)
- Updates state
- Saves to localStorage

#### Providing the Context

```jsx
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

- **AuthContext.Provider**: Makes values available to children
- **value**: Object with all auth data and functions
- **children**: All wrapped components can access these values

---

## 🎨 ThemeContext - Light/Dark Mode

**Location**: `frontend/src/context/ThemeContext.jsx`

**Purpose**: Manages theme state (light or dark mode) and provides toggle function.

### Complete File

```jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

const getInitial = () => {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches)
    return "dark";
  return "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Line-by-Line Explanation

#### Creating the Context

```jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);
```

- Same pattern as AuthContext
- Creates context and custom hook

#### Getting Initial Theme

```jsx
const getInitial = () => {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
```

- Check if user has saved preference in localStorage
- If yes, use that

```jsx
if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
```

- **window.matchMedia**: Checks system preference
- If user's OS is in dark mode, use dark theme
- **?.**: Optional chaining (safe if matchMedia doesn't exist)

```jsx
  return "light";
};
```

- Default to light theme if no preference found

#### The Provider Component

```jsx
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitial);
```

- **theme**: Current theme ("light" or "dark")
- **getInitial**: Function that determines initial theme
- Runs once on mount

#### Applying Theme

```jsx
  useEffect(() => {
    const root = document.documentElement;
```

- **document.documentElement**: The `<html>` element
- We'll add/remove the "dark" class on it

```jsx
root.classList.toggle("dark", theme === "dark");
```

- **classList.toggle**: Adds or removes a class
- If `theme === "dark"`, add "dark" class
- If `theme === "light"`, remove "dark" class

**Why?**

- CSS in `index.css` has `html.dark { ... }` rules
- Adding "dark" class activates dark mode styles

```jsx
    localStorage.setItem("theme", theme);
  }, [theme]);
```

- Save theme to localStorage
- Persists across page refreshes
- **[theme]**: Run this effect when theme changes

#### Toggle Function

```jsx
const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
```

- **toggle**: Switches between light and dark
- Uses functional update: `setTheme((currentTheme) => newTheme)`
- If current is "dark", switch to "light"
- If current is "light", switch to "dark"

#### Providing the Context

```jsx
  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

- Provides theme, toggle function, and setTheme
- All children can access these values

---

## 🔄 How to Use These Contexts

### Using AuthContext

```jsx
import { useAuth } from "../context/AuthContext.jsx";

function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <button onClick={() => login("email", "pass")}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using ThemeContext

```jsx
import { useTheme } from "../context/ThemeContext.jsx";

function MyComponent() {
  const { theme, toggle } = useTheme();

  return (
    <button onClick={toggle}>
      Current theme: {theme}
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
```

---

## 🎯 Authentication Flow

Let's trace a complete login flow:

```
1. User enters email/password on Login page
   ↓
2. Login page calls login(email, password)
   ↓
3. AuthContext sends POST /auth/login to backend
   ↓
4. Backend validates credentials
   ↓
5. Backend returns { token, user }
   ↓
6. AuthContext saves token and user to localStorage
   ↓
7. AuthContext updates user state
   ↓
8. All components re-render with new user
   ↓
9. ProtectedRoute sees user is logged in
   ↓
10. User is redirected to /dashboard
```

---

## 🎨 Theme Flow

Let's trace theme toggling:

```
1. User clicks theme toggle button
   ↓
2. Button calls toggle()
   ↓
3. ThemeContext updates theme state
   ↓
4. useEffect runs (theme changed)
   ↓
5. "dark" class added/removed from <html>
   ↓
6. CSS rules for .dark activate/deactivate
   ↓
7. Theme saved to localStorage
   ↓
8. All components re-render with new theme
   ↓
9. User sees theme change
```

---

## 💾 LocalStorage Persistence

Both contexts use localStorage to persist data:

### AuthContext

```javascript
// Save
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));

// Load
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// Clear
localStorage.removeItem("token");
localStorage.removeItem("user");
```

### ThemeContext

```javascript
// Save
localStorage.setItem("theme", theme);

// Load
const theme = localStorage.getItem("theme");
```

**Why localStorage?**

- Data persists across page refreshes
- Data persists across browser sessions
- User stays logged in
- Theme preference is remembered

---

## 🧩 Context Provider Hierarchy

Remember from `main.jsx`:

```jsx
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

**Order matters!**

- ThemeProvider wraps AuthProvider
- Both wrap App
- All components inside App can access both contexts

---

## 🎯 Key Concepts

### 1. Context API

- **Purpose**: Share data across components without prop drilling
- **createContext**: Creates a context
- **Provider**: Provides values to children
- **useContext**: Accesses context values

### 2. Custom Hooks

```jsx
export const useAuth = () => useContext(AuthContext);
```

- Cleaner API for accessing context
- Encapsulates useContext call
- Can add validation/logic

### 3. Lazy Initialization

```jsx
const [user, setUser] = useState(() => {
  // This function runs only once
  return getInitialValue();
});
```

- Function runs only on mount
- Useful for expensive operations
- Like reading from localStorage

### 4. Effect Dependencies

```jsx
useEffect(() => {
  // This runs when theme changes
}, [theme]);
```

- **[theme]**: Run when theme changes
- **[]**: Run once on mount
- **No array**: Run on every render (usually bad!)

---

## 📚 Summary

| Context          | Purpose             | Provides                                           |
| ---------------- | ------------------- | -------------------------------------------------- |
| **AuthContext**  | User authentication | user, loading, login, register, logout, updateUser |
| **ThemeContext** | Light/dark mode     | theme, toggle, setTheme                            |

### Key Features

**AuthContext**:

- ✅ Persists login across refreshes
- ✅ Validates token on mount
- ✅ Provides login/logout functions
- ✅ Accessible from any component

**ThemeContext**:

- ✅ Persists theme preference
- ✅ Respects system preference
- ✅ Applies theme via CSS class
- ✅ Accessible from any component

---

## 🎯 Key Takeaways

1. **Context** solves prop drilling
2. **AuthContext** manages user authentication
3. **ThemeContext** manages light/dark mode
4. Both use **localStorage** for persistence
5. Custom hooks (**useAuth**, **useTheme**) make access easy
6. **useEffect** handles side effects (API calls, DOM updates)

---

## 📖 Next Steps

Now that you understand global state management, let's look at how the app communicates with the backend!

Next: Read **[PART-4-API-Utils.md](./PART-4-API-Utils.md)** to understand API calls and utility functions!
