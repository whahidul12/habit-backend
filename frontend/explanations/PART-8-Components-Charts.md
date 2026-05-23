# PART 8: Chart & Visualization Components

This part explains components that visualize habit data through charts, graphs, and visual indicators.

## 📊 Chart Component Overview

These components transform habit data into visual insights:

- **HeatmapChart** - 90-day completion heatmap
- **WeeklyGrid** - 7-day habit grid
- **WeeklyBarChart** - Bar chart for weekly data
- **MonthlyBarChart** - Bar chart for monthly data
- **CategoryPieChart** - Pie chart for category distribution
- **ProgressRing** - Circular progress indicator
- **SummaryCards** - Summary statistics cards

---

## 🔥 HeatmapChart - 90-Day Heatmap

**File**: `src/components/HeatmapChart.jsx`

**Purpose**: Displays a GitHub-style heatmap showing habit completions over the last 90 days.

### Key Features

- 90-day grid (13 weeks × 7 days)
- Color intensity based on completion count
- Tooltip showing date and count
- Responsive layout

### Props

```jsx
{
  data; // Array of { date: "2024-01-15", count: 3 }
}
```

### Color Intensity

```jsx
const getColor = (count) => {
  if (count === 0) return "var(--heat-0)"; // Light gray
  if (count === 1) return "var(--heat-1)"; // Light yellow
  if (count === 2) return "var(--heat-2)"; // Medium yellow
  if (count === 3) return "var(--heat-3)"; // Dark yellow
  return "var(--heat-4)"; // Darkest yellow
};
```

### Grid Structure

```jsx
<div className="grid grid-cols-13 gap-1">
  {last90Days().map((dateKey) => {
    const dayData = data.find((d) => d.date === dateKey);
    const count = dayData?.count || 0;

    return (
      <div
        key={dateKey}
        className="w-3 h-3 rounded-sm"
        style={{ background: getColor(count) }}
        title={`${dateKey}: ${count} habits`}
      />
    );
  })}
</div>
```

---

## 📅 WeeklyGrid - 7-Day Habit Grid

**File**: `src/components/WeeklyGrid.jsx`

**Purpose**: Shows all habits across 7 days of the week in a grid format.

### Key Features

- Rows = habits
- Columns = days of week
- Checkmarks for completed days
- Click to toggle completion
- Responsive layout

### Props

```jsx
{
  (habits, // Array of habit objects
    logsByHabit, // Object: { habitId: [dateKeys] }
    days); // Array of day objects (optional, defaults to current week)
}
```

### Structure

```jsx
<div className="card p-5">
  {/* Header row with day labels */}
  <div className="grid grid-cols-8 gap-2 mb-2">
    <div></div> {/* Empty cell for habit names */}
    {days.map((day) => (
      <div key={day.key} className="text-center text-xs font-medium">
        {day.label}
      </div>
    ))}
  </div>

  {/* Habit rows */}
  {habits.map((habit) => (
    <div key={habit._id} className="grid grid-cols-8 gap-2 mb-2">
      {/* Habit name */}
      <div className="flex items-center gap-2">
        <span>{habit.icon}</span>
        <span className="text-sm truncate">{habit.name}</span>
      </div>

      {/* Day cells */}
      {days.map((day) => {
        const completed = logsByHabit[habit._id]?.includes(day.key);
        return (
          <div
            key={day.key}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              completed ? "bg-brand-500 text-white" : "bg-[var(--surface)]"
            }`}
          >
            {completed && <Check size={14} />}
          </div>
        );
      })}
    </div>
  ))}
</div>
```

---

## 📊 WeeklyBarChart - Weekly Bar Chart

**File**: `src/components/WeeklyBarChart.jsx`

**Purpose**: Bar chart showing completions for each day of the week.

### Key Features

- Uses Recharts library
- Gradient fill
- Responsive
- Tooltip on hover
- Theme-aware colors

### Props

```jsx
{
  (data, // Array of { label: "Mon", count: 5 }
    title); // Chart title (optional)
}
```

### Implementation

```jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyBarChart({ data, title = "Last 7 days" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="card p-5">
      <div className="text-sm font-medium mb-3">{title}</div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <defs>
              <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(15,15,27,0.08)"}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: isDark ? "#8a8aa0" : "#6b6b78" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: isDark ? "#8a8aa0" : "#6b6b78" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: isDark
                  ? "rgba(20,20,36,0.95)"
                  : "rgba(255,255,255,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="count"
              fill="url(#bar-gradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### Key Recharts Concepts

**ResponsiveContainer**:

- Makes chart responsive to container size
- Always use this as wrapper

**CartesianGrid**:

- Background grid lines
- `strokeDasharray="3 3"` creates dashed lines

**XAxis / YAxis**:

- `dataKey`: Which field to use for axis
- `tick`: Styling for axis labels
- `axisLine={false}`: Hide axis line
- `allowDecimals={false}`: Only show whole numbers

**Bar**:

- `dataKey`: Which field to display
- `fill`: Color or gradient
- `radius`: Rounded corners [topLeft, topRight, bottomRight, bottomLeft]

---

## 📊 MonthlyBarChart - Monthly Bar Chart

**File**: `src/components/MonthlyBarChart.jsx`

**Purpose**: Bar chart showing completions over the last 30 days.

Similar to WeeklyBarChart but with more data points:

```jsx
<BarChart data={monthlyData}>{/* Same structure as WeeklyBarChart */}</BarChart>
```

---

## 🥧 CategoryPieChart - Category Distribution

**File**: `src/components/CategoryPieChart.jsx`

**Purpose**: Pie chart showing habit completions by category.

### Key Features

- Uses Recharts PieChart
- Color-coded categories
- Legend
- Tooltip
- Responsive

### Props

```jsx
{
  data; // Array of { name: "Fitness", value: 25 }
}
```

### Implementation

```jsx
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#f59e0b",
  "#fb923c",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#6366f1",
  "#0ea5e9",
  "#10b981",
];

export default function CategoryPieChart({ data }) {
  return (
    <div className="card p-5">
      <div className="text-sm font-medium mb-3">By category</div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### Key Pie Chart Concepts

**Pie**:

- `innerRadius`: Creates donut chart (0 = full pie)
- `outerRadius`: Size of pie
- `paddingAngle`: Gap between slices
- `stroke`: Border color
- `strokeWidth`: Border thickness

**Cell**:

- Individual slice styling
- Each slice gets a different color from COLORS array

---

## ⭕ ProgressRing - Circular Progress

**File**: `src/components/ProgressRing.jsx`

**Purpose**: Circular progress indicator (like iOS activity rings).

### Key Features

- SVG-based
- Animated
- Customizable size and stroke width
- Gradient fill

### Props

```jsx
{
  (value, // Number 0-100 (percentage)
    size, // Number (diameter in pixels)
    stroke); // Number (stroke width in pixels)
}
```

### Implementation

```jsx
export default function ProgressRing({ value, size = 120, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--divider)"
        strokeWidth={stroke}
      />

      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ring-gradient)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}
```

### How It Works

1. **Calculate circumference**: `2 * π * radius`
2. **Calculate offset**: How much of circle to "hide"
   - 0% = full offset (empty circle)
   - 100% = zero offset (full circle)
3. **strokeDasharray**: Total length of dash
4. **strokeDashoffset**: How much to offset the dash
5. **rotate(-90)**: Start from top instead of right

---

## 📊 SummaryCards - Statistics Cards

**File**: `src/components/SummaryCards.jsx`

**Purpose**: Displays key statistics in card format.

### Props

```jsx
{
  (totalHabits, // Number
    activeStreaks, // Number
    bestStreak, // Number
    weekRate); // Number (percentage)
}
```

### Implementation

```jsx
export default function SummaryCards({
  totalHabits,
  activeStreaks,
  bestStreak,
  weekRate,
}) {
  const cards = [
    { label: "Total habits", value: totalHabits, icon: Target },
    { label: "Active streaks", value: activeStreaks, icon: Flame },
    { label: "Best streak", value: `${bestStreak}d`, icon: Trophy },
    { label: "This week", value: `${weekRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="card p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <card.icon size={14} />
            {card.label}
          </div>
          <div className="text-2xl font-semibold mt-1">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Theme-Aware Charts

All charts adapt to light/dark theme:

```jsx
const { theme } = useTheme();
const isDark = theme === "dark";

const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,15,27,0.08)";
const tickColor = isDark ? "#8a8aa0" : "#6b6b78";
const tooltipBg = isDark ? "rgba(20,20,36,0.95)" : "rgba(255,255,255,0.95)";
```

---

## 📚 Summary

| Component            | Type      | Purpose                   |
| -------------------- | --------- | ------------------------- |
| **HeatmapChart**     | Grid      | 90-day completion heatmap |
| **WeeklyGrid**       | Grid      | 7-day habit × day grid    |
| **WeeklyBarChart**   | Bar Chart | Weekly completions        |
| **MonthlyBarChart**  | Bar Chart | Monthly completions       |
| **CategoryPieChart** | Pie Chart | Category distribution     |
| **ProgressRing**     | SVG       | Circular progress         |
| **SummaryCards**     | Cards     | Key statistics            |

---

## 🎯 Key Takeaways

1. **Recharts** is used for all charts (bar, pie)
2. **SVG** is used for custom visualizations (progress ring, heatmap)
3. All charts are **responsive** (ResponsiveContainer)
4. Charts are **theme-aware** (adapt to light/dark mode)
5. **Tooltips** provide additional context on hover
6. **Gradients** create visual appeal

---

## 📖 Next Steps

Next: Read **[PART-9-Components-AI.md](./PART-9-Components-AI.md)** for AI-powered components!
