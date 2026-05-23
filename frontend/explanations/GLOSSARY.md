# Glossary - Important Terms Explained

This glossary explains all the important terms, concepts, and technologies used in this project. Read this to understand the vocabulary used throughout the documentation.

## 🔤 A-Z Terms

### A

**API (Application Programming Interface)**

- A way for the frontend to communicate with the backend
- Think of it like a waiter taking your order to the kitchen
- Example: `api.get("/habits")` asks the backend for all habits

**Axios**

- A library for making HTTP requests (API calls)
- Easier to use than the built-in `fetch` function
- Handles authentication tokens automatically in this app

**Authentication (Auth)**

- The process of verifying who a user is
- Involves logging in with email and password
- Creates a "token" that proves you're logged in

### B

**Backend**

- The server-side code that stores data and handles business logic
- Not part of this frontend folder
- Located in the `/backend` folder of the project

**Browser**

- The program that runs your web app (Chrome, Firefox, Safari, etc.)
- Interprets HTML, CSS, and JavaScript
- Where users interact with your app

**Build**

- The process of converting your source code into optimized files
- Run with `npm run build`
- Creates a `dist` folder with production-ready files

### C

**Component**

- A reusable piece of UI in React
- Like a LEGO block that you can use multiple times
- Example: `<Button />`, `<HabitCard />`

**Context**

- A way to share data across many components without passing props
- Like a global variable that any component can access
- Examples: `AuthContext`, `ThemeContext`

**CSS (Cascading Style Sheets)**

- The language used to style HTML elements
- Controls colors, sizes, layouts, animations, etc.
- This app uses Tailwind CSS and custom CSS

### D

**Dependency**

- An external library or package your project needs
- Listed in `package.json`
- Installed with `npm install`

**DevTools**

- Browser tools for debugging (press F12)
- Shows console logs, network requests, component state, etc.
- Essential for development

**DOM (Document Object Model)**

- The tree structure of HTML elements in the browser
- React manipulates the DOM to update the UI
- You usually don't interact with it directly in React

### E

**Environment Variable**

- Configuration values that can change between environments
- Stored in `.env` file
- Example: `VITE_API_URL=http://localhost:5000/api`

**ESLint**

- A tool that checks your code for errors and style issues
- Configured in `eslint.config.js`
- Helps maintain code quality

### F

**Frontend**

- The client-side code that runs in the browser
- What users see and interact with
- This entire folder is the frontend

**Function Component**

- A JavaScript function that returns JSX (React UI)
- The modern way to write React components
- Example:

```jsx
function MyComponent() {
  return <div>Hello</div>;
}
```

### H

**Hook**

- Special React functions that start with "use"
- Let you use React features in function components
- Examples: `useState`, `useEffect`, `useContext`

**Hot Reload**

- Automatically updates the browser when you save a file
- No need to manually refresh
- Provided by Vite during development

**HTTP Request**

- A message sent from frontend to backend
- Types: GET (fetch data), POST (create), PUT (update), DELETE (remove)
- Made using Axios in this app

### J

**JSX (JavaScript XML)**

- A syntax that looks like HTML but is actually JavaScript
- Used to describe UI in React
- Example: `<div className="card">Hello</div>`

**JSON (JavaScript Object Notation)**

- A format for storing and transmitting data
- Looks like JavaScript objects
- Example: `{ "name": "Exercise", "category": "Fitness" }`

### L

**LocalStorage**

- Browser storage that persists even after closing the tab
- Used to store authentication token and theme preference
- Access with `localStorage.getItem()` and `localStorage.setItem()`

**Loading State**

- A boolean that tracks whether data is being fetched
- Shows a spinner while `loading === true`
- Set to `false` when data arrives

### M

**Modal**

- A popup window that appears over the main content
- Used for forms, confirmations, etc.
- Example: habit creation form

**Module**

- A file that exports code for use in other files
- Imported with `import` statement
- Example: `import api from "./api/axios.js"`

### N

**Navigation**

- Moving between different pages in the app
- Handled by React Router
- Example: clicking "Dashboard" in the sidebar

**npm (Node Package Manager)**

- Tool for installing and managing dependencies
- Commands: `npm install`, `npm run dev`, `npm run build`

### P

**Package**

- A reusable library published to npm
- Examples: `react`, `axios`, `recharts`
- Listed in `package.json`

**Props (Properties)**

- Data passed from parent component to child component
- Like function arguments
- Example: `<Button text="Click me" color="blue" />`

**Protected Route**

- A page that requires authentication to access
- Redirects to login if user is not logged in
- Example: Dashboard, Habits, Stats pages

### R

**React**

- A JavaScript library for building user interfaces
- Created by Facebook (Meta)
- Uses components and JSX

**React Router**

- A library for handling navigation in React apps
- Maps URLs to components
- Example: `/dashboard` → `<Dashboard />` component

**Recharts**

- A charting library for React
- Used for bar charts, pie charts, etc.
- Built on D3.js

**Render**

- The process of converting React components into DOM elements
- Happens automatically when state or props change
- React is very efficient at this

**Route**

- A mapping between a URL path and a component
- Defined in `App.jsx`
- Example: `<Route path="/dashboard" element={<Dashboard />} />`

### S

**State**

- Data that can change over time
- When state changes, React re-renders the component
- Created with `useState` hook

**SPA (Single Page Application)**

- An app that loads once and updates content dynamically
- No full page reloads when navigating
- This app is an SPA

**Styling**

- The process of making the UI look good
- Uses CSS, Tailwind classes, and custom styles
- Defined in `index.css` and component files

### T

**Tailwind CSS**

- A utility-first CSS framework
- Uses classes like `flex`, `p-4`, `text-lg`
- Configured in `tailwind.config.js` (if exists)

**Token**

- A string that proves you're authenticated
- Sent with every API request in the `Authorization` header
- Stored in localStorage

**TypeScript**

- A typed version of JavaScript
- Not used in this project (uses plain JavaScript)
- Would have `.ts` or `.tsx` file extensions

### U

**UI (User Interface)**

- What the user sees and interacts with
- Built with React components
- Styled with CSS and Tailwind

**useEffect**

- A React hook for side effects
- Runs code when component mounts or when dependencies change
- Example: fetching data when page loads

**useState**

- A React hook for managing state
- Returns current value and a function to update it
- Example: `const [count, setCount] = useState(0)`

**useContext**

- A React hook for accessing context
- Avoids prop drilling
- Example: `const { user } = useAuth()`

### V

**Vite**

- A modern build tool for web apps
- Much faster than older tools like Webpack
- Configured in `vite.config.js`

**Virtual DOM**

- React's internal representation of the UI
- React compares it to the real DOM and only updates what changed
- Makes React very fast

### W

**Webpack**

- An older build tool (not used in this project)
- Vite is the modern alternative

### Concepts Explained

## 🎯 React Concepts

### Component Lifecycle

```
1. Component is created (mounted)
   ↓
2. Component renders (shows on screen)
   ↓
3. State or props change
   ↓
4. Component re-renders (updates)
   ↓
5. Component is removed (unmounted)
```

### Props vs State

| Props                              | State                                            |
| ---------------------------------- | ------------------------------------------------ |
| Passed from parent                 | Managed within component                         |
| Read-only                          | Can be updated                                   |
| Like function arguments            | Like local variables                             |
| Example: `<Button text="Click" />` | Example: `const [count, setCount] = useState(0)` |

### Controlled vs Uncontrolled Components

**Controlled** (recommended):

```jsx
const [value, setValue] = useState("");
<input value={value} onChange={(e) => setValue(e.target.value)} />;
```

**Uncontrolled**:

```jsx
<input defaultValue="hello" />
```

## 🔐 Authentication Concepts

### JWT (JSON Web Token)

- A secure way to transmit user information
- Contains user ID and expiration time
- Signed by the server so it can't be tampered with

### Token Flow

```
1. User logs in with email/password
   ↓
2. Backend verifies credentials
   ↓
3. Backend creates JWT token
   ↓
4. Frontend stores token in localStorage
   ↓
5. Frontend sends token with every API request
   ↓
6. Backend verifies token and processes request
```

## 🎨 Styling Concepts

### CSS Variables

- Custom properties that can be reused
- Example: `var(--text)` uses the `--text` variable
- Defined in `:root` in `index.css`

### Responsive Design

- Making the UI work on all screen sizes
- Uses media queries: `md:`, `lg:`, etc.
- Mobile-first approach (design for mobile, then add desktop features)

### Glass Morphism

- A design style with frosted glass effect
- Uses `backdrop-filter: blur()`
- Creates depth and modern look

## 📊 Data Flow Concepts

### Unidirectional Data Flow

- Data flows from parent to child (via props)
- Child components can't directly modify parent state
- Child calls parent function to request changes

### Lifting State Up

- Moving state to a common parent component
- Allows siblings to share data
- Example: Dashboard manages habit state, passes to child components

## 🔄 Async Concepts

### Promises

- Represents a value that will be available in the future
- Used for API calls
- Example: `api.get("/habits")` returns a Promise

### Async/Await

- Modern syntax for working with Promises
- Makes async code look synchronous
- Example:

```jsx
const response = await api.get("/habits");
const habits = response.data;
```

### Loading States

- Track whether async operation is in progress
- Show spinner while loading
- Hide spinner when done

## 🎯 Best Practices

### DRY (Don't Repeat Yourself)

- If you write the same code twice, make it a component or function
- Reuse components instead of copying code

### Single Responsibility

- Each component should do one thing well
- Makes code easier to understand and maintain

### Prop Drilling

- Passing props through many levels of components
- Solution: Use Context API

## 📚 Further Reading

For more details on specific topics, see:

- **React Hooks**: [PART-3-Context-State.md](./PART-3-Context-State.md)
- **API Calls**: [PART-4-API-Utils.md](./PART-4-API-Utils.md)
- **Styling**: [PART-10-Styling.md](./PART-10-Styling.md)
- **Components**: PART-6 through PART-9

Next: Read **[DIAGRAMS.md](./DIAGRAMS.md)** to see visual representations of these concepts!
