# HIT Tracker — Design Language

> **Codename: "Press"**
> An editorial magazine aesthetic meets Swiss design precision.
> Think: a fitness broadsheet — bold, structured, intentional.

---

## 1. Philosophy

HIT Tracker's visual identity draws from editorial print design: rule lines instead of cards, typographic hierarchy instead of color-coding, generous whitespace instead of crowded chrome. Every screen should feel like a well-composed magazine spread — authoritative, calm, and focused.

**Core principles:**

- **Typography-first** — Hierarchy is established through size, weight, and case — not color or decoration.
- **Structured rhythm** — Horizontal rule lines, column grids, and consistent vertical spacing create visual cadence.
- **Restrained color** — A single accent color (Editorial Blue) does all the heavy lifting. Everything else is monochrome.
- **Paper-like warmth** — Light mode uses a warm newsprint tone, not sterile white. Dark mode uses deep warm grays, not pure black.
- **Purposeful motion** — Animations are subtle reveals (fade-in-up), never bouncy or playful. Content enters like a page being laid out.

---

## 2. Typography

### Font Stack

| Role        | Family                          | Weight(s)        | Fallback        |
| ----------- | ------------------------------- | ---------------- | --------------- |
| **Display** | **Bebas Neue**                  | 400 (Regular)    | `sans-serif`    |
| **Body**    | **Barlow**                      | 300, 400, 500, 600 | `sans-serif` |

**Google Fonts import:**

```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet">
```

### Type Scale

All sizes in `px` for precision. Line heights and tracking are critical to the editorial feel.

| Token                | Font        | Size   | Weight   | Line Height | Letter Spacing | Case      | Usage                           |
| -------------------- | ----------- | ------ | -------- | ----------- | -------------- | --------- | ------------------------------- |
| `display-xl`         | Bebas Neue  | 76px   | 400      | 0.92        | 0.04em         | Natural   | Page title / masthead           |
| `display-lg`         | Bebas Neue  | 48px   | 400      | 0.95        | 0.03em         | Natural   | Section hero numbers            |
| `display-md`         | Bebas Neue  | 28px   | 400      | 1.0         | 0.02em         | Natural   | Stat values, large data         |
| `display-sm`         | Bebas Neue  | 22px   | 400      | 1.1         | 0.03em         | Natural   | List item titles, button labels |
| `label-section`      | Barlow      | 11px   | 600      | 1.2         | 0.25em         | UPPERCASE | Section headers                 |
| `label-category`     | Barlow      | 9px    | 600      | 1.2         | 0.25em         | UPPERCASE | Category / dateline labels      |
| `label-nav`          | Barlow      | 10px   | 600      | 1.2         | 0.1em          | UPPERCASE | Bottom navigation labels        |
| `body-base`          | Barlow      | 14px   | 400      | 1.6         | 0.01em         | Natural   | Body text, descriptions         |
| `body-sm`            | Barlow      | 13px   | 300      | 1.6         | 0.01em         | Natural   | Subtitles, secondary copy       |
| `body-xs`            | Barlow      | 11px   | 300/400  | 1.4         | 0              | Natural   | Tertiary info, metadata         |
| `caption`            | Barlow      | 10px   | 500      | 1.2         | 0.05em         | UPPERCASE | Stat labels, footnotes          |
| `timer-display`      | Bebas Neue  | 72px   | 400      | 1.0         | 0.02em         | Natural   | Active timer readout            |
| `timer-secondary`    | Bebas Neue  | 36px   | 400      | 1.0         | 0.02em         | Natural   | Countdown numbers               |
| `input-value`        | Barlow      | 16px   | 400      | 1.4         | 0              | Natural   | Form inputs                     |
| `input-label`        | Barlow      | 12px   | 500      | 1.2         | 0.05em         | UPPERCASE | Form field labels               |

### Typography Rules

1. **Bebas Neue is always `font-weight: 400`** — it only has one weight. Hierarchy comes from size alone.
2. **Uppercase labels always get wide tracking** (`0.1em` minimum) — this is the editorial signature.
3. **Body text uses Barlow Light (300) or Regular (400)** — never bold for body copy.
4. **Semibold (600) is reserved for labels and navigation only.**
5. **Italic is used sparingly** — only for pull quotes and emphasis within body copy.
6. **Tabular numerals** — All timer and numeric data displays should use `font-variant-numeric: tabular-nums` via Tailwind's `tabular-nums` class to prevent layout jitter.

---

## 3. Color System

### Design Tokens

#### Light Mode (Default)

| Token                   | Hex         | Opacity Variants        | Usage                                   |
| ----------------------- | ----------- | ----------------------- | --------------------------------------- |
| `--bg-primary`          | `#F7F5F0`   | —                       | Page background (warm newsprint)        |
| `--bg-surface`          | `#FFFFFF`   | —                       | Elevated surfaces (modals, sheets)      |
| `--bg-nav`              | `#F7F5F0`   | 90% (with backdrop-blur)| Bottom nav background                   |
| `--text-primary`        | `#1A1A1A`   | —                       | Headings, display text                  |
| `--text-secondary`      | `#1A1A1A`   | 45%                     | Subtitles, descriptions                 |
| `--text-tertiary`       | `#1A1A1A`   | 30%                     | Metadata, captions, nav inactive        |
| `--text-muted`          | `#1A1A1A`   | 20%                     | Footnotes, disabled states              |
| `--accent`              | `#0047FF`   | —                       | Editorial Blue — links, active states   |
| `--accent-hover`        | `#0038CC`   | —                       | Buttons on hover                        |
| `--accent-subtle`       | `#0047FF`   | 8%                      | Accent backgrounds (tags, highlights)   |
| `--rule-heavy`          | `#1A1A1A`   | 100%                    | Thick section dividers (2px)            |
| `--rule-light`          | `#1A1A1A`   | 15%                     | Thin content separators (1px)           |
| `--rule-hairline`       | `#1A1A1A`   | 8%                      | List item borders                       |
| `--surface-hover`       | `#1A1A1A`   | 2%                      | Row hover state                         |
| `--button-primary-bg`   | `#1A1A1A`   | —                       | Primary CTA background                  |
| `--button-primary-text` | `#F7F5F0`   | —                       | Primary CTA text                        |
| `--success`             | `#1B7D3A`   | —                       | Positive indicators (weight increase)   |
| `--warning`             | `#B45309`   | —                       | Caution indicators                      |
| `--danger`              | `#C41E1E`   | —                       | Stop button, destructive actions        |

#### Dark Mode

| Token                   | Hex         | Opacity Variants        | Usage                                   |
| ----------------------- | ----------- | ----------------------- | --------------------------------------- |
| `--bg-primary`          | `#141311`   | —                       | Page background (warm near-black)       |
| `--bg-surface`          | `#1E1D1A`   | —                       | Elevated surfaces (modals, sheets)      |
| `--bg-nav`              | `#141311`   | 90% (with backdrop-blur)| Bottom nav background                   |
| `--text-primary`        | `#E8E5DE`   | —                       | Headings, display text                  |
| `--text-secondary`      | `#E8E5DE`   | 50%                     | Subtitles, descriptions                 |
| `--text-tertiary`       | `#E8E5DE`   | 30%                     | Metadata, captions, nav inactive        |
| `--text-muted`          | `#E8E5DE`   | 18%                     | Footnotes, disabled states              |
| `--accent`              | `#4D8AFF`   | —                       | Editorial Blue (brightened for dark bg)  |
| `--accent-hover`        | `#6B9FFF`   | —                       | Buttons on hover                        |
| `--accent-subtle`       | `#4D8AFF`   | 10%                     | Accent backgrounds (tags, highlights)   |
| `--rule-heavy`          | `#E8E5DE`   | 80%                     | Thick section dividers (2px)            |
| `--rule-light`          | `#E8E5DE`   | 12%                     | Thin content separators (1px)           |
| `--rule-hairline`       | `#E8E5DE`   | 6%                      | List item borders                       |
| `--surface-hover`       | `#E8E5DE`   | 4%                      | Row hover state                         |
| `--button-primary-bg`   | `#E8E5DE`   | —                       | Primary CTA background (inverted)       |
| `--button-primary-text` | `#141311`   | —                       | Primary CTA text (inverted)             |
| `--success`             | `#34D164`   | —                       | Positive indicators (lightened)         |
| `--warning`             | `#F5A623`   | —                       | Caution indicators (lightened)          |
| `--danger`              | `#FF4545`   | —                       | Stop button, destructive actions        |

### Color Rules

1. **Never use Tailwind's default color palette** (e.g., `blue-600`, `gray-500`). Always use the design tokens above.
2. **Accent is used surgically** — active nav items, links, the dateline issue number, category labels, blockquote borders, and the hover-state of the primary CTA. Never as a background fill for large areas.
3. **In dark mode, accent blue is shifted lighter** (`#4D8AFF`) to maintain WCAG AA contrast against the dark background.
4. **The primary CTA inverts in dark mode** — light text on dark bg becomes dark text on light bg.
5. **Warm tones are essential** — `#F7F5F0` (not `#FFFFFF`) for light, `#141311` (not `#000000`) for dark. The warmth gives the "newsprint" feel.

### Paper Texture Overlay

Both modes use a subtle noise texture overlay at very low opacity to reinforce the paper metaphor:

```css
/* Light mode: 2.5% opacity */
background-image: url("data:image/svg+xml,...feTurbulence...");
opacity: 0.025;

/* Dark mode: 3.5% opacity, inverted */
opacity: 0.035;
filter: invert(1);
```

The texture is applied to a `pointer-events-none fixed inset-0` overlay div.

---

## 4. Layout & Spacing

### Page Structure

```
┌─────────────────────────────────┐
│  Dateline bar (pt-10, pb-3)     │  ← date + issue number
├─────────────────────────────────┤  ← thin rule (1px)
│                                 │
│  Masthead / Page title          │  ← display-xl or display-lg
│  Subtitle                       │  ← body-sm, low opacity
│                                 │
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤  ← THICK rule (2px)
│                                 │
│  Primary content area           │
│  (sections divided by thin      │
│   rules, not cards)             │
│                                 │
├─────────────────────────────────┤  ← thin rule (1px)
│                                 │
│  Secondary content              │
│                                 │
├━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤  ← THICK rule (2px)
│  Footer tagline                 │
│                                 │
│  (h-20 spacer for nav)          │
├─────────────────────────────────┤
│  Bottom Nav (fixed)             │
└─────────────────────────────────┘
```

### Container

- **Max width:** `max-w-lg` (512px) — centered with `mx-auto`
- **Horizontal padding:** `px-5` (20px) on all content
- **Rules extend to container edges** — they sit at `mx-5` to align with content padding

### Spacing Scale

Use Tailwind's spacing utilities with these conventions:

| Context                     | Spacing    | Tailwind       |
| --------------------------- | ---------- | -------------- |
| Page top padding            | 40px       | `pt-10`        |
| Between section label + content | 12-20px | `mb-3` to `mb-5` |
| Between list items          | 0 (borders only) | `space-y-0`, border-separated |
| List item vertical padding  | 16px       | `py-4`         |
| Section vertical padding    | 24-32px    | `pt-6 pb-6` or `pt-6 pb-8` |
| Between rules and content   | 20-24px    | `mt-5` / `pt-6` |
| Bottom safe area            | 80px       | `h-20`         |
| Two-column gutter           | 20px       | `pr-5` / `pl-5` |

### Grid Patterns

**Two-column with sidebar** (used on home page):
```
grid grid-cols-[1fr_auto] gap-0
```
Left column holds the primary action; right column is a narrow stats sidebar separated by a vertical rule (`border-l`).

**Stats grid** (used on stats page):
```
grid grid-cols-3 gap-0
```
Equal columns separated by vertical rules, each containing a single stat.

---

## 5. Components

### 5.1 Rule Lines (Dividers)

Rule lines are the primary structural element — they replace cards and shadows.

| Type        | Height | Color / Opacity                  | Usage                              |
| ----------- | ------ | -------------------------------- | ---------------------------------- |
| **Heavy**   | 2px    | `--text-primary` / 100%          | Major section breaks               |
| **Light**   | 1px    | `--text-primary` / 15%           | Between content sections           |
| **Hairline**| 1px    | `--text-primary` / 8%            | Between list items (via border)    |

```html
<!-- Heavy rule -->
<div class="mx-5 h-[2px] bg-[--rule-heavy]" />

<!-- Light rule -->
<div class="mx-5 h-px bg-[--rule-light]" />
```

### 5.2 Section Headers

Always uppercase, always tracked wide, always small.

```html
<p class="mb-3 text-[9px] font-semibold tracking-[0.25em] text-[--accent] uppercase">
  Today's Session
</p>
```

Variant — neutral (no accent):
```html
<h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
  Routines
</h2>
```

### 5.3 Buttons

#### Primary CTA (Start Workout)

Full-width, dark background, Bebas Neue text. Turns accent blue on hover.

```
┌─────────────────────────────────┐
│  START WORKOUT                  │  ← Bebas Neue 22px
│  Freeform session               │  ← Barlow 11px light, 50% opacity
└─────────────────────────────────┘
```

- **Light:** `bg-[#1A1A1A]` text `#F7F5F0`, hover `bg-[#0047FF]`
- **Dark:** `bg-[#E8E5DE]` text `#141311`, hover `bg-[#4D8AFF]` text `#141311`
- **Transition:** `transition-all duration-200`
- **Press:** `active:scale-[0.99]`

#### Danger / Stop Button

Used during active timer.

- **Both modes:** `bg-[--danger]` with white text
- Same scale/transition behavior as primary

#### Ghost / Text Button

Used for secondary actions (Edit, Cancel).

```html
<span class="text-[11px] font-medium text-[--accent]">Edit →</span>
```

No background. Accent colored. Arrow suffix for navigation actions.

#### Segmented Control (e.g., Weight Unit Toggle)

Two options side by side, separated by a thin rule. Active option uses accent color.

```
┌──────────┬──────────┐
│   lbs    │    kg    │   ← Barlow 13px, 500 weight
└──────────┴──────────┘
```

- Active: `text-[--accent]` with `border-b-2 border-[--accent]`
- Inactive: `text-[--text-tertiary]`

### 5.4 List Items (Routine Rows, History Rows)

No cards, no shadows. Rows are separated by hairline borders. Content sits on the border grid.

```
──────────────────────────────────  ← hairline border-t
  FULL BODY A            6 ex.  →
──────────────────────────────────  ← hairline border-b
  UPPER BODY             4 ex.  →
──────────────────────────────────
```

- Title: `display-sm` (Bebas Neue 22px)
- Metadata: `body-xs` (Barlow 11px, 30% opacity)
- Arrow: `→` character, 20% opacity, translates right + turns accent on hover
- Hover background: `--surface-hover`
- Full-width `<button>` or `<a>` for tap target

### 5.5 Stat Blocks

Vertically stacked, used in sidebar or stat grids.

```
12            ← display-md (Bebas Neue 28px)
SESSIONS      ← caption (Barlow 10px, 500, uppercase, 30% opacity)
```

### 5.6 Form Inputs

Inputs use a minimal underline style rather than bordered boxes, consistent with the editorial aesthetic.

```
WEIGHT                            ← input-label (uppercase, tracked)
_________________________         ← thin bottom border only
145                               ← input-value (Barlow 16px)
```

- **Border:** bottom only, `border-b border-[--rule-light]`, focus → `border-[--accent]`
- **Background:** transparent
- **Label:** `input-label` token — 12px, 500 weight, uppercase, tracked
- **Placeholder:** `--text-muted` opacity

### 5.7 Timer Display

The active exercise timer is the most prominent visual element during a workout.

```
         01:34                     ← timer-display (Bebas Neue 72px)

     ┌────────────┐
     │    STOP    │               ← danger button, centered
     └────────────┘
```

- Timer: centered, `tabular-nums`, `--text-primary`
- The stop button uses the danger color treatment
- Countdown numbers use `timer-secondary` (Bebas Neue 36px) with a subtle scale animation

### 5.8 Bottom Navigation

Fixed to viewport bottom. Transparent with backdrop blur.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← thin rule (border-t)
 WORKOUT   HISTORY   STATS   SETTINGS
```

- **Active item:** `text-[--accent]` with a 2px-wide accent bar above (`h-[2px] w-4 bg-[--accent]`)
- **Inactive items:** `--text-tertiary` (25-30% opacity), hover → 50%
- **Background:** `--bg-nav` at 90% opacity + `backdrop-blur-xl`
- **Layout:** `grid grid-cols-4`, centered labels, `py-3`
- **Label style:** `label-nav` (10px, 600 weight, uppercase, tracked)

### 5.9 Page Header (Interior Pages)

Interior pages (History detail, Settings subpages) use a simpler header:

```
← Back    EXERCISE DETAIL          ← label-section style
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← heavy rule below
```

- Sticky top, blurred background (like nav)
- Back arrow is a text `←` character, not an SVG icon, in accent color
- Title uses `label-section` style (11px, 600, uppercase, tracked)

### 5.10 Pull Quote / Motivational Block

Optional — adds editorial flavor to pages with vertical space.

```
  ┃  "The resistance that you fight physically in
  ┃   the gym and the resistance that you fight in
  ┃   life can only build a strong character."
  ┃
  ┃   — ARNOLD SCHWARZENEGGER
```

- Left border: 3px, `--accent`
- Quote text: Barlow italic, 15px, 300 weight, 40% opacity
- Attribution: `caption` style (10px, 600, uppercase, tracked, 25% opacity)

### 5.11 Toggle / Switch

Used for settings like metronome on/off.

```
Metronome Sound              ●━━━━━│  ON
```

- Track: 40px wide, 20px tall, rounded-full
- **Off:** `bg-[--rule-light]`
- **On:** `bg-[--accent]`
- Thumb: white circle, `transition-transform`

### 5.12 Empty States

When a list has no data:

```
──────────────────────────────────

         NO WORKOUTS YET          ← display-sm (Bebas Neue 22px), 30% opacity
    Start your first session      ← body-sm, 20% opacity
         to see history.

──────────────────────────────────
```

Centered between two light rules. No icons, no illustrations — just typography.

### 5.13 Select / Dropdown

Styled selects for filters (stats page, exercise picker).

```
┌─────────────────────────────────┐
│  ALL EXERCISES              ▾   │   ← label style text inside
└─────────────────────────────────┘
```

- Border: 1px `--rule-light`, no shadow
- Text: `label-section` style inside
- Chevron: text `▾` character
- Background: transparent, `--surface-hover` on focus

### 5.14 Cards (Elevated Surfaces)

Used sparingly — only for modals, bottom sheets, or overlaid content. Never for list items or content sections on the main page.

- Background: `--bg-surface`
- Border: 1px `--rule-light`
- Shadow (light mode only): `0 1px 3px rgba(26, 26, 26, 0.06)`
- Dark mode: no shadow, relies on border + slight background difference

---

## 6. Animation System

### Keyframes

```css
@keyframes c-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes c-fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

These are the only two keyframes needed. The editorial style is restrained — no bounces, no elastic easing, no 3D transforms.

### Page Load Orchestration

Content enters sequentially with staggered delays, simulating a page being "typeset":

| Element           | Animation      | Duration | Delay    | Easing   |
| ----------------- | -------------- | -------- | -------- | -------- |
| Dateline          | `c-fade-in`    | 0.6s     | 0s       | ease-out |
| First rule        | `c-fade-in`    | 0.6s     | 0.05s    | ease-out |
| Masthead title    | `c-fade-in-up` | 0.7s     | 0.15s    | ease-out |
| Subtitle          | `c-fade-in-up` | 0.6s     | 0.3s     | ease-out |
| Thick rule        | `c-fade-in`    | 0.6s     | 0.35s    | ease-out |
| Primary action    | `c-fade-in-up` | 0.6s     | 0.4s     | ease-out |
| Sidebar           | `c-fade-in-up` | 0.6s     | 0.5s     | ease-out |
| Section header    | `c-fade-in`    | 0.6s     | 0.6s     | ease-out |
| List items        | `c-fade-in-up` | 0.5s     | 0.7s + (i * 0.08s) | ease-out |
| Footer content    | `c-fade-in`    | 0.6s     | 1.0s     | ease-out |

**Applied via inline styles:**
```tsx
style={{ animation: "c-fade-in-up 0.6s ease-out 0.4s both" }}
```

The `both` fill mode ensures elements remain invisible before their animation starts.

### Interaction Transitions

| Interaction            | Property     | Duration | Easing     |
| ---------------------- | ------------ | -------- | ---------- |
| Button hover (bg)      | all          | 200ms    | ease       |
| Button press (scale)   | transform    | 100ms    | ease       |
| Arrow slide on hover   | transform    | 200ms    | ease       |
| Nav item color change  | color        | 200ms    | ease       |
| Input focus border     | border-color | 150ms    | ease       |
| Toggle thumb slide     | transform    | 200ms    | ease       |

### Animation Rules

1. **Never animate layout properties** (width, height, margin) — only opacity and transform.
2. **Total page-load animation should complete within ~1.2s.** After that, content must be fully visible.
3. **Interior page transitions are simpler** — a single `c-fade-in-up` on the content area with 0.2s delay, no staggering.
4. **`prefers-reduced-motion: reduce`** — all animations should be disabled. Set `animation: none !important` globally.

---

## 7. Iconography

**No icons.** The editorial design uses text characters and typographic symbols instead:

| Action       | Symbol | Unicode |
| ------------ | ------ | ------- |
| Navigate     | →      | U+2192  |
| Back         | ←      | U+2190  |
| Dropdown     | ▾      | U+25BE  |
| Separator    | ·      | U+00B7  |
| Increase     | ↑      | U+2191  |
| Decrease     | ↓      | U+2193  |
| Maintain     | =      | U+003D  |

If absolutely necessary (e.g., for a chart library), use simple SVG line-art icons with 1.5px stroke, matching `--text-primary` color.

---

## 8. Dark Mode Implementation

Dark mode is activated via the `prefers-color-scheme: dark` media query or a manual toggle in Settings.

### CSS Custom Properties Setup

```css
:root {
  --bg-primary: #F7F5F0;
  --bg-surface: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: rgba(26, 26, 26, 0.45);
  --text-tertiary: rgba(26, 26, 26, 0.30);
  --text-muted: rgba(26, 26, 26, 0.20);
  --accent: #0047FF;
  --accent-hover: #0038CC;
  --rule-heavy: #1A1A1A;
  --rule-light: rgba(26, 26, 26, 0.15);
  --rule-hairline: rgba(26, 26, 26, 0.08);
  --surface-hover: rgba(26, 26, 26, 0.02);
  --button-primary-bg: #1A1A1A;
  --button-primary-text: #F7F5F0;
  --success: #1B7D3A;
  --warning: #B45309;
  --danger: #C41E1E;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #141311;
    --bg-surface: #1E1D1A;
    --text-primary: #E8E5DE;
    --text-secondary: rgba(232, 229, 222, 0.50);
    --text-tertiary: rgba(232, 229, 222, 0.30);
    --text-muted: rgba(232, 229, 222, 0.18);
    --accent: #4D8AFF;
    --accent-hover: #6B9FFF;
    --rule-heavy: rgba(232, 229, 222, 0.80);
    --rule-light: rgba(232, 229, 222, 0.12);
    --rule-hairline: rgba(232, 229, 222, 0.06);
    --surface-hover: rgba(232, 229, 222, 0.04);
    --button-primary-bg: #E8E5DE;
    --button-primary-text: #141311;
    --success: #34D164;
    --warning: #F5A623;
    --danger: #FF4545;
  }
}
```

### Dark Mode Visual Adjustments

1. **Paper texture opacity increases slightly** (0.025 → 0.035) and applies `filter: invert(1)` to render light noise on dark bg.
2. **Heavy rules soften** — from 100% opacity to 80%, preventing harsh white lines.
3. **Accent blue brightens** — `#0047FF` → `#4D8AFF` to maintain perceived vibrancy.
4. **Primary CTA inverts** — dark-on-light becomes light-on-dark.
5. **Shadows are removed** — dark mode relies on borders and subtle background differences for elevation.
6. **Success/warning/danger colors lighten** to remain visible against the dark background.

---

## 9. Responsive Behavior

The app is mobile-first with a single-column layout. The `max-w-lg` (512px) container ensures it looks intentional on larger screens.

### Breakpoints

| Breakpoint | Behavior                                                     |
| ---------- | ------------------------------------------------------------ |
| < 375px    | `display-xl` scales down to 60px. Two-column layout stacks. |
| 375–512px  | Default mobile layout. All specs above apply.                |
| > 512px    | Content centered in `max-w-lg`. Background fills viewport.  |

### Touch Targets

- All interactive elements have a minimum tap target of **44px** height.
- List items have `py-4` (16px top + 16px bottom + content ≥ 44px total).
- Buttons have explicit `py-4` minimum.
- Navigation items span the full grid column width.

---

## 10. Accessibility

- **Contrast ratios:** All text meets WCAG AA minimum (4.5:1 for body, 3:1 for large text) in both modes.
- **Focus indicators:** `outline: 2px solid var(--accent); outline-offset: 2px` on all interactive elements.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables all animations.
- **Semantic HTML:** Use `<nav>`, `<header>`, `<main>`, `<section>`, `<button>`, `<a>` appropriately.
- **ARIA:** `aria-current="page"` on active nav items. `role="switch"` on toggles.
- **Readable font sizes:** Despite the editorial aesthetic, body text is never below 11px.

---

## 11. File & Token Naming Conventions

### CSS Custom Properties

All design tokens use the `--` prefix with kebab-case: `--bg-primary`, `--text-secondary`, `--rule-heavy`.

### Tailwind Approach

Use Tailwind's arbitrary value syntax to reference tokens:

```html
<div class="bg-[var(--bg-primary)] text-[var(--text-primary)]">
```

For one-off values that don't need theming, use direct hex values in Tailwind arbitrary syntax:

```html
<div class="text-[#0047FF]">
```

### Animation Classes

All keyframe names are prefixed with `c-` (for "concept" / custom) to avoid collisions:
`c-fade-in`, `c-fade-in-up`.

---

## 12. Summary: The "Press" Checklist

When building or reviewing any screen, verify:

- [ ] Uses Bebas Neue for display/titles and Barlow for everything else
- [ ] No cards with shadows for list content — uses rule lines instead
- [ ] Section headers are uppercase, small, and widely tracked
- [ ] Only one accent color (`--accent`) is used — no other hues in the UI
- [ ] Background is warm newsprint (`#F7F5F0`), not pure white
- [ ] Page load animations are staggered and complete within 1.2s
- [ ] Dark mode uses warm near-black (`#141311`), not pure black
- [ ] All interactive elements have 44px minimum tap target
- [ ] Typography hierarchy is achieved through size/weight, not color
- [ ] Feels like a magazine spread, not a generic mobile app
