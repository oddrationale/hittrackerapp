# Mobile App Concepts — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create three mobile-app-styled redesigns of the Press homepage at routes `/1`, `/2`, `/3`.

**Architecture:** Each concept is a standalone Preact component in `src/pages/concepts/`. Routes are registered in `app.tsx` with loading-state bypass. No functional logic — static design mockups using the Press design language (fonts, colors, animations from `docs/design-language.md`).

**Tech Stack:** Preact + TypeScript, Tailwind CSS 4 (arbitrary values), Bebas Neue + Barlow fonts (already loaded in `index.html`), keyframes already in `src/index.css`.

---

### Task 1: Create Concept 1 — "Dashboard"

**Files:**
- Create: `src/pages/concepts/dashboard.tsx`

**Context:**
- Reference `src/pages/concepts/press.tsx` for patterns (paper texture overlay, font inline styles, animation stagger pattern)
- Reference `docs/design-language.md` for all token values
- Fonts: `fontFamily: "'Bebas Neue', sans-serif"` for display, `fontFamily: "'Barlow', sans-serif"` on root div
- Colors: `#F7F5F0` bg, `#1A1A1A` text, `#0047FF` accent
- Animations: `c-fade-in` and `c-fade-in-up` keyframes (already in `src/index.css`)
- Use `class` not `className` (Preact)

**Step 1: Create the Dashboard component**

Create `src/pages/concepts/dashboard.tsx` with this structure:

```tsx
/**
 * "Dashboard" — Stats-forward mobile app layout
 * Dense grid with compact sticky header, stats hero, horizontal routine cards.
 *
 * Fonts: Bebas Neue (display) + Barlow (body)
 * Colors: #F7F5F0 warm newsprint bg, #1A1A1A text, #0047FF editorial blue
 */

// Static data (same as press.tsx)
const routines = [
  { name: "Full Body A", count: 6 },
  { name: "Upper Body", count: 4 },
  { name: "Lower Body", count: 4 },
];

const stats = [
  { value: "12", label: "Sessions" },
  { value: "3", label: "Wk Streak" },
  { value: "48%", label: "Avg TUL" },
];

const recentWorkouts = [
  { name: "Full Body A", date: "Wed 2/19", duration: "42 min" },
  { name: "Upper Body", date: "Mon 2/17", duration: "38 min" },
];

export function Dashboard() {
  return (
    <div class="relative min-h-screen bg-[#F7F5F0] text-[#1A1A1A]"
         style={{ fontFamily: "'Barlow', sans-serif" }}>

      {/* Paper texture overlay — same as press.tsx */}
      {/* ... copy the SVG texture div from press.tsx ... */}

      {/* Sticky compact header */}
      <header class="sticky top-0 z-30 bg-[#F7F5F0]/90 backdrop-blur-xl">
        <div class="mx-auto max-w-lg px-5 py-3 flex items-center justify-between">
          <span class="text-[18px] tracking-[0.04em]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Hit Tracker
          </span>
          <span class="text-[9px] font-semibold tracking-[0.2em] uppercase opacity-40">
            Feb 21, 2026
          </span>
        </div>
        <div class="mx-auto max-w-lg"><div class="mx-5 h-[2px] bg-[#1A1A1A]" /></div>
      </header>

      <div class="relative z-10 mx-auto max-w-lg">
        {/* 3-column stat grid — hero position */}
        <section class="grid grid-cols-3 px-5 pt-5 pb-5"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.1s both" }}>
          {stats.map((stat, i) => (
            <div key={stat.label}
                 class={`py-2 text-center ${i > 0 ? "border-l border-[#1A1A1A]/[0.08]" : ""}`}>
              <p class="text-[28px] leading-none tracking-[0.02em] tabular-nums"
                 style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {stat.value}
              </p>
              <p class="mt-1 text-[10px] font-medium tracking-[0.05em] uppercase opacity-30">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Thin rule */}
        <div class="mx-5 h-px bg-[#1A1A1A]/15" />

        {/* Primary CTA */}
        <section class="px-5 pt-5 pb-5"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.2s both" }}>
          <p class="mb-3 text-[9px] font-semibold tracking-[0.25em] text-[#0047FF] uppercase">
            Today's Session
          </p>
          <button class="group w-full bg-[#1A1A1A] px-5 py-4 text-left transition-all duration-200 hover:bg-[#0047FF] active:scale-[0.99]">
            <span class="text-[22px] tracking-[0.03em] text-[#F7F5F0]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Start Workout
            </span>
            <p class="mt-1 text-[11px] font-light text-[#F7F5F0]/50">
              Full Body A · 6 exercises
            </p>
          </button>
          <p class="mt-2 text-[11px] font-light opacity-30">
            Last session: 2 days ago
          </p>
        </section>

        {/* Thin rule */}
        <div class="mx-5 h-px bg-[#1A1A1A]/15" />

        {/* Horizontal scroll routine cards */}
        <section class="pt-5 pb-5"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.35s both" }}>
          <div class="px-5 mb-4 flex items-baseline justify-between">
            <h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
              Routines
            </h2>
            <span class="text-[11px] font-medium text-[#0047FF]">Edit →</span>
          </div>
          <div class="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none"
               style={{ scrollbarWidth: "none" }}>
            {routines.map((routine) => (
              <button key={routine.name}
                      class="flex-shrink-0 w-[130px] border border-[#1A1A1A]/[0.08] px-4 py-4 text-left transition-colors hover:bg-[#1A1A1A]/[0.02]">
                <span class="text-[18px] leading-tight tracking-[0.02em] block"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {routine.name}
                </span>
                <span class="mt-1 text-[10px] font-light opacity-30 block">
                  {routine.count} exercises
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Thin rule */}
        <div class="mx-5 h-px bg-[#1A1A1A]/15" />

        {/* Recent activity */}
        <section class="px-5 pt-5 pb-8"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.5s both" }}>
          <h2 class="mb-4 text-[11px] font-semibold tracking-[0.25em] uppercase opacity-40">
            Recent
          </h2>
          {recentWorkouts.map((w, i) => (
            <button key={w.name}
                    class="flex w-full items-center justify-between border-b border-[#1A1A1A]/[0.08] py-3 text-left first:border-t transition-colors hover:bg-[#1A1A1A]/[0.02]">
              <div>
                <span class="text-[16px] tracking-[0.02em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {w.name}
                </span>
                <span class="ml-3 text-[11px] font-light opacity-30">
                  {w.date} · {w.duration}
                </span>
              </div>
              <span class="text-[14px] opacity-20">→</span>
            </button>
          ))}
        </section>

        {/* Bottom spacer for tab bar */}
        <div class="h-20" />
      </div>

      {/* Bottom tab bar */}
      <nav class="fixed right-0 bottom-0 left-0 z-40 border-t border-[#1A1A1A]/10 bg-[#F7F5F0]/90 backdrop-blur-xl">
        <div class="mx-auto grid max-w-lg grid-cols-4 py-3">
          {["Workout", "History", "Stats", "Settings"].map((label, i) => (
            <a key={label} href="#"
               class={`flex flex-col items-center py-1 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                 i === 0 ? "text-[#0047FF]" : "text-[#1A1A1A]/25 hover:text-[#1A1A1A]/50"
               }`}>
              {i === 0 && <div class="mb-1 h-[2px] w-4 bg-[#0047FF]" />}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `pnpm typecheck`
Expected: No errors related to dashboard.tsx

**Step 3: Commit**

```bash
git add src/pages/concepts/dashboard.tsx
git commit -m "feat: add Dashboard (concept 1) mobile app layout"
```

---

### Task 2: Create Concept 2 — "Feed"

**Files:**
- Create: `src/pages/concepts/feed.tsx`

**Context:** Same as Task 1. This concept has a tall hero CTA and a feed-style activity list.

**Step 1: Create the Feed component**

Create `src/pages/concepts/feed.tsx`:

```tsx
/**
 * "Feed" — Action-first mobile app layout
 * Hero CTA dominates viewport, recent activity feed below, compact stats.
 *
 * Fonts: Bebas Neue (display) + Barlow (body)
 * Colors: #F7F5F0 warm newsprint bg, #1A1A1A text, #0047FF editorial blue
 */

const recentActivity = [
  { name: "Full Body A", timeAgo: "2 days ago", duration: "42 min", exercises: 6 },
  { name: "Upper Body", timeAgo: "4 days ago", duration: "38 min", exercises: 4 },
  { name: "Lower Body", timeAgo: "6 days ago", duration: "35 min", exercises: 4 },
];

const stats = [
  { value: "12", label: "Sessions" },
  { value: "3", label: "Wk Streak" },
  { value: "48%", label: "Avg TUL" },
];

export function Feed() {
  return (
    <div class="relative min-h-screen bg-[#F7F5F0] text-[#1A1A1A]"
         style={{ fontFamily: "'Barlow', sans-serif" }}>

      {/* Paper texture overlay */}
      {/* ... same SVG texture div ... */}

      {/* Sticky header */}
      <header class="sticky top-0 z-30 bg-[#F7F5F0]/90 backdrop-blur-xl">
        <div class="mx-auto max-w-lg px-5 py-3 flex items-center justify-between">
          <span class="text-[22px] tracking-[0.04em]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Hit Tracker
          </span>
          <span class="text-[10px] font-semibold tracking-[0.2em] text-[#0047FF] uppercase">
            No. 12
          </span>
        </div>
        <div class="mx-auto max-w-lg"><div class="mx-5 h-[2px] bg-[#1A1A1A]" /></div>
      </header>

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Dateline */}
        <div class="px-5 pt-4 pb-4"
             style={{ animation: "c-fade-in 0.6s ease-out both" }}>
          <span class="text-[9px] font-semibold tracking-[0.25em] uppercase opacity-40">
            Friday, February 21, 2026
          </span>
        </div>

        {/* Hero CTA — tall, centered, dominant */}
        <section class="px-5 pb-5"
                 style={{ animation: "c-fade-in-up 0.7s ease-out 0.15s both" }}>
          <button class="group w-full bg-[#1A1A1A] px-5 py-10 text-center transition-all duration-200 hover:bg-[#0047FF] active:scale-[0.99]">
            <span class="block text-[36px] tracking-[0.03em] text-[#F7F5F0]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Start Workout
            </span>
            <p class="mt-2 text-[14px] font-light text-[#F7F5F0]/50"
               style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
              Full Body A
            </p>
            <p class="mt-0.5 text-[11px] font-light text-[#F7F5F0]/30">
              6 exercises
            </p>
            <div class="mt-4 flex items-center justify-center gap-4 text-[12px] text-[#F7F5F0]/25">
              <span>←</span>
              <span class="text-[10px] font-semibold tracking-[0.15em] uppercase">
                Full Body A
              </span>
              <span>→</span>
            </div>
          </button>
        </section>

        {/* Thin rule */}
        <div class="mx-5 h-px bg-[#1A1A1A]/15" />

        {/* Recent Activity */}
        <section class="px-5 pt-5 pb-5"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.35s both" }}>
          <h2 class="mb-4 text-[11px] font-semibold tracking-[0.25em] uppercase">
            Recent Activity
          </h2>
          {recentActivity.map((w) => (
            <button key={w.name}
                    class="group flex w-full items-center justify-between border-b border-[#1A1A1A]/[0.08] py-4 text-left first:border-t transition-colors hover:bg-[#1A1A1A]/[0.02]">
              <div>
                <span class="text-[18px] tracking-[0.02em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {w.name}
                </span>
                <p class="mt-0.5 text-[11px] font-light opacity-30">
                  {w.timeAgo} · {w.duration} · {w.exercises} ex.
                </p>
              </div>
              <span class="text-[14px] opacity-20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#0047FF] group-hover:opacity-80">
                →
              </span>
            </button>
          ))}
        </section>

        {/* Thin rule */}
        <div class="mx-5 h-px bg-[#1A1A1A]/15" />

        {/* Compact stat bar */}
        <section class="grid grid-cols-3 px-5 pt-5 pb-5"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.5s both" }}>
          <p class="col-span-3 mb-3 text-[9px] font-semibold tracking-[0.25em] uppercase opacity-30">
            This Week
          </p>
          {stats.map((stat, i) => (
            <div key={stat.label}
                 class={`py-1 text-center ${i > 0 ? "border-l border-[#1A1A1A]/[0.08]" : ""}`}>
              <p class="text-[22px] leading-none tracking-[0.02em] tabular-nums"
                 style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {stat.value}
              </p>
              <p class="mt-1 text-[10px] font-medium tracking-[0.05em] uppercase opacity-30">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Heavy rule */}
        <div class="mx-5 h-[2px] bg-[#1A1A1A]" />

        {/* Footer tagline */}
        <div class="px-5 py-4 text-center"
             style={{ animation: "c-fade-in 0.6s ease-out 0.7s both" }}>
          <p class="text-[9px] font-medium tracking-[0.3em] uppercase opacity-20">
            Track · Improve · Repeat
          </p>
        </div>

        <div class="h-20" />
      </div>

      {/* Bottom tab bar */}
      <nav class="fixed right-0 bottom-0 left-0 z-40 border-t border-[#1A1A1A]/10 bg-[#F7F5F0]/90 backdrop-blur-xl">
        <div class="mx-auto grid max-w-lg grid-cols-4 py-3">
          {["Workout", "History", "Stats", "Settings"].map((label, i) => (
            <a key={label} href="#"
               class={`flex flex-col items-center py-1 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                 i === 0 ? "text-[#0047FF]" : "text-[#1A1A1A]/25 hover:text-[#1A1A1A]/50"
               }`}>
              {i === 0 && <div class="mb-1 h-[2px] w-4 bg-[#0047FF]" />}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `pnpm typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/pages/concepts/feed.tsx
git commit -m "feat: add Feed (concept 2) mobile app layout"
```

---

### Task 3: Create Concept 3 — "Compact Editorial"

**Files:**
- Create: `src/pages/concepts/compact.tsx`

**Context:** Same as Task 1. This concept uses card zones (hairline border containers) and dot indicators on the tab bar.

**Step 1: Create the Compact component**

Create `src/pages/concepts/compact.tsx`:

```tsx
/**
 * "Compact Editorial" — Magazine-app hybrid layout
 * Card zones with hairline borders, sticky header, dot tab indicators.
 * Closest to the original Press but tightened into app proportions.
 *
 * Fonts: Bebas Neue (display) + Barlow (body)
 * Colors: #F7F5F0 warm newsprint bg, #1A1A1A text, #0047FF editorial blue
 */

const routines = [
  { name: "Full Body A", count: 6 },
  { name: "Upper Body", count: 4 },
  { name: "Lower Body", count: 4 },
];

const stats = [
  { value: "12", label: "Sessions" },
  { value: "3", label: "Wk Streak" },
  { value: "48%", label: "Avg TUL" },
];

export function Compact() {
  return (
    <div class="relative min-h-screen bg-[#F7F5F0] text-[#1A1A1A]"
         style={{ fontFamily: "'Barlow', sans-serif" }}>

      {/* Paper texture overlay */}
      {/* ... same SVG texture div ... */}

      {/* Sticky header */}
      <header class="sticky top-0 z-30 bg-[#F7F5F0]/90 backdrop-blur-xl">
        <div class="mx-auto max-w-lg px-5 py-3 flex items-center justify-between">
          <span class="text-[24px] tracking-[0.04em]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Hit Tracker
          </span>
          <span class="text-[10px] font-semibold tracking-[0.2em] text-[#0047FF] uppercase">
            No. 12
          </span>
        </div>
        <div class="mx-auto max-w-lg"><div class="mx-5 h-[2px] bg-[#1A1A1A]" /></div>
      </header>

      <div class="relative z-10 mx-auto max-w-lg">
        {/* Dateline */}
        <div class="px-5 pt-4 pb-3"
             style={{ animation: "c-fade-in 0.6s ease-out both" }}>
          <span class="text-[9px] font-semibold tracking-[0.2em] uppercase opacity-40">
            Friday, February 21, 2026
          </span>
        </div>

        {/* Action card zone */}
        <section class="mx-5 border border-[#1A1A1A]/[0.08] px-5 pt-4 pb-5"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.15s both" }}>
          <p class="mb-3 text-[9px] font-semibold tracking-[0.25em] text-[#0047FF] uppercase">
            Today's Session
          </p>
          <button class="group w-full bg-[#1A1A1A] px-5 py-4 text-left transition-all duration-200 hover:bg-[#0047FF] active:scale-[0.99]">
            <span class="text-[22px] tracking-[0.03em] text-[#F7F5F0]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Start Workout
            </span>
            <p class="mt-1 text-[11px] font-light text-[#F7F5F0]/50">
              Freeform session
            </p>
          </button>
          <p class="mt-2 text-[11px] font-light opacity-30">
            Last session: 2 days ago
          </p>

          {/* Inline thin rule */}
          <div class="mt-4 mb-3 h-px bg-[#1A1A1A]/10" />

          {/* Inline stats row */}
          <div class="grid grid-cols-3">
            {stats.map((stat, i) => (
              <div key={stat.label}
                   class={`py-1 text-center ${i > 0 ? "border-l border-[#1A1A1A]/[0.08]" : ""}`}>
                <p class="text-[22px] leading-none tracking-[0.02em] tabular-nums"
                   style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {stat.value}
                </p>
                <p class="mt-0.5 text-[10px] font-medium tracking-[0.05em] uppercase opacity-30">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Spacer between card zones */}
        <div class="h-4" />

        {/* Routines card zone */}
        <section class="mx-5 border border-[#1A1A1A]/[0.08]"
                 style={{ animation: "c-fade-in-up 0.6s ease-out 0.35s both" }}>
          <div class="flex items-baseline justify-between px-5 pt-4 pb-3">
            <h2 class="text-[11px] font-semibold tracking-[0.25em] uppercase">
              Routines
            </h2>
            <span class="text-[11px] font-medium text-[#0047FF]">Edit →</span>
          </div>
          {routines.map((routine) => (
            <button key={routine.name}
                    class="group flex w-full items-center justify-between border-t border-[#1A1A1A]/[0.08] px-5 py-4 text-left transition-colors hover:bg-[#1A1A1A]/[0.02]">
              <div class="flex items-baseline gap-3">
                <span class="text-[20px] tracking-[0.02em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {routine.name}
                </span>
                <span class="text-[11px] font-light opacity-30">
                  {routine.count} ex.
                </span>
              </div>
              <span class="text-[14px] opacity-20 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#0047FF] group-hover:opacity-80">
                →
              </span>
            </button>
          ))}
        </section>

        {/* Pull quote — compact */}
        <section class="px-5 pt-6 pb-6"
                 style={{ animation: "c-fade-in 0.6s ease-out 0.55s both" }}>
          <div class="border-l-[3px] border-[#0047FF] py-1 pl-5">
            <p class="text-[13px] leading-[1.7] font-light italic opacity-35">
              "The resistance that you fight physically in the gym and the
              resistance that you fight in life can only build a strong
              character."
            </p>
            <p class="mt-2 text-[10px] font-semibold tracking-[0.15em] uppercase opacity-25">
              — Arnold Schwarzenegger
            </p>
          </div>
        </section>

        <div class="h-20" />
      </div>

      {/* Bottom tab bar — dot indicators */}
      <nav class="fixed right-0 bottom-0 left-0 z-40 border-t border-[#1A1A1A]/10 bg-[#F7F5F0]/90 backdrop-blur-xl">
        <div class="mx-auto grid max-w-lg grid-cols-4 py-3">
          {["Workout", "History", "Stats", "Settings"].map((label, i) => (
            <a key={label} href="#"
               class={`flex flex-col items-center py-1 text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors ${
                 i === 0 ? "text-[#0047FF]" : "text-[#1A1A1A]/25 hover:text-[#1A1A1A]/50"
               }`}>
              {i === 0 && <div class="mb-1.5 h-[5px] w-[5px] rounded-full bg-[#0047FF]" />}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `pnpm typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/pages/concepts/compact.tsx
git commit -m "feat: add Compact Editorial (concept 3) mobile app layout"
```

---

### Task 4: Register Routes in app.tsx

**Files:**
- Modify: `src/app.tsx`

**Step 1: Add imports and routes**

Add these imports after the `Press` import (line 10):

```tsx
import { Dashboard } from "./pages/concepts/dashboard.tsx";
import { Feed } from "./pages/concepts/feed.tsx";
import { Compact } from "./pages/concepts/compact.tsx";
```

Update the loading bypass condition (line 47) from:
```tsx
if (isLoading.value && path !== "/press") {
```
to:
```tsx
if (isLoading.value && !["/press", "/1", "/2", "/3"].includes(path)) {
```

Add routes after the Press route (line 60):
```tsx
<Route path="/1" component={Dashboard} />
<Route path="/2" component={Feed} />
<Route path="/3" component={Compact} />
```

**Step 2: Verify everything compiles and dev server works**

Run: `pnpm typecheck`
Expected: No errors

Run: `pnpm build`
Expected: Clean build

**Step 3: Commit**

```bash
git add src/app.tsx
git commit -m "feat: register /1, /2, /3 routes for mobile app concepts"
```

---

### Task 5: Visual review and polish

**Step 1: Start dev server and review all three concepts**

Run: `pnpm dev`

Visit:
- `http://localhost:5173/1` — Dashboard concept
- `http://localhost:5173/2` — Feed concept
- `http://localhost:5173/3` — Compact concept

**Step 2: Check for visual issues**

Verify:
- Paper texture overlay appears on all three
- Animations stagger correctly on page load
- Tab bar is fixed at bottom and frosted
- Sticky header stays on scroll
- Fonts load correctly (Bebas Neue + Barlow)
- All interactive elements have hover states

**Step 3: Fix any issues found, then commit**

```bash
git add -u
git commit -m "fix: polish mobile app concept layouts"
```
