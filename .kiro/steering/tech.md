# Tech

- Vite + React + TypeScript, single-page app, fully static (no server).
- Styling: plain CSS with CSS variables (no UI framework); CSS/SVG animations.
  Respect `prefers-reduced-motion`. Sound is optional and off by default.
- State: React state + a small reducer; progress and best score in
  `localStorage` (wrapped in try/catch).
- Content lives in typed data files (`src/content/letters.ts`), validated by a
  schema test so every letter has a verdict, at least one red flag when it is
  phishing, and an explanation.
- Tests: Vitest. Game rules (scoring, lives, night generation, shuffling with a
  seed) must be pure functions with unit tests and property-based tests
  (fast-check).
- Accessibility: fully playable by keyboard, visible focus, sufficient
  contrast, all information also available as text (not colour only).
- Deploy: static hosting (Vercel or GitHub Pages). `npm run build` must
  produce a working `dist/`.
- License: MIT. Only original or permissively licensed assets; list any
  third-party asset in `CREDITS.md`.
