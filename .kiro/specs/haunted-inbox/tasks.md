# Haunted Inbox — Implementation Tasks

Ordered so that tests come before implementation, pure logic before components,
and each task is small and self-contained. Commit after every numbered task.

Legend:
- **Reqs:** requirement IDs from `requirements.md` this task satisfies.
- **Test-first:** write the test file, see it fail, then implement.

---

## Phase 0 — Project Scaffold

### Task 01 — Initialise Vite + React + TypeScript project

- Run `npm create vite@latest . -- --template react-ts` in the workspace root.
- Confirm `npm run dev` and `npm run build` succeed on the empty scaffold.
- **Reqs:** AC-13-01, AC-13-02

### Task 02 — Add Vitest and fast-check

- `npm install -D vitest @vitest/ui jsdom @testing-library/react fast-check`.
- Add a `test` script to `package.json`: `"vitest --run"`.
- Add a minimal smoke test (`src/game/smoke.test.ts`: `expect(1+1).toBe(2)`) to
  confirm the test runner works.
- **Reqs:** AC-13-03

### Task 03 — Set up directory structure and CSS entry point

- Create the directory skeleton:
  `src/game/`, `src/content/`, `src/components/`, `src/styles/`.
- Create `src/styles/variables.css` with the CSS custom properties from the
  design doc (colours, typography, motion variables including the
  `prefers-reduced-motion` override).
- Import `variables.css` in `main.tsx`.
- **Reqs:** AC-12-01

---

## Phase 1 — Data Layer

### Task 04 — Define TypeScript types

- Create `src/game/types.ts` with `Verdict`, `NightLetter`, `NightState`,
  `GameAction` as defined in the design doc.
- Create `src/content/redFlags.ts` with `RedFlagId`, `RedFlagDefinition`, and
  the full list of 7 red-flag definitions.
- No tests needed (pure type definitions).
- **Reqs:** AC-06-01, AC-10-01

### Task 05 — Write letter schema tests (test-first)

- Create `src/content/letters.test.ts`.
- Write tests that:
  - Import the (not-yet-existing) default export from `src/content/letters.ts`.
  - Assert every letter has non-empty `id`, `sender`, `senderEmail`, `subject`,
    `body`, `verdict`, `explanation`.
  - Assert every phishing letter has `redFlags.length >= 1`.
  - Assert pool size ≥ 15.
- Run `npm test` — expect failures.
- **Reqs:** AC-10-01, AC-10-02, AC-10-03, AC-10-05

### Task 06 — Author letter content

- Create `src/content/letters.ts` with ≥ 15 original letters (≥ 8 phishing, ≥ 5
  legit), all using invented names/companies (Gravewell Bank, Moonpost Courier,
  etc.). Include a header comment warning authors never to use real brands.
- Run `npm test` — schema tests should now pass.
- **Reqs:** AC-10-01 through AC-10-05, AC-02-01

---

## Phase 2 — Pure Game Logic (test-first throughout)

### Task 07 — PRNG and night generation tests

- Create `src/game/nightGen.test.ts`.
- Write unit tests:
  - `generateNight` returns exactly 10 items.
  - Result contains between 4 and 6 phishing letters (inclusive).
  - Legit count equals `10 - phishingCount` (i.e. between 4 and 6).
  - Same seed → same sequence (call twice, compare).
  - No duplicate `id` values in result.
- Write fast-check property tests:
  - For arbitrary seed (`fc.integer`): length invariant holds (always 10).
  - For arbitrary seed: phishing count is always in [4, 6].
  - For arbitrary seed: determinism holds (two calls with same seed are equal).
- Run `npm test` — expect failures.
- **Reqs:** AC-01-03, AC-01-04

### Task 08 — Implement PRNG and night generation

- Create `src/game/nightGen.ts`.
- Implement `mulberry32` and `generateNight`:
  - Shuffle each verdict bucket (phishing pool, legit pool) separately with
    Fisher-Yates using the seeded PRNG.
  - Pick a phishing count in [4, 6] by using `4 + (prng() % 3)` logic (integer
    from seeded PRNG, mapped to 0–2, added to 4).
  - Take that many phishing letters, fill the remaining slots with legit letters.
  - Merge and re-shuffle the combined 10 letters with the same PRNG.
- Run `npm test` — Task 07 tests should pass.
- **Reqs:** AC-01-03, AC-01-04

### Task 09 — Scoring tests

- Create `src/game/scoring.test.ts`.
- Write unit tests for `applyVerdict`:
  - Correct verdict: score +1, lives unchanged, streak +1.
  - Incorrect verdict: lives -1, score unchanged, streak resets to 0.
  - `maxStreak` updates only when `streakAfter > maxStreak`.
- Write fast-check property tests:
  - Lives never go below 0.
  - Score never decreases.
  - Correct answer never decreases lives.
  - Wrong answer always resets streak to 0.
- Run `npm test` — expect failures.
- **Reqs:** AC-07-02, AC-07-05, AC-08-01, AC-08-02

### Task 10 — Implement scoring

- Create `src/game/scoring.ts` with `applyVerdict`.
- Run `npm test` — Task 09 tests should pass.
- **Reqs:** AC-07-02, AC-07-05, AC-08-01, AC-08-02

### Task 11 — Summary calculation tests

- Create `src/game/summary.test.ts`.
- Write unit tests for `calcMissedFlags`:
  - Empty input → empty result.
  - All correct → empty result.
  - Multiple misses of one flag → that flag's count is correct.
  - Result is sorted by count descending.
- Write fast-check property test:
  - Sum of all miss counts ≤ total red flags across missed letters.
- Run `npm test` — expect failures.
- **Reqs:** AC-09-02, AC-09-03

### Task 12 — Implement summary calculation

- Create `src/game/summary.ts` with `calcMissedFlags`.
- Run `npm test` — Task 11 tests should pass.
- **Reqs:** AC-09-02, AC-09-03

### Task 13 — Reducer tests

- Create `src/game/reducer.test.ts`.
- Write unit tests:
  - `START_NIGHT`: initialises state correctly (lives=3, score=0, index=0,
    phase="playing").
  - `SUBMIT_VERDICT`: transitions to `phase="feedback"`, updates score/lives.
  - `NEXT_LETTER` with letters remaining: increments index, sets
    `phase="playing"`.
  - `NEXT_LETTER` after last letter: sets `phase="summary"`.
  - `NEXT_LETTER` when lives=0: sets `phase="summary"`.
  - `PLAY_AGAIN`: resets to initial playing state with new letters.
- Run `npm test` — expect failures.
- **Reqs:** AC-01-02, AC-06-06, AC-07-04, AC-09-01, AC-09-04

### Task 14 — Implement reducer

- Create `src/game/reducer.ts` with `gameReducer` and initial state factory.
- Create `src/game/storage.ts` with `loadBestScore` / `saveBestScore`
  (try/catch around localStorage).
- Run `npm test` — Task 13 tests should pass.
- **Reqs:** AC-01-02, AC-06-06, AC-07-04, AC-08-04, AC-08-05, AC-09-01

---

## Phase 3 — Core UI Components (no animations yet)

### Task 15 — CSS animations file and theme smoke-test

- Create `src/styles/animations.css` with `@keyframes` for flame flicker,
  letter slide-in, candle snuff, and curse-mark reveal.
- Verify the build still passes (`npm run build`).
- **Reqs:** AC-02-03, AC-04-02, AC-07-02, AC-12-03

### Task 16 — HUD component

- Create `src/components/HUD.tsx`.
- Props: `lives: number`, `score: number`, `streak: number`,
  `letterIndex: number`, `nightLength: number`.
- Renders: 3 `CandleIcon` elements (lit/unlit based on `lives`), score, streak,
  letter counter "Letter N of 10".
- Candle icons are SVG inline or via a `CandleIcon` sub-component in the same
  file.
- Candle state change must have an `aria-live="polite"` region announcing lost
  candles (see AC-07-03).
- **Reqs:** AC-02-04, AC-07-01, AC-07-02, AC-07-03, AC-08-03

### Task 17 — LinkField component

- Create `src/components/LinkField.tsx`.
- Props: `link: LetterLink`.
- Renders display text as a `<span>` with `tabIndex={0}` and `role="button"`.
- On hover (mouseenter/mouseleave) shows/hides a `<span role="tooltip">` with
  `realUrl`.
- On click or tap (`onClick`) toggles the tooltip open/closed so touch devices
  can reveal the real URL without hover.
- On keyboard focus/blur, shows/hides the tooltip (same as hover).
- Uses `aria-describedby` to associate the tooltip with the trigger element.
- Never renders an `<a>` tag.
- **Reqs:** AC-03-01, AC-03-02, AC-03-03, AC-03-04

### Task 18 — LetterCard component

- Create `src/components/LetterCard.tsx`.
- Props: `letter: Letter`, `isInspecting: boolean`.
- Renders sender, senderEmail, subject, body, and `<LinkField>` if
  `letter.link` is present.
- Applies CSS class `.inspecting` when `isInspecting` is true (triggers
  curse-mark styling).
- Slide-in animation applied via CSS class on mount.
- **Reqs:** AC-02-01, AC-02-02, AC-02-03, AC-04-02

### Task 19 — CandleInspectButton component

- Create `src/components/CandleInspectButton.tsx`.
- Props: `onInspectStart: () => void`, `onInspectEnd: () => void`.
- Handles `pointerdown` / `pointerup` / `pointerleave` for mouse.
- Handles `keydown` (Space/Enter) / `keyup` for keyboard.
- Renders a `<button>` with label "Hold to Candle".
- **Reqs:** AC-04-01, AC-04-04, AC-04-05

### Task 20 — ActionBar component

- Create `src/components/ActionBar.tsx`.
- Props: `onDeliver: () => void`, `onBurn: () => void`.
- Two `<button>` elements: "Deliver" and "Burn".
- Each has a distinct icon (inline SVG or emoji) in addition to the text label
  to meet AC-05-05 (not colour-only).
- Both focusable and activatable via keyboard.
- **Reqs:** AC-05-01 through AC-05-05

### Task 21 — FeedbackPanel component

- Create `src/components/FeedbackPanel.tsx`.
- Props: `letter: Letter`, `playerVerdict: Verdict`, `onNext: () => void`.
- Derives `correct = playerVerdict === letter.verdict`.
- Displays correct/wrong indicator (text label + class).
- Maps `letter.redFlags` to `RedFlagDefinition` objects and renders a list.
- Renders `letter.explanation`.
- "Next Letter" button calls `onNext`.
- All content is text-based (no colour-only state).
- **Reqs:** AC-06-01 through AC-06-06

### Task 22 — SummaryScreen component

- Create `src/components/SummaryScreen.tsx`.
- Props: `state: NightState`, `bestScore: number`, `onPlayAgain: () => void`.
- Calls `calcMissedFlags(state.letters)` and renders the result.
- Displays score, maxStreak, lives remaining, bestScore.
- "Play Again" button calls `onPlayAgain`.
- **Reqs:** AC-09-01 through AC-09-05

### Task 23 — WelcomeScreen component

- Create `src/components/WelcomeScreen.tsx`.
- Props: `bestScore: number`, `onBegin: () => void`.
- Displays game title, tagline, best score (if > 0), and "Begin Night" button.
- **Reqs:** AC-01-01, AC-01-02, AC-09-05

---

## Phase 4 — App Wiring

### Task 24 — DeskScene layout

- Create `src/components/DeskScene.tsx`.
- Assembles `HUD`, `LetterCard`, `CandleInspectButton`, `ActionBar` with the
  desk and candle visual layout.
- Manages `isInspecting` boolean in local state.
- Receives `nightState` and `dispatch` as props.
- **Reqs:** AC-04-01 through AC-04-05

### Task 25 — App root wiring

- Update `src/App.tsx`:
  - `useReducer(gameReducer, …)` for `NightState`.
  - `useState` for `hasStarted` and `bestScore`.
  - On mount: call `loadBestScore` and set state.
  - After each `SUBMIT_VERDICT` where the night ends: call `saveBestScore` if
    score exceeds current best.
  - Renders `WelcomeScreen`, `DeskScene`, `FeedbackPanel`, or `SummaryScreen`
    based on `hasStarted` and `nightState.phase`.
  - `aria-live` region for dynamic announcements wired through here.
- **Reqs:** AC-01-01, AC-01-02, AC-06-06, AC-08-04, AC-08-05, AC-09-04

---

## Phase 5 — Polish and Accessibility Pass

### Task 26 — Candle and flame SVG art

- Create `public/candle.svg` (or inline SVG in `CandleIcon`): parchment-style
  with flame.
- Apply `@keyframes candleFlicker` animation to the flame element.
- Ensure `prefers-reduced-motion` suppresses animation (via CSS variable
  transition duration = 0).
- **Reqs:** AC-12-02, AC-12-03, AC-04-02

### Task 27 — Desk background and letter parchment styling

- Style `DeskScene` and `LetterCard` with the parchment and dark-wood theme
  using CSS variables.
- Letter slide-in animation (class added on mount, removed on unmount).
- **Reqs:** AC-02-03, AC-12-01, AC-12-02

### Task 28 — Accessibility audit

- Review every interactive element for visible focus ring (uses `--color-focus`
  outline).
- Confirm `aria-live` regions fire for: candle loss, correct/wrong feedback,
  new letter arrival.
- Run keyboard-only walkthrough: Tab through welcome → play → feedback →
  summary.
- Fix any issues found.
- **Reqs:** AC-11-01 through AC-11-05

### Task 29 — Reduced-motion audit

- Test with `prefers-reduced-motion: reduce` in browser DevTools.
- Confirm no animations run; letter appears instantly, candle is static,
  feedback panel appears instantly.
- **Reqs:** AC-02-03, AC-04-02, AC-12-03

### Task 30 — Optional sound toggle

- If sound effects are added: implement an `<AudioToggle>` button that is off
  by default and persists preference in `localStorage`.
- If no audio: add a note in `CREDITS.md` that audio is out of scope.
- **Reqs:** AC-12-04

---

## Phase 6 — Build, Deploy, and Housekeeping

### Task 31 — Verify build

- Run `npm run build` and confirm `dist/` is a working static site.
- Run `npm test` and confirm all tests pass.
- **Reqs:** AC-13-01, AC-13-02, AC-13-03

### Task 32 — CREDITS.md and LICENSE

- Create `CREDITS.md` listing any third-party assets (fonts, SVGs, audio).
- Confirm `LICENSE` (MIT) is present.
- **Reqs:** (project requirement from tech.md)

### Task 33 — Deploy configuration

- Add `vite.config.ts` with `base: "./"`.
- Add either `vercel.json` (empty `{}` is sufficient for Vercel) or
  `.github/workflows/deploy.yml` for GitHub Pages.
- **Reqs:** AC-13-01, AC-13-02

### Task 34 — README update

- Update `README.md` with: project description, how to run (`npm run dev`),
  how to test (`npm test`), how to build (`npm run build`), deploy target.
- **Reqs:** (project hygiene)

---

## Task Dependency Summary

```
01 → 02 → 03
         ↓
        04 → 05 → 06
                   ↓
        07 → 08
        09 → 10
        11 → 12
        13 → 14
                   ↓
        15 → 16 → 17 → 18 → 19 → 20 → 21 → 22 → 23
                                                    ↓
                                              24 → 25
                                                    ↓
                                        26 → 27 → 28 → 29 → 30
                                                              ↓
                                                    31 → 32 → 33 → 34
```

Phases 2 tasks (07–14) are independent of each other and can proceed in any
order once Phase 1 (04–06) is complete. Phase 3 components (16–23) can be
developed in parallel once types (04) exist.
