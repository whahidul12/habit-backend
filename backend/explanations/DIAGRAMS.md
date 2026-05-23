# 📊 VISUAL ARCHITECTURE DIAGRAMS

This document contains visual diagrams to help you understand the backend architecture.

> **Note:** These diagrams use Mermaid syntax. They render automatically in GitHub, VS Code (with Markdown Preview), and many other Markdown viewers.

---

## 🏗️ 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>localhost:5173]
    end

    subgraph "Server Layer - Express"
        B[CORS Middleware]
        C[Body Parser]
        D[Auth Middleware]
        E[Routes]
        F[Controllers]
        G[Models]
    end

    subgraph "External Services"
        H[(MongoDB<br/>Cloud Database)]
        I[Google Gemini AI]
    end

    A -->|HTTP + JWT| B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G -->|Mongoose| H
    F -->|API Calls| I

    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style H fill:#47a248,stroke:#333,stroke-width:2px
    style I fill:#4285f4,stroke:#333,stroke-width:2px
```

---

## 🔄 2. Request Flow Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant M as Middleware
    participant R as Routes
    participant Ctrl as Controller
    participant Model as Model
    participant DB as MongoDB

    C->>S: POST /api/habits<br/>{name, category}
    S->>M: CORS Check
    M->>M: Body Parser
    M->>M: Auth (verify JWT)
    M->>R: Forward to Route
    R->>Ctrl: Call createHabit()
    Ctrl->>Ctrl: Validate Input
    Ctrl->>Model: Habit.create()
    Model->>Model: Validate Schema
    Model->>DB: Insert Document
    DB-->>Model: Return Document
    Model-->>Ctrl: Return Habit
    Ctrl-->>C: 201 Created<br/>{habit}
```

---

## 📁 3. Folder Structure Tree

```mermaid
graph TD
    A[backend/] --> B[config/]
    A --> C[controllers/]
    A --> D[middleware/]
    A --> E[models/]
    A --> F[routes/]
    A --> G[scripts/]
    A --> H[utils/]
    A --> I[server.js]
    A --> J[.env]
    A --> K[package.json]

    B --> B1[db.js]

    C --> C1[authController.js]
    C --> C2[habitController.js]
    C --> C3[logController.js]
    C --> C4[aiController.js]

    D --> D1[auth.js]
    D --> D2[errorHandler.js]

    E --> E1[Users.js]
    E --> E2[Habits.js]
    E --> E3[HabitsLog.js]
    E --> E4[AIinsight.js]

    F --> F1[auth.js]
    F --> F2[habits.js]
    F --> F3[logs.js]
    F --> F4[ai.js]

    G --> G1[seed.js]

    H --> H1[aiService.js]
    H --> H2[dateHelper.js]

    style I fill:#ff6b6b,stroke:#333,stroke-width:3px
    style B1 fill:#4ecdc4,stroke:#333,stroke-width:2px
    style E1 fill:#95e1d3,stroke:#333,stroke-width:2px
    style E2 fill:#95e1d3,stroke:#333,stroke-width:2px
    style E3 fill:#95e1d3,stroke:#333,stroke-width:2px
    style E4 fill:#95e1d3,stroke:#333,stroke-width:2px
```

---

## 🗄️ 4. Database Schema Relationships

```mermaid
erDiagram
    USER ||--o{ HABIT : owns
    USER ||--o{ HABITLOG : tracks
    USER ||--o{ AIINSIGHT : receives
    HABIT ||--o{ HABITLOG : has

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string avatar
        boolean morningMotivation
        date createdAt
        date updatedAt
    }

    HABIT {
        ObjectId _id PK
        ObjectId userId FK
        string name
        string description
        string category
        string frequency
        number targetDays
        string color
        string icon
        boolean isArchived
        number order
        date createdAt
        date updatedAt
    }

    HABITLOG {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId habitId FK
        string completedDate
        string notes
        date createdAt
        date updatedAt
    }

    AIINSIGHT {
        ObjectId _id PK
        ObjectId userId FK
        string type
        string content
        object meta
        date generatedAt
        date createdAt
        date updatedAt
    }
```

---

## 🔐 5. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Server
    participant DB as Database

    rect rgb(200, 220, 250)
        Note over U,DB: Registration Flow
        U->>F: Fill registration form
        F->>S: POST /api/auth/register<br/>{name, email, password}
        S->>S: Hash password (bcrypt)
        S->>DB: Create user
        DB-->>S: User created
        S->>S: Generate JWT token
        S-->>F: {token, user}
        F->>F: Store token in localStorage
    end

    rect rgb(250, 220, 200)
        Note over U,DB: Login Flow
        U->>F: Fill login form
        F->>S: POST /api/auth/login<br/>{email, password}
        S->>DB: Find user by email
        DB-->>S: User found
        S->>S: Compare password (bcrypt)
        S->>S: Generate JWT token
        S-->>F: {token, user}
        F->>F: Store token in localStorage
    end

    rect rgb(220, 250, 220)
        Note over U,DB: Protected Request Flow
        U->>F: Request protected resource
        F->>S: GET /api/habits<br/>Authorization: Bearer {token}
        S->>S: Extract & verify token
        S->>DB: Find user by ID from token
        DB-->>S: User found
        S->>S: Attach user to req.user
        S->>DB: Query habits for user
        DB-->>S: Habits data
        S-->>F: {habits}
        F-->>U: Display habits
    end
```

---

## 🎯 6. Middleware Chain

```mermaid
graph LR
    A[Incoming Request] --> B[CORS Middleware]
    B --> C[Body Parser]
    C --> D{Protected Route?}
    D -->|Yes| E[Auth Middleware]
    D -->|No| F[Route Handler]
    E --> F
    F --> G{Error?}
    G -->|Yes| H[Error Handler]
    G -->|No| I[Send Response]
    H --> I
    I --> J[Client Receives Response]

    style A fill:#e1f5ff,stroke:#333,stroke-width:2px
    style E fill:#fff3cd,stroke:#333,stroke-width:2px
    style H fill:#f8d7da,stroke:#333,stroke-width:2px
    style J fill:#d4edda,stroke:#333,stroke-width:2px
```

---

## 📊 7. Controller → Model → Database Flow

```mermaid
graph TD
    A[Client Request] --> B[Route]
    B --> C[Controller Function]

    C --> D{Validate Input}
    D -->|Invalid| E[Return 400 Error]
    D -->|Valid| F[Call Model Method]

    F --> G[Model Schema Validation]
    G -->|Invalid| H[Throw Validation Error]
    G -->|Valid| I[Apply Defaults]

    I --> J[Execute Database Query]
    J --> K[(MongoDB)]
    K --> L[Return Result]

    L --> M[Controller Processes Result]
    M --> N[Send Response to Client]

    H --> O[Controller Catches Error]
    O --> P[Return 500 Error]

    style E fill:#f8d7da,stroke:#333,stroke-width:2px
    style P fill:#f8d7da,stroke:#333,stroke-width:2px
    style N fill:#d4edda,stroke:#333,stroke-width:2px
```

---

## 🔄 8. Habit Creation Flow (Detailed)

```mermaid
flowchart TD
    A[User clicks 'Create Habit'] --> B[Frontend Form]
    B --> C{Form Valid?}
    C -->|No| B
    C -->|Yes| D[POST /api/habits<br/>with JWT token]

    D --> E[CORS Middleware]
    E --> F[Body Parser]
    F --> G[Auth Middleware]

    G --> H{Token Valid?}
    H -->|No| I[401 Unauthorized]
    H -->|Yes| J[Fetch User from DB]

    J --> K{User Exists?}
    K -->|No| I
    K -->|Yes| L[Attach user to req.user]

    L --> M[Route: POST /]
    M --> N[habitController.createHabit]

    N --> O{Name Provided?}
    O -->|No| P[400 Bad Request]
    O -->|Yes| Q[Count existing habits]

    Q --> R[Habit.create with order]
    R --> S[Mongoose validates schema]

    S --> T{Schema Valid?}
    T -->|No| U[500 Validation Error]
    T -->|Yes| V[Insert into MongoDB]

    V --> W[Return created habit]
    W --> X[201 Created Response]
    X --> Y[Frontend updates UI]

    style I fill:#f8d7da,stroke:#333,stroke-width:2px
    style P fill:#f8d7da,stroke:#333,stroke-width:2px
    style U fill:#f8d7da,stroke:#333,stroke-width:2px
    style X fill:#d4edda,stroke:#333,stroke-width:2px
    style Y fill:#d4edda,stroke:#333,stroke-width:2px
```

---

## 🧩 9. API Endpoints Map

```mermaid
mindmap
  root((API<br/>localhost:8000))
    /api/auth
      POST /register
      POST /login
      GET /me
    /api/habits
      GET /
      POST /
      PUT /:id
      DELETE /:id
      PUT /:id/archive
      PUT /reorder
    /api/logs
      POST /
      DELETE /
      GET /today
      GET /range
      GET /heatmap
      GET /stats
      GET /stats/:habitId
    /api/ai
      POST /weekly
      POST /chat
      POST /suggest
```

---

## 🔒 10. Security Layers

```mermaid
graph TB
    A[Client Request] --> B{Layer 1: CORS}
    B -->|Allowed Origin| C{Layer 2: JWT Auth}
    B -->|Blocked| Z1[403 Forbidden]

    C -->|Valid Token| D{Layer 3: User Exists}
    C -->|Invalid Token| Z2[401 Unauthorized]

    D -->|User Found| E{Layer 4: Input Validation}
    D -->|User Not Found| Z3[401 Unauthorized]

    E -->|Valid Input| F{Layer 5: Ownership Check}
    E -->|Invalid Input| Z4[400 Bad Request]

    F -->|User Owns Resource| G[Process Request]
    F -->|User Doesn't Own| Z5[403 Forbidden]

    G --> H[Success Response]

    style B fill:#fff3cd,stroke:#333,stroke-width:2px
    style C fill:#fff3cd,stroke:#333,stroke-width:2px
    style D fill:#fff3cd,stroke:#333,stroke-width:2px
    style E fill:#fff3cd,stroke:#333,stroke-width:2px
    style F fill:#fff3cd,stroke:#333,stroke-width:2px
    style H fill:#d4edda,stroke:#333,stroke-width:2px
    style Z1 fill:#f8d7da,stroke:#333,stroke-width:2px
    style Z2 fill:#f8d7da,stroke:#333,stroke-width:2px
    style Z3 fill:#f8d7da,stroke:#333,stroke-width:2px
    style Z4 fill:#f8d7da,stroke:#333,stroke-width:2px
    style Z5 fill:#f8d7da,stroke:#333,stroke-width:2px
```

---

## 📈 11. Streak Calculation Logic

```mermaid
flowchart TD
    A[Get Habit Logs] --> B[Sort by Date DESC]
    B --> C[Get Today's Date]
    C --> D{Today Logged?}

    D -->|No| E{Yesterday Logged?}
    D -->|Yes| F[Start from Today]

    E -->|No| G[Current Streak = 0]
    E -->|Yes| F

    F --> H[Count Consecutive Days]
    H --> I{Next Day Logged?}

    I -->|Yes| J[Increment Counter]
    J --> H
    I -->|No| K[Current Streak Found]

    K --> L[Scan All Dates]
    L --> M[Find Longest Consecutive]
    M --> N[Return Current & Longest]

    style G fill:#f8d7da,stroke:#333,stroke-width:2px
    style N fill:#d4edda,stroke:#333,stroke-width:2px
```

---

## 🤖 12. AI Integration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Server
    participant DB as MongoDB
    participant AI as Google Gemini

    U->>F: Request AI Insight
    F->>S: POST /api/ai/weekly
    S->>DB: Fetch user's habits
    DB-->>S: Habits data
    S->>DB: Fetch last 7 days logs
    DB-->>S: Logs data
    S->>S: Build context prompt
    S->>AI: Generate insight
    AI-->>S: AI response
    S->>DB: Save AIinsight
    DB-->>S: Saved
    S-->>F: {content}
    F-->>U: Display insight
```

---

## 🎨 13. MVC Pattern in Your App

```mermaid
graph LR
    subgraph "View Layer"
        A[React Frontend]
    end

    subgraph "Controller Layer"
        B[authController]
        C[habitController]
        D[logController]
        E[aiController]
    end

    subgraph "Model Layer"
        F[User Model]
        G[Habit Model]
        H[HabitLog Model]
        I[AIinsight Model]
    end

    subgraph "Database"
        J[(MongoDB)]
    end

    A -->|HTTP Requests| B
    A -->|HTTP Requests| C
    A -->|HTTP Requests| D
    A -->|HTTP Requests| E

    B --> F
    C --> G
    D --> H
    E --> I

    F --> J
    G --> J
    H --> J
    I --> J

    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style J fill:#47a248,stroke:#333,stroke-width:2px
```

---

## 🔄 14. Complete User Journey

```mermaid
journey
    title User Journey - From Registration to Habit Tracking
    section Registration
      Visit app: 5: User
      Fill form: 4: User
      Submit: 5: User
      Account created: 5: Server
      Token received: 5: User
    section Login
      Enter credentials: 4: User
      Authenticate: 5: Server
      Token stored: 5: User
    section Create Habit
      Click new habit: 5: User
      Fill habit form: 4: User
      Submit habit: 5: User
      Habit saved: 5: Server
      UI updated: 5: User
    section Track Habit
      View today's habits: 5: User
      Mark complete: 5: User
      Log saved: 5: Server
      Streak updated: 5: Server
      Celebration: 5: User
    section View Stats
      Open stats page: 5: User
      Load data: 5: Server
      View insights: 5: User
      Get AI report: 5: Server, AI
      Read report: 5: User
```

---

## 📦 15. Dependency Graph

```mermaid
graph TD
    A[server.js] --> B[config/db.js]
    A --> C[routes/*]
    A --> D[middleware/errorHandler.js]

    C --> E[middleware/auth.js]
    C --> F[controllers/*]

    E --> G[models/Users.js]

    F --> G
    F --> H[models/Habits.js]
    F --> I[models/HabitsLog.js]
    F --> J[models/AIinsight.js]
    F --> K[utils/dateHelper.js]
    F --> L[utils/aiService.js]

    G --> M[mongoose]
    H --> M
    I --> M
    J --> M

    E --> N[jsonwebtoken]
    G --> O[bcryptjs]
    K --> P[date-fns]
    L --> Q[@google/genai]

    style A fill:#ff6b6b,stroke:#333,stroke-width:3px
    style M fill:#880000,stroke:#333,stroke-width:2px,color:#fff
    style N fill:#880000,stroke:#333,stroke-width:2px,color:#fff
    style O fill:#880000,stroke:#333,stroke-width:2px,color:#fff
    style P fill:#880000,stroke:#333,stroke-width:2px,color:#fff
    style Q fill:#880000,stroke:#333,stroke-width:2px,color:#fff
```

---

## 🎯 How to Use These Diagrams

1. **GitHub/GitLab**: These diagrams render automatically when you view this file
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy the mermaid code to https://mermaid.live/
4. **Documentation**: Reference these diagrams when explaining architecture

---

## 📚 Diagram Legend

| Symbol      | Meaning              |
| ----------- | -------------------- |
| Rectangle   | Process/Component    |
| Diamond     | Decision Point       |
| Cylinder    | Database             |
| Circle      | Start/End Point      |
| Arrow       | Data Flow            |
| Dotted Line | Optional/Conditional |

---

**Related Documents:**

- [PART-7-Architecture-Overview.md](./PART-7-Architecture-Overview.md) - Detailed architecture explanation
- [README.md](./README.md) - Documentation index
