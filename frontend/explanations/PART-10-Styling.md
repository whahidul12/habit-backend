# PART 10: Styling System

This part explains the complete styling architecture, including CSS, Tailwind CSS, theming, animations, and design patterns.

## 🎨 Styling Overview

The app uses a **hybrid styling approach**:

- **Tailwind CSS v4** - Utility-first CSS framework
- **Custom CSS** - Theme tokens, components, animations
- **CSS Variables** - Dynamic theming (light/dark mode)
- **Glass Morphism** - Modern frosted glass effects

---

## 📁 File Structure

```
src/
└── index.css          # Main stylesheet (all styles)
```

**Single file approach**: All styles are in `index.css` for simplicity.

---

## 🌈 Color System

### Brand Colors (Amber/Gold)

```css
--color-brand-50: #fffbeb; /* Lightest - backgrounds */
--color-brand-100: #fef3c7;
--color-brand-200: #fde68a;
--color-brand-300: #fcd34d;
--color-brand-400: #fbbf24; /* Primary buttons */
--color-brand-500: #f59e0b; /* Main brand color */
--color-brand-600: #d97706; /* Hover states */
--color-brand-700: #b45309;
--color-brand-800: #92400e;
--color-brand-900: #78350f; /* Darkest */
```

**Usage**: Primary buttons, accents, highlights, focus states

### Ink Colors (Neutral Grays)

```css
--color-ink-50: #f7f7f8; /* Lightest */
--color-ink-100: #eeeef1;
--color-ink-200: #d7d7de;
--color-ink-300: #b5b5c0;
--color-ink-400: #8b8b99;
--color-ink-500: #6b6b78; /* Medium gray */
--color-ink-600: #4e4e59;
--color-ink-700: #3a3a44;
--color-ink-800: #242430;
--color-ink-900: #13131b; /* Darkest - text */
```

**Usage**: Text, borders, backgrounds, neutral elements

---

## 🌓 Theme System (Light/Dark Mode)

### How It Works

1. **HTML class toggle**: `<html class="dark">` or `<html>` (light)
2. **CSS variables change**: Different values for light vs dark
3. **Components use variables**: Always reference `var(--text)`, never hardcoded colors

### Light Theme (Default)

```css
:root {
  color-scheme: light;

  /* Background */
  --bg-base: #faf8f2; /* Warm off-white */

  /* Aurora gradients (decorative) */
  --bg-aurora-1: rgba(251, 191, 36, 0.28); /* Amber */
  --bg-aurora-2: rgba(236, 72, 153, 0.14); /* Pink */
  --bg-aurora-3: rgba(14, 165, 233, 0.14); /* Sky blue */

  /* Text colors */
  --text: #13131b; /* Almost black */
  --text-soft: #4e4e59; /* Softer for labels */
  --text-muted: #6b6b78; /* Muted for secondary */
  --text-faint: #8b8b99; /* Faintest for placeholders */

  /* Surface (glass cards) */
  --surface: rgba(255, 255, 255, 0.72); /* Semi-transparent white */
  --surface-strong: rgba(255, 255, 255, 0.88); /* More opaque */
  --surface-hover: rgba(255, 255, 255, 0.85); /* Hover state */
  --surface-border: rgba(255, 255, 255, 0.55); /* Border */
  --surface-ring: rgba(255, 255, 255, 0.9); /* Focus ring */

  /* Input fields */
  --input-bg: rgba(255, 255, 255, 0.75);
  --input-border: rgba(15, 15, 27, 0.08);
  --input-border-focus: #fbbf24; /* Brand color */
  --input-ring-focus: rgba(245, 158, 11, 0.22); /* Glow */

  /* Other elements */
  --chip-bg: rgba(15, 15, 27, 0.05);
  --chip-text: #3a3a44;
  --divider: rgba(15, 15, 27, 0.08);
  --shadow: 0 8px 32px rgba(15, 15, 27, 0.06);

  /* Heatmap colors */
  --heat-0: rgba(15, 15, 27, 0.06); /* No activity */
  --heat-1: rgba(253, 224, 71, 0.55); /* Low */
  --heat-2: rgba(251, 191, 36, 0.75); /* Medium */
  --heat-3: rgba(217, 119, 6, 0.85); /* High */
  --heat-4: #b45309; /* Highest */

  /* Chart elements */
  --chart-grid: rgba(15, 15, 27, 0.08);
  --chart-tick: #6b6b78;
  --chart-tooltip-bg: rgba(255, 255, 255, 0.95);
  --chart-tooltip-border: rgba(15, 15, 27, 0.08);
}
```

### Dark Theme

```css
html.dark {
  color-scheme: dark;

  /* Background */
  --bg-base: #0c0a06; /* Almost black */

  /* Aurora gradients (different colors) */
  --bg-aurora-1: rgba(251, 191, 36, 0.28); /* Amber */
  --bg-aurora-2: rgba(217, 70, 239, 0.18); /* Purple */
  --bg-aurora-3: rgba(16, 185, 129, 0.14); /* Emerald */

  /* Text colors (inverted) */
  --text: #ebebf5; /* Almost white */
  --text-soft: #b8b8c8; /* Softer */
  --text-muted: #8a8aa0; /* Muted */
  --text-faint: #64647a; /* Faintest */

  /* Surface (glass cards) */
  --surface: rgba(255, 255, 255, 0.04); /* Very subtle white */
  --surface-strong: rgba(255, 255, 255, 0.06);
  --surface-hover: rgba(255, 255, 255, 0.07);
  --surface-border: rgba(255, 255, 255, 0.08);
  --surface-ring: rgba(255, 255, 255, 0.12);

  /* Input fields */
  --input-bg: rgba(255, 255, 255, 0.04);
  --input-border: rgba(255, 255, 255, 0.08);
  --input-border-focus: #fcd34d; /* Lighter brand */
  --input-ring-focus: rgba(252, 211, 77, 0.22);

  /* Other elements */
  --chip-bg: rgba(255, 255, 255, 0.06);
  --chip-text: #c4c4d4;
  --divider: rgba(255, 255, 255, 0.08);
  --shadow: 0 8px 40px rgba(0, 0, 0, 0.4); /* Darker shadow */

  /* Heatmap colors (adjusted for dark) */
  --heat-0: rgba(255, 255, 255, 0.04);
  --heat-1: rgba(251, 191, 36, 0.28);
  --heat-2: rgba(251, 191, 36, 0.55);
  --heat-3: rgba(252, 211, 77, 0.8);
  --heat-4: #fde68a;

  /* Chart elements */
  --chart-grid: rgba(255, 255, 255, 0.08);
  --chart-tick: #8a8aa0;
  --chart-tooltip-bg: rgba(20, 20, 36, 0.95);
  --chart-tooltip-border: rgba(255, 255, 255, 0.1);
}
```

### Theme Toggle Implementation

**In ThemeContext.jsx**:

```jsx
const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);

  if (newTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem("theme", newTheme);
};
```

---

## 🪟 Glass Morphism

**Glass morphism** creates frosted glass effects with blur and transparency.

### `.glass` Class

```css
.glass {
  background: var(--surface); /* Semi-transparent */
  border: 1px solid var(--surface-border); /* Subtle border */
  backdrop-filter: blur(20px) saturate(140%); /* Blur + saturation */
  -webkit-backdrop-filter: blur(20px) saturate(140%); /* Safari */
}
```

**What it does**:

- `background`: Semi-transparent white (light) or black (dark)
- `border`: Subtle border for definition
- `backdrop-filter`: Blurs content behind + increases saturation
- `-webkit-backdrop-filter`: Same for Safari

### `.glass-strong` Class

```css
.glass-strong {
  background: var(--surface-strong); /* More opaque */
  border: 1px solid var(--surface-border);
  backdrop-filter: blur(24px) saturate(160%); /* Stronger blur */
  -webkit-backdrop-filter: blur(24px) saturate(160%);
}
```

**When to use**:

- `.glass`: Most cards, modals, sidebars
- `.glass-strong`: Important cards that need more contrast

### Usage Example

```jsx
<div className="glass rounded-xl p-4">
  <p>This has a frosted glass effect!</p>
</div>
```

---

## 🎴 Component Classes

Pre-built component styles for consistency.

### `.card` - Card Container

```css
.card {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border-radius: 1rem; /* 16px rounded */
  box-shadow: var(--shadow); /* Soft shadow */
}
```

**Usage**:

```jsx
<div className="card p-6">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>
```

### `.btn-primary` - Primary Button

```css
.btn-primary {
  /* Tailwind utilities */
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 
         text-sm font-medium text-white transition active:scale-[0.98] 
         disabled:opacity-50 disabled:cursor-not-allowed;

  /* Custom styles */
  background: linear-gradient(135deg, #fbbf24, #d97706); /* Gradient */
  box-shadow: 0 6px 18px rgba(217, 119, 6, 0.35); /* Glow */
}

.btn-primary:hover:not(:disabled) {
  filter: brightness(1.06); /* Brighten */
  box-shadow: 0 8px 22px rgba(217, 119, 6, 0.45); /* Stronger glow */
}
```

**Features**:

- Gradient background (amber to orange)
- Glow shadow
- Scale down on click (active state)
- Disabled state (50% opacity)
- Hover brightens

**Usage**:

```jsx
<button className="btn-primary">
  <Plus size={16} />
  Add Habit
</button>
```

### `.btn-secondary` - Secondary Button

```css
.btn-secondary {
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 
         text-sm font-medium transition active:scale-[0.98];

  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--surface-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.btn-secondary:hover {
  background: var(--surface-hover);
}
```

**Features**:

- Glass effect
- Adapts to theme
- Subtle hover

**Usage**:

```jsx
<button className="btn-secondary">Cancel</button>
```

### `.btn-ghost` - Ghost Button

```css
.btn-ghost {
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 
         text-sm font-medium transition;

  color: var(--text-soft);
}

.btn-ghost:hover {
  background: var(--surface);
  color: var(--text);
}
```

**Features**:

- No background by default
- Background appears on hover
- Minimal style

**Usage**:

```jsx
<button className="btn-ghost">
  <Settings size={16} />
</button>
```
