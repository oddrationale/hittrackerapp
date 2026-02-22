# Mobile App Concepts — Design

> Three redesigns of the Press homepage, transforming it from editorial web page to mobile app feel.
> All concepts follow the Press design language (docs/design-language.md).

---

## Shared Principles

All three concepts apply these mobile-app transformations:

- **Compact sticky header** replaces the large masthead — app name in small Bebas Neue, frosted glass backdrop blur
- **Dense layout** — less editorial whitespace, more information per screen
- **Card-like grouping** — sections contained with hairline borders (no shadows, no rounded corners)
- **Native-feeling tab bar** — more iOS/Android native styling
- **Same Press tokens** — colors, fonts, animations, no-icons rule all preserved

Routes: `/1`, `/2`, `/3` (proof-of-concept only, no functionality)

---

## Concept 1: "Dashboard" — `/1`

Stats-forward grid layout. Information density is the priority.

### Structure

1. **Sticky header**: "HIT TRACKER" Bebas ~18px left, date right. Frosted glass + heavy rule below.
2. **Stat grid**: 3-column grid at top. Big Bebas numbers (28px), caption labels. Columns separated by vertical hairline borders.
3. **Primary CTA**: Full-width "Start Workout" button with routine name and exercise count as subtitle.
4. **Routine cards**: Horizontal overflow-x scrollable row. Each card ~120px wide, hairline border, Bebas title, exercise count.
5. **Recent activity**: 2 compact history rows — routine name, date, duration.
6. **Bottom tab bar**: Standard 4-tab layout.

### Key Differentiators

- Stats are the hero/first content after header
- Horizontal scroll for routines (not vertical list)
- Recent activity provides at-a-glance history
- Most compact of the three concepts

---

## Concept 2: "Feed" — `/2`

Action-first vertical stack. The workout CTA dominates the viewport.

### Structure

1. **Sticky header**: "HIT TRACKER" Bebas ~22px left, "No. 12" accent right. Frosted glass + heavy rule.
2. **Dateline**: "FRIDAY, FEBRUARY 21, 2026" as section label below header.
3. **Hero CTA**: Tall dark block (~160px). "START WORKOUT" centered in Bebas ~36px. Selected routine name and count below. Routine cycle hint (← arrows →) at bottom of block.
4. **Recent Activity feed**: 2-3 rows with hairline borders. Routine name, time ago, duration, exercise count.
5. **Compact stat bar**: Horizontal 3-up at bottom of content. Smaller numbers (Bebas 22px).
6. **Footer tagline + bottom tab bar**.

### Key Differentiators

- CTA is enormous and dominates the viewport
- Routine selection is built into the CTA block
- Feed-style recent activity
- Stats are secondary, compact

---

## Concept 3: "Compact Editorial" — `/3`

Closest to the original Press concept but tightened into app proportions.

### Structure

1. **Sticky header**: "HIT TRACKER" Bebas ~24px left, "No. 12" right. Heavy rule below. Frosted glass.
2. **Dateline**: Below header, standard Press dateline style.
3. **Action card zone** (hairline border container):
   - "TODAY'S SESSION" section label
   - Full-width "Start Workout" CTA
   - "Last session: 2 days ago" metadata
   - Inline 3-up stat row (compact, same card zone)
4. **Routines card zone** (hairline border container):
   - "ROUTINES" header with "Edit →"
   - Standard list rows with hairline borders
5. **Pull quote**: Kept but compact.
6. **Bottom tab bar**: Dot indicators above labels for active state.

### Key Differentiators

- Card zones create visual grouping without breaking editorial rules
- Stats and action are co-located in one zone
- Most editorial of the three — closest to the original Press DNA
- Dot indicators on tab bar feel more native

---

## Implementation Notes

- Each concept is a standalone `.tsx` file in `src/pages/concepts/`
- Routes added to `app.tsx` at `/1`, `/2`, `/3`
- Loading state bypass for concept routes (matching existing `/press` pattern)
- No functional state/logic — static design mockups only
- Same Google Fonts import, same CSS keyframes, same animation patterns
