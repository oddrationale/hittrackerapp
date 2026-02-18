---
name: preact-signals
description: Guide for using @preact/signals for reactive state management in Preact applications. Use when implementing state management with signals, creating reactive UI components, working with computed/derived state, managing effects and side effects, or any time signals are being used or should be used in a Preact codebase. Triggers on signal(), computed(), effect(), batch(), useSignal(), useComputed(), useSignalEffect(), createModel(), or any @preact/signals import.
---

# Preact Signals

Reactive state primitives for Preact. Signals auto-track dependencies and update only the affected DOM nodes.

Full reference: https://raw.githubusercontent.com/preactjs/preact-www/refs/heads/master/content/en/guide/v10/signals.md

## Installation

```bash
npm install @preact/signals
```

## Core API

### signal(initialValue) — Mutable reactive value

```js
import { signal } from "@preact/signals";

const count = signal(0);
count.value; // read (subscribes in components/effects)
count.value = 1; // write (triggers updates)
count.peek(); // read WITHOUT subscribing
```

### computed(fn) — Read-only derived signal

```js
import { signal, computed } from "@preact/signals";

const todos = signal([{ text: "Buy milk", completed: true }]);
const completed = computed(() => todos.value.filter((t) => t.completed).length);
```

### effect(fn) — Side effects outside components

```js
import { signal, effect } from "@preact/signals";

const name = signal("Jane");

// Runs when any accessed signal changes; returns dispose function
const dispose = effect(() => {
  console.log(name.value);
  return () => {
    /* cleanup before next run */
  };
});

dispose(); // stop the effect
```

### batch(fn) — Combine multiple updates into one commit

```js
import { signal, batch } from "@preact/signals";

const a = signal(0);
const b = signal(0);

batch(() => {
  a.value = 1;
  b.value = 2;
}); // single update flush
```

### untracked(fn) — Read signals without subscribing

```js
import { signal, effect, untracked } from "@preact/signals";

const delta = signal(0);
const count = signal(0);

effect(() => {
  count.value = untracked(() => count.value + delta.value);
});
```

## Hook Variants (inside components)

| Hook                  | Equivalent        | Purpose                          |
| --------------------- | ----------------- | -------------------------------- |
| `useSignal(init)`     | `signal(init)`    | Component-local mutable signal   |
| `useComputed(fn)`     | `computed(fn)`    | Component-local derived signal   |
| `useSignalEffect(fn)` | `effect(fn)`      | Side effect tied to component    |
| `useModel(Model)`     | `new Model()`     | Model instance with auto-dispose |

```jsx
import { useSignal, useComputed } from "@preact/signals";

function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>
        {count} x 2 = {double}
      </p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
```

## Key Patterns

### Pass signal directly in JSX for optimized rendering

```jsx
// BAD: re-renders entire component on change
<p>{count.value}</p>

// GOOD: updates only the text node, skips VDOM diffing
<p>{count}</p>
```

### Global state with factory function (testable)

```jsx
function createAppState() {
  const todos = signal([]);
  const completed = computed(
    () => todos.value.filter((t) => t.completed).length,
  );
  return { todos, completed };
}
```

### Share state via Context

```jsx
import { createContext } from "preact";
import { useContext } from "preact/hooks";

const AppState = createContext();

// Provider
<AppState.Provider value={createAppState()}>
  <App />
</AppState.Provider>;

// Consumer
function App() {
  const state = useContext(AppState);
  return <p>{state.completed}</p>;
}
```

### Models — encapsulate complex state

```js
import { signal, computed, createModel } from "@preact/signals";

const CounterModel = createModel((initial = 0) => {
  const count = signal(initial);
  const doubled = computed(() => count.value * 2);

  return {
    count,
    doubled,
    increment() {
      count.value++;
    },
  };
});

const counter = new CounterModel(5);
counter.increment();
counter[Symbol.dispose](); // cleanup effects
```

Use `useModel(CounterModel)` in components for auto-dispose on unmount.

### Immutable updates for arrays/objects

Signals only trigger updates on reference change:

```js
// WRONG: mutates in place, no update
todos.value.push(newTodo);

// RIGHT: new array reference
todos.value = [...todos.value, newTodo];
```

### Equality check skips no-op updates

```js
const count = signal(0);
count.value = 0; // does nothing, value unchanged
```

## Utility Components (`@preact/signals/utils`)

```jsx
import { Show, For } from "@preact/signals/utils";

// Conditional rendering
<Show when={isVisible} fallback={<p>Hidden</p>}>
  <p>Visible</p>
</Show>

// List rendering with caching
<For each={items} fallback={<p>Empty</p>}>
  {(item, index) => <div key={index}>{item}</div>}
</For>
```

## Rules

1. Always access `.value` to read/write (except when passing signal directly into JSX)
2. Use `.peek()` or `untracked()` to avoid unwanted subscriptions
3. Use `batch()` when updating multiple signals together
4. Always `dispose()` effects and models when done (or use hooks for auto-cleanup)
5. Derive state with `computed()` instead of duplicating — single source of truth
6. Use hook variants (`useSignal`, `useComputed`, `useSignalEffect`) inside components; use bare functions (`signal`, `computed`, `effect`) outside
