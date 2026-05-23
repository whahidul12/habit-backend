# PART 7: Habit Components

This part explains components related to habit management, display, and interaction.

## 🎯 Habit Component Overview

These components handle everything related to habits:

- **TodayHabitCard** - Individual habit card for today's view
- **HabitForm** - Form for creating/editing habits
- **HabitStatsCard** - Displays statistics for a single habit
- **HabitSuggestionModal** - AI-powered habit suggestions
- **StreakRecoveryCard** - Helps recover broken streaks

---

## ✅ TodayHabitCard - Daily Habit Display

**File**: `src/components/TodayHabitCard.jsx`

**Purpose**: Displays a single habit with checkbox, streak info, and action buttons.

### Key Features

- Habit icon and name
- Checkbox to mark complete/incomplete
- Current streak display
- Edit, archive, and delete buttons (dropdown menu)
- Visual feedback when completed

### Props

```jsx
{
  (habit, // Habit object
    completed, // Boolean - is it completed today?
    streak, // Number - current streak
    onToggle, // Function - called when checkbox clicked
    onEdit, // Function - called when edit clicked
    onArchive, // Function - called when archive clicked
    onDelete); // Function - called when delete clicked
}
```

### Structure

```jsx
<div className="flex items-center gap-3 rounded-xl glass p-3">
  {/* Icon */}
  <span className="w-9 h-9 rounded-lg bg-brand-500/15 flex items-center justify-center">
    {habit.icon}
  </span>

  {/* Name */}
  <div className="flex-1 text-sm font-medium">{habit.name}</div>

  {/* Streak */}
  <div className="flex items-center gap-1 text-xs text-muted">
    <Flame size={12} className="text-orange-500" />
    {streak}
  </div>

  {/* Checkbox */}
  <div
    className={
      completed ? "bg-gradient-to-br from-brand-500 to-brand-700" : "border-2"
    }
  >
    {completed && <CheckCircle2 size={14} />}
  </div>
</div>
```

### Toggle Logic

```jsx
const handleToggle = () => {
  onToggle(habit);
  if (!completed) {
    celebrate(); // 🎉 Confetti animation
  }
};
```

---

## 📝 HabitForm - Create/Edit Habits

**File**: `src/components/HabitForm.jsx`

**Purpose**: Form for creating new habits or editing existing ones.

### Key Features

- Name input (required)
- Description textarea (optional)
- Category dropdown
- Frequency selector (daily/weekly)
- Target days input
- Icon picker
- Color picker
- Form validation
- Submit and cancel buttons

### Props

```jsx
{
  (initial, // Habit object (for editing) or null (for creating)
    submitting, // Boolean - is form submitting?
    onCancel, // Function - called when cancel clicked
    onSubmit); // Function - called with form data
}
```

### State Management

```jsx
const [form, setForm] = useState({
  name: initial?.name || "",
  description: initial?.description || "",
  category: initial?.category || "Health",
  frequency: initial?.frequency || "daily",
  targetDays: initial?.targetDays || 7,
  icon: initial?.icon || "💪",
  color: initial?.color || "#f59e0b",
});
```

### Form Submission

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!form.name.trim()) {
    setError("Name is required");
    return;
  }
  onSubmit(form);
};
```

### Icon Picker

```jsx
<div className="grid grid-cols-6 gap-2">
  {ICONS.map((icon) => (
    <button
      key={icon}
      type="button"
      onClick={() => setForm({ ...form, icon })}
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
        form.icon === icon
          ? "ring-2 ring-brand-500"
          : "hover:bg-[var(--surface-hover)]"
      }`}
    >
      {icon}
    </button>
  ))}
</div>
```

### Color Picker

```jsx
<div className="grid grid-cols-4 gap-2">
  {COLORS.map((color) => (
    <button
      key={color}
      type="button"
      onClick={() => setForm({ ...form, color })}
      className={`w-10 h-10 rounded-lg ${
        form.color === color ? "ring-2 ring-offset-2 ring-brand-500" : ""
      }`}
      style={{ background: color }}
    />
  ))}
</div>
```

---

## 📊 HabitStatsCard - Habit Statistics

**File**: `src/components/HabitStatsCard.jsx`

**Purpose**: Displays detailed statistics for a single habit.

### Key Features

- Habit icon, name, and category
- Current and longest streaks
- Completion counts (30 days, 90 days, all time)
- Completion rate
- Visual progress bar

### Props

```jsx
{
  stat; // Statistics object from backend
}
```

### Stat Object Structure

```javascript
{
  habitId: "123",
  name: "Exercise",
  icon: "💪",
  color: "#f59e0b",
  category: "Fitness",
  currentStreak: 5,
  longestStreak: 12,
  completions30d: 25,
  completions90d: 70,
  completionsAllTime: 150,
  completionRate: 83  // percentage
}
```

### Display

```jsx
<div className="card p-4 flex items-center gap-4">
  {/* Icon */}
  <div style={{ background: `${stat.color}26`, color: stat.color }}>
    {stat.icon}
  </div>

  {/* Info */}
  <div className="flex-1">
    <div className="font-medium">{stat.name}</div>
    <div className="text-xs text-muted">{stat.category}</div>
  </div>

  {/* Stats */}
  <div className="flex items-center gap-4">
    <div>
      <Flame size={14} />
      {stat.currentStreak}
    </div>
    <div>
      <Trophy size={14} />
      {stat.longestStreak}
    </div>
    <div className="text-xs text-muted">{stat.completions30d}/30 days</div>
  </div>
</div>
```

---

## 🤖 HabitSuggestionModal - AI Suggestions

**File**: `src/components/HabitSuggestionModal.jsx`

**Purpose**: Shows AI-generated habit suggestions based on user's existing habits.

### Key Features

- Generates 3 habit suggestions
- Shows name, description, category, and icon
- Accept or reject each suggestion
- Loading state while generating
- Error handling

### Props

```jsx
{
  (open, // Boolean - is modal open?
    onClose, // Function - called when modal closes
    onAccept); // Function - called with accepted suggestion
}
```

### State Management

```jsx
const [suggestions, setSuggestions] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Generate Suggestions

```jsx
const generate = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.post("/ai/suggest-habits");
    setSuggestions(res.data.suggestions);
  } catch (err) {
    setError("Failed to generate suggestions");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (open && suggestions.length === 0) {
    generate();
  }
}, [open]);
```

### Display Suggestions

```jsx
{
  suggestions.map((suggestion, index) => (
    <div key={index} className="card p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{suggestion.icon}</span>
        <div className="flex-1">
          <div className="font-medium">{suggestion.name}</div>
          <div className="text-sm text-muted">{suggestion.description}</div>
          <div className="chip mt-2">{suggestion.category}</div>
        </div>
      </div>
      <button
        className="btn-primary w-full mt-3"
        onClick={() => {
          onAccept(suggestion);
          onClose();
        }}
      >
        Add this habit
      </button>
    </div>
  ));
}
```

---

## 🔥 StreakRecoveryCard - Recover Broken Streaks

**File**: `src/components/StreakRecoveryCard.jsx`

**Purpose**: Helps users recover from broken streaks with AI-generated 3-day plan.

### Key Features

- Shows habit with broken streak
- Displays longest streak achieved
- AI-generated 3-day recovery plan
- Dismiss button
- Motivational messaging

### Props

```jsx
{
  (habit, // Habit object with broken streak
    onDismiss); // Function - called when dismissed
}
```

### State Management

```jsx
const [plan, setPlan] = useState(null);
const [loading, setLoading] = useState(true);
```

### Generate Recovery Plan

```jsx
useEffect(() => {
  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/streak-recovery", {
        habitId: habit._id,
      });
      setPlan(res.data.plan);
    } catch {
      setPlan("Keep going! You can rebuild this streak.");
    } finally {
      setLoading(false);
    }
  };
  generatePlan();
}, [habit._id]);
```

### Display

```jsx
<div className="card p-5 relative overflow-hidden">
  {/* Background gradient */}
  <div
    className="absolute inset-0 pointer-events-none opacity-50"
    style={{ background: "radial-gradient(...)" }}
  />

  <div className="relative">
    <div className="flex items-center gap-3 mb-3">
      <Flame size={18} className="text-orange-500" />
      <div className="font-semibold">Streak Recovery</div>
      <button onClick={onDismiss} className="ml-auto">
        <X size={16} />
      </button>
    </div>

    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">{habit.icon}</span>
      <div>
        <div className="font-medium">{habit.name}</div>
        <div className="text-xs text-muted">
          Your {longestStreak}-day streak ended. Let's rebuild it!
        </div>
      </div>
    </div>

    {loading ? (
      <div className="text-sm text-soft">Generating recovery plan...</div>
    ) : (
      <Markdown className="text-sm">{plan}</Markdown>
    )}
  </div>
</div>
```

---

## 🎨 Common Patterns

### 1. Habit Icon Display

```jsx
<div
  className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
  style={{ background: `${habit.color}26`, color: habit.color }}
>
  {habit.icon}
</div>
```

- Background: Color with 15% opacity (`26` in hex = ~15%)
- Text: Full color
- Creates nice contrast

### 2. Streak Display

```jsx
<div className="flex items-center gap-1">
  <Flame size={12} className={streak > 0 ? "text-orange-500" : "text-faint"} />
  <span>{streak}</span>
</div>
```

- Orange flame if streak > 0
- Gray flame if streak = 0

### 3. Dropdown Menu

```jsx
const [menuOpen, setMenuOpen] = useState(false);

<button onClick={() => setMenuOpen(!menuOpen)}>
  <MoreVertical size={16} />
</button>;

{
  menuOpen && (
    <div className="absolute right-0 top-full mt-1 glass rounded-xl shadow-lg">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onArchive}>Archive</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}
```

---

## 📚 Summary

| Component                | Purpose             | Key Features                    |
| ------------------------ | ------------------- | ------------------------------- |
| **TodayHabitCard**       | Daily habit display | Checkbox, streak, actions       |
| **HabitForm**            | Create/edit habits  | All habit fields, validation    |
| **HabitStatsCard**       | Habit statistics    | Streaks, completions, rates     |
| **HabitSuggestionModal** | AI suggestions      | Generate and accept suggestions |
| **StreakRecoveryCard**   | Recover streaks     | AI recovery plan                |

---

## 🎯 Key Takeaways

1. **TodayHabitCard** is the main habit interaction component
2. **HabitForm** handles all habit creation/editing
3. **HabitStatsCard** shows detailed statistics
4. **AI components** provide personalized suggestions and recovery plans
5. All components use consistent styling and patterns
6. Confetti animations celebrate completions

---

## 📖 Next Steps

Next: Read **[PART-8-Components-Charts.md](./PART-8-Components-Charts.md)** for chart and visualization components!
