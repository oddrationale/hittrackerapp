# What is HIT Tracker?

HIT Tracker is a workout tracking app purpose-built for **High-Intensity Training (HIT)** — a training methodology where you perform a single set per exercise, pushing to momentary muscular failure. The key metric in HIT isn't reps or sets; it's **Time-Under-Load (TUL)**, the total number of seconds your muscles are under tension during that one all-out set.

Traditional fitness apps are designed around the reps-and-sets model and don't natively support TUL as a first-class metric. HIT Tracker fills that gap.

## The Problem

HIT practitioners need to:

- Time each exercise precisely (TUL in seconds)
- Track the weight used and whether to increase, decrease, or maintain it next session
- See their TUL and weight progression over time per exercise
- Keep workouts structured via routines (ordered lists of exercises)
- Have all of this work offline and on their phone, since they're in a gym

There's no mainstream app that treats TUL as the primary unit of measurement or provides the specific workflow HIT demands.

## How It Works

### Before a Workout

The user builds an **exercise library** (e.g., Leg Press, Chest Press, Pulldown) and organizes exercises into **routines** (e.g., "Full Body A" with 6 exercises in a specific order). They can also skip routines and do freeform sessions, picking exercises on the fly.

### During a Workout

1. The user selects a routine (or freeform) and starts the workout. A total workout clock begins.
2. For each exercise, the user taps "Start Exercise." A 3-second countdown begins (with an optional metronome ticking each second for pacing).
3. The timer runs until the user hits "Stop" — this records the TUL.
4. The user logs the weight used, optional rep count, and optional notes.
5. The user marks a **weight direction** — should they increase, decrease, or maintain the weight next time? This is a core HIT decision point.
6. They move to the next exercise in the routine, or pick another if freeform.
7. When all exercises are done, they finish the workout and see a summary.

### After a Workout

The workout summary shows total TUL, total workout time, and the **TUL ratio** (total TUL divided by total workout time — a measure of workout density/efficiency). All data is saved locally.

### Over Time

The user can review their history, see past workouts grouped by date, and drill into individual workout details. A stats dashboard provides charts showing TUL progression, weight progression, workout frequency, and TUL ratio trends — filterable by exercise and date range. Summary cards show totals, averages, and streak information.

## Data Ownership

HIT Tracker follows a local-first, user-owned data model. All data lives on the device (e.g., in the browser's IndexedDB). Users can export their entire dataset as a JSON file and import it on another device. There are no accounts, no cloud sync, and no server dependency. The app works fully offline after the first load.
