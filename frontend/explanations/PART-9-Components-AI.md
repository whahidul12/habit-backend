# PART 9: AI-Powered Components

This part explains components that integrate AI features for personalized insights and suggestions.

## 🤖 AI Component Overview

These components provide AI-powered features:

- **AIChat** - Chat interface for asking questions about habits
- **AIWeeklyReport** - AI-generated weekly summary
- **MorningMotivation** - Daily motivational message
- **StreakRecoveryCard** - AI recovery plan for broken streaks (covered in PART-7)
- **HabitSuggestionModal** - AI habit suggestions (covered in PART-7)
- **Markdown** - Renders markdown text from AI responses

---

## 💬 AIChat - Conversational AI Interface

**File**: `src/components/AIChat.jsx`

**Purpose**: Allows users to ask questions about their habit data and get AI-powered answers.

### Key Features

- Chat interface with message history
- User input field
- AI responses in markdown
- Loading state while AI thinks
- Scrolls to bottom on new messages
- Persistent chat history (localStorage)

### State Management

```jsx
const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem("ai-chat-history");
  return saved ? JSON.parse(saved) : [];
});
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
```

### Message Structure

```javascript
{
  role: "user" | "assistant",
  content: "Message text",
  timestamp: Date
}
```

### Send Message

```jsx
const send = async () => {
  if (!input.trim() || loading) return;

  const userMessage = {
    role: "user",
    content: input.trim(),
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const res = await api.post("/ai/chat", {
      message: input.trim(),
      history: messages.slice(-10), // Last 10 messages for context
    });

    const aiMessage = {
      role: "assistant",
      content: res.data.response,
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const updated = [...prev, aiMessage];
      localStorage.setItem("ai-chat-history", JSON.stringify(updated));
      return updated;
    });
  } catch (error) {
    const errorMessage = {
      role: "assistant",
      content: "Sorry, I couldn't process that. Please try again.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  } finally {
    setLoading(false);
  }
};
```

### Auto-Scroll to Bottom

```jsx
const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
```

### Display Messages

```jsx
<div className="card p-5">
  <div className="text-sm font-medium mb-3">Ask AI about your habits</div>

  {/* Messages */}
  <div className="space-y-3 max-h-96 overflow-y-auto mb-3">
    {messages.length === 0 && (
      <div className="text-sm text-muted text-center py-8">
        Ask me anything about your habits, streaks, or progress!
      </div>
    )}

    {messages.map((msg, index) => (
      <div
        key={index}
        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[80%] rounded-xl p-3 ${
            msg.role === "user" ? "bg-brand-500 text-white" : "glass"
          }`}
        >
          {msg.role === "assistant" ? (
            <Markdown>{msg.content}</Markdown>
          ) : (
            <div className="text-sm">{msg.content}</div>
          )}
        </div>
      </div>
    ))}

    {loading && (
      <div className="flex justify-start">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <RefreshCw size={14} className="animate-spin" />
            Thinking...
          </div>
        </div>
      </div>
    )}

    <div ref={messagesEndRef} />
  </div>

  {/* Input */}
  <form
    onSubmit={(e) => {
      e.preventDefault();
      send();
    }}
  >
    <div className="flex gap-2">
      <input
        className="input flex-1"
        placeholder="Ask about your habits..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="btn-primary"
        disabled={loading || !input.trim()}
      >
        <Send size={16} />
      </button>
    </div>
  </form>
</div>
```

### Example Questions

- "What's my most consistent habit?"
- "Why did my streak break?"
- "Which day of the week am I most productive?"
- "How can I improve my completion rate?"

---

## 📊 AIWeeklyReport - Weekly Summary

**File**: `src/components/AIWeeklyReport.jsx`

**Purpose**: Displays AI-generated weekly summary of habit performance.

### Key Features

- Auto-generates on first view each week
- Caches report in localStorage
- Regenerate button
- Loading state
- Markdown rendering
- Timestamp of generation

### State Management

```jsx
const [report, setReport] = useState("");
const [generatedAt, setGeneratedAt] = useState(null);
const [loading, setLoading] = useState(false);
```

### Cache Key

```jsx
const CACHE_KEY = (weekStart) => `weekly-report-${weekStart}`;
```

- Unique key per week
- Prevents regenerating same week's report

### Load Cached Report

```jsx
useEffect(() => {
  const weekStart = weekKeys()[0].key; // e.g., "2024-01-15"
  const cached = localStorage.getItem(CACHE_KEY(weekStart));

  if (cached) {
    try {
      const { content, generatedAt } = JSON.parse(cached);
      setReport(content);
      setGeneratedAt(new Date(generatedAt));
    } catch {
      // Invalid cache, generate new
      generateReport();
    }
  } else {
    // No cache, generate new
    generateReport();
  }
}, []);
```

### Generate Report

```jsx
const generateReport = async () => {
  setLoading(true);
  try {
    const res = await api.post("/ai/weekly-report");
    const content = res.data.content;
    const now = new Date();

    setReport(content);
    setGeneratedAt(now);

    // Cache for this week
    const weekStart = weekKeys()[0].key;
    localStorage.setItem(
      CACHE_KEY(weekStart),
      JSON.stringify({ content, generatedAt: now }),
    );
  } catch (error) {
    setReport("Failed to generate report. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

### Display

```jsx
<div className="card p-6 relative overflow-hidden">
  {/* Background gradient */}
  <div
    className="absolute inset-0 pointer-events-none opacity-50"
    style={{
      background:
        "radial-gradient(circle at 0% 0%, rgba(251,191,36,0.22), transparent 55%), radial-gradient(circle at 100% 100%, rgba(236,72,153,0.12), transparent 55%)",
    }}
  />

  <div className="relative">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
        <Sparkles size={18} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">AI Weekly Report</div>
        <div className="text-xs text-muted">
          {generatedAt
            ? `Generated ${generatedAt.toLocaleString()}`
            : "Personalized review of your last 7 days"}
        </div>
      </div>
      <button
        onClick={generateReport}
        className="btn-secondary"
        disabled={loading}
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        Regenerate
      </button>
    </div>

    {loading && !report && (
      <div className="flex items-center gap-2 text-sm text-soft py-6">
        <RefreshCw size={14} className="animate-spin" />
        Analyzing your week...
      </div>
    )}

    {report && (
      <Markdown className="glass rounded-xl p-4 text-sm">{report}</Markdown>
    )}
  </div>
</div>
```

### Example Report Content

```markdown
**Big week for hydration** — 7/7 on _Drink 2L water_! 🎉

Your morning runs slipped to 3/5 on weekdays. **Consistency pattern**: you're strongest Mon–Wed.

**Suggestion**: Try prepping shoes by the door tonight to protect tomorrow's momentum.

Proud of you! 💪
```

---

## 🌅 MorningMotivation - Daily Message

**File**: `src/components/MorningMotivation.jsx`

**Purpose**: Shows a short AI-generated motivational message each morning.

### Key Features

- Only shows once per day
- Only shows if user enabled it in settings
- Dismissible
- Cached in localStorage
- Short and encouraging

### State Management

```jsx
const { user } = useAuth();
const [message, setMessage] = useState(null);
const [visible, setVisible] = useState(false);
const [loading, setLoading] = useState(false);
```

### Check if Should Show

```jsx
useEffect(() => {
  if (!user?.morningMotivation) return; // User disabled it

  const today = todayKey();
  const lastShown = localStorage.getItem("morning-motivation-date");

  if (lastShown === today) return; // Already shown today

  const cached = localStorage.getItem(`morning-motivation-${today}`);
  if (cached) {
    setMessage(cached);
    setVisible(true);
  } else {
    generateMessage();
  }
}, [user]);
```

### Generate Message

```jsx
const generateMessage = async () => {
  setLoading(true);
  try {
    const res = await api.post("/ai/morning-motivation");
    const msg = res.data.message;

    setMessage(msg);
    setVisible(true);

    const today = todayKey();
    localStorage.setItem(`morning-motivation-${today}`, msg);
    localStorage.setItem("morning-motivation-date", today);
  } catch {
    // Fail silently
  } finally {
    setLoading(false);
  }
};
```

### Display

```jsx
{
  visible && message && (
    <div className="card p-4 relative overflow-hidden animate-slide-up">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ background: "radial-gradient(...)" }}
      />

      <div className="relative flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shrink-0">
          <Sun size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-brand-600 dark:text-brand-300 mb-1">
            Good morning! ☀️
          </div>
          <div className="text-sm">{message}</div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="btn-ghost p-1 shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
```

### Example Messages

- "You've got a 5-day streak on Exercise. Keep the momentum going! 💪"
- "Yesterday you completed 4/5 habits. Today's a fresh start! 🌟"
- "Your best day this week was Monday. Channel that energy today! ⚡"

---

## 📝 Markdown - Render Markdown Text

**File**: `src/components/Markdown.jsx`

**Purpose**: Renders markdown text from AI responses with proper styling.

### Implementation

```jsx
import ReactMarkdown from "react-markdown";

export default function Markdown({ children, className = "" }) {
  return (
    <ReactMarkdown
      className={`prose prose-sm max-w-none ${className}`}
      components={{
        // Custom component renderers
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold text-brand-600 dark:text-brand-300">
            {children}
          </strong>
        ),
        em: ({ children }) => <em className="italic text-soft">{children}</em>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="text-sm">{children}</li>,
        code: ({ children }) => (
          <code className="px-1.5 py-0.5 rounded bg-[var(--chip-bg)] text-xs font-mono">
            {children}
          </code>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
```

### Supported Markdown

- **Bold**: `**text**` → **text**
- _Italic_: `*text*` → _text_
- Lists: `- item` or `1. item`
- Inline code: `` `code` `` → `code`
- Links: `[text](url)`

### Usage

```jsx
<Markdown>{aiResponse}</Markdown>
```

---

## 🔄 AI Request Flow

```
1. User triggers AI feature
   ↓
2. Frontend sends POST request to backend
   ↓
3. Backend calls OpenAI API with:
   - User's habit data
   - Prompt template
   - Context
   ↓
4. OpenAI generates response
   ↓
5. Backend returns response
   ↓
6. Frontend displays in markdown
   ↓
7. Cache in localStorage (if applicable)
```

---

## 💾 Caching Strategy

### Why Cache?

- Reduces API calls (saves money)
- Faster load times
- Works offline (for cached content)

### What's Cached?

- **Weekly reports**: Per week
- **Morning motivation**: Per day
- **Chat history**: All messages

### Cache Keys

```javascript
// Weekly report
`weekly-report-${weekStartDate}` // e.g., "weekly-report-2024-01-15"
// Morning motivation
`morning-motivation-${today}` // e.g., "morning-motivation-2024-01-15"
`morning-motivation-date` // Last shown date
// Chat history
`ai-chat-history`; // Array of messages
```

---

## 📚 Summary

| Component             | Purpose         | Caching      |
| --------------------- | --------------- | ------------ |
| **AIChat**            | Ask questions   | Chat history |
| **AIWeeklyReport**    | Weekly summary  | Per week     |
| **MorningMotivation** | Daily message   | Per day      |
| **Markdown**          | Render markdown | N/A          |

---

## 🎯 Key Takeaways

1. **AI components** provide personalized insights
2. **Caching** reduces API calls and improves performance
3. **Markdown** renders AI responses with formatting
4. **Loading states** provide feedback during AI processing
5. **Error handling** gracefully handles API failures
6. **localStorage** persists AI content across sessions

---

## 📖 Next Steps

Next: Read **[PART-10-Styling.md](./PART-10-Styling.md)** to understand the styling system!
