# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev            # Start Vite dev server with HMR
pnpm build          # TypeScript compile + Vite production build
pnpm typecheck      # TypeScript type checking only (tsc -b)
pnpm lint           # ESLint check
pnpm lint:fix       # ESLint auto-fix
pnpm format         # Prettier format all files
pnpm format:check   # Prettier check formatting
pnpm test           # Vitest single run
pnpm test:watch     # Vitest watch mode
```

Run a single test file: `pnpm vitest run tests/app.test.tsx`

## Architecture

**Stack**: Preact + TypeScript + Vite 7 + Tailwind CSS 4

- **UI framework**: Preact (not React) — uses `class` instead of `className` in JSX, `jsxImportSource` is `preact`
- **State management**: `@preact/signals` — reactive state via `signal()`, accessed with `.value`
- **Styling**: Tailwind CSS v4 via Vite plugin, class ordering enforced by prettier-plugin-tailwindcss

**TypeScript project references** (three separate tsconfigs):

- `tsconfig.app.json` — `src/` (app code, DOM types, Preact JSX)
- `tsconfig.node.json` — `vite.config.ts` and other build tool configs
- `tsconfig.test.json` — `tests/` (vitest globals types)

**Preact/React compatibility**: `tsconfig.app.json` maps `react` and `react-dom` imports to `preact/compat` via path aliases. Libraries that import from React will work transparently.

## Project Layout

- `src/` — Application source code
- `tests/` — Test files (`*.test.tsx`) and `test-setup.ts`
- Config files use `.config.ts` format (ESLint, Prettier, Vite)

## Skills

- **`/preact-signals`**: MUST be invoked whenever implementing or modifying state management — this includes creating signals, computed values, effects, batched updates, or any `@preact/signals` usage.
- **`/frontend-design`**: MUST be invoked when building web components, pages, or applications — guides creation of distinctive, production-grade frontend interfaces with high design quality.

## Testing

Tests use **Vitest** with **jsdom** environment and **@testing-library/preact**. The setup file (`tests/test-setup.ts`) registers jest-dom matchers and runs DOM cleanup after each test.
