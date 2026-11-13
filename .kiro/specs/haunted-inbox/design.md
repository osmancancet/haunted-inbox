# Haunted Inbox — Design

## 1. Tech Stack Summary

| Concern | Choice |
|---|---|
| Bundler / dev server | Vite 5 |
| UI | React 18 + TypeScript strict |
| Styling | Plain CSS with CSS custom properties; no UI library |
| State | `useReducer` at `App` level; `localStorage` for persistence |
| Testing | Vitest + fast-check (property-based) |
| Deploy | Static — `dist/` to Vercel or GitHub Pages |

---

## 2. Data Model

### 2.1 Red-Flag Types

```ts
// src/content/redFlags.ts
export type RedFlagId =
  | "urgency"
  | "spoofed_sender"
  | "mismatched_link"
  | "credential_request"
  | "too_good_to_be_true"
  | "unexpected_attachment"
  | "authority_pressure";

export interface RedFlagDefinition {
  id: RedFlagId;
  name: string;          // Short display name, e.g. "Spoofed Sender"
  description: string;   // One sentence, e.g. "The reply-to domain differs from…"
}
```

### 2.2 Letter

```ts
// src/content/letters.ts
export type Verdict = "legit" | "phishing";

export interface LetterLink {
  displayText: string;   // What the reader sees
  realUrl: string;       // The underlying destination (text only, never an href)
}

export interface Letter {
  id: string;             // Unique slug, e.g. "gravewell-bank-01"
  sender: string;         // Display name, e.g. "Gravewell Bank"
  senderEmail: string;    // Fictional address
  subject: string;
  body: string;
  link?: LetterLink;
  verdict: Verdict;
  redFlags: RedFlagId[];  // Empty array for legit letters
  explanation: string;    // Specific signal + safe action — no absolute claims
  difficulty: 1 | 2 | 3; // 1 = obvious, 3 = hinges on a single inspected detail
}
```

### 2.3 Night

A night is not persisted as a type in `localStorage`; it is computed fresh
each session. It carries runtime state.

```ts
// src/game/types.ts
export interface NightLetter {
  letter: Letter;
  playerVerdict: Verdict | null;   // null = not yet judged
}

export interface NightState {
  seed: number;
  letters: NightLetter[];          // length === 10
  currentIndex: number;            // 0-9
  lives: number;                   // 0-3
  score: number;
  streak: number;
  maxStreak: number;
  phase: "playing" | "feedback" | "summary";
}
```

### 2.4 localStorage Shape

```ts
interface PersistedData {
  bestScore: number;    // best score across all completed nights (out of 10)
}
```

---

## 3. Pure Game-Logic Module (`src/game/`)

All functions here are pure (no side effects, no React imports). Every function
gets a unit test; scoring and night generation also get property-based tests.

### 3.1 Seeded PRNG and Night Generation

```ts
// src/game/nightGen.ts

/** Mulberry32 — fast, seedable, deterministic 32-bit PRNG. */
export function mulberry32(seed: number): () => number { … }

/**
 * Pick `count` items from `pool` using the PRNG derived from `seed`.
 * Returns items in a shuffled order (Fisher-Yates).
 * Guarantees between 4 and 6 phishing letters (inclusive) in a 10-letter
 * night. Strategy: shuffle each verdict bucket separately, take a random
 * count in [4,6] from phishing, fill the remainder from legit, then
 * merge and re-shuffle. After selection the 10 letters are sorted by
 * difficulty (ascending) with a secondary shuffle to avoid identical
 * orderings — ensuring average difficulty of the last 3 ≥ average of
 * the first 3.
 */
export function generateNight(
  pool: Letter[],
  seed: number,
  count: number = 10
): Letter[] { … }
```

Property-based tests (fast-check):
- For any valid seed the result always has exactly `count` items.
- The phishing count in the result is always between 4 and 6 inclusive.
- Same seed always produces same sequence (determinism).
- No duplicate letter ids in a single night.
- Average difficulty of last 3 letters ≥ average difficulty of first 3.

### 3.2 Scoring

```ts
// src/game/scoring.ts

export interface ScoringResult {
  correct: boolean;
  livesAfter: number;
  scoreAfter: number;
  streakAfter: number;
  maxStreakAfter: number;
}

export function applyVerdict(
  state: Pick<NightState, "lives" | "score" | "streak" | "maxStreak">,
  letter: Letter,
  playerVerdict: Verdict
): ScoringResult { … }
```

Rules implemented in `applyVerdict`:
- Correct if `playerVerdict === letter.verdict`.
- Correct → `scoreAfter = score + 1`, `streakAfter = streak + 1`.
- Incorrect → `livesAfter = lives - 1`, `streakAfter = 0`.
- `maxStreakAfter = Math.max(maxStreak, streakAfter)`.

Property-based tests (fast-check):
- Lives never go below 0.
- Score never exceeds the number of letters judged.
- Streak always resets to 0 on a wrong answer.
- Correct answers never decrease lives.

### 3.3 Summary Calculation

```ts
// src/game/summary.ts

export interface MissedFlag {
  flagId: RedFlagId;
  count: number;
}

/**
 * Returns the red-flag types the player missed most, sorted descending.
 * A flag is "missed" when a phishing letter was incorrectly delivered
 * and that flag was in the letter's redFlags list.
 */
export function calcMissedFlags(letters: NightLetter[]): MissedFlag[] { … }
```

### 3.4 Night Lifecycle

```ts
// src/game/reducer.ts

export type GameAction =
  | { type: "START_NIGHT"; seed: number; letters: Letter[] }
  | { type: "SUBMIT_VERDICT"; verdict: Verdict }
  | { type: "NEXT_LETTER" }
  | { type: "PLAY_AGAIN" };

export function gameReducer(state: NightState, action: GameAction): NightState { … }
```

The reducer delegates to the pure functions above. No async, no I/O.

---

## 4. Component Tree

```
App
├── HUD                       lives, score, streak, letter counter
├── WelcomeScreen             shown before first letter
├── DeskScene                 animated desk, candle
│   ├── CandleGroup           3 × CandleIcon (SVG, animated flame)
│   ├── LetterCard            parchment envelope appearance
│   │   ├── LetterHeader      sender, address, subject
│   │   ├── LetterBody        body text
│   │   └── LinkField         display URL + tooltip with realUrl
│   ├── CandleInspectButton   "Hold to Candle" — reveals curse marks
│   └── ActionBar             Deliver button + Burn button
├── FeedbackPanel             correct/wrong + red flags + explanation
│   └── RedFlagList           one RedFlagItem per flag
└── SummaryScreen             score, streak, missed flags, best score
    └── MissedFlagList
```

### Component responsibilities

**App** — holds `NightState` via `useReducer(gameReducer, …)`, reads/writes
`localStorage`, provides dispatch via context or prop-drilling (small tree).

**HUD** — purely presentational; receives score, streak, lives, letterIndex,
nightLength as props.

**DeskScene** — layout wrapper; passes inspection state down to `LetterCard`.

**LetterCard** — receives a `Letter` and an `isInspecting: boolean` prop. When
`isInspecting` is true it applies the CSS class `.inspecting` which triggers the
curse-mark reveal styling. Contains no game logic.

**LinkField** — renders link display text; on hover/focus shows a `<span
role="tooltip">` with `realUrl`. On click/tap, toggles the tooltip open and
closed (so touch devices without hover can also reveal the real URL). Never
renders an `<a>` tag.

**CandleInspectButton** — fires `onInspectStart` / `onInspectEnd` callbacks
(pointerdown/pointerup, keydown Space/Enter / keyup). Inspection state lives in
`DeskScene` or `App`.

**ActionBar** — Deliver and Burn buttons; calls `dispatch({ type:
"SUBMIT_VERDICT", verdict })`.

**FeedbackPanel** — shown when `phase === "feedback"`; maps `letter.redFlags`
to `RedFlagDefinition` objects from `src/content/redFlags.ts`.

**SummaryScreen** — shown when `phase === "summary"`; calls `calcMissedFlags`.

---

## 5. State Machine Summary

```
welcome ──[BEGIN_NIGHT]──► playing
  playing ──[SUBMIT_VERDICT]──► feedback
  feedback ──[NEXT_LETTER, letters remain]──► playing
  feedback ──[NEXT_LETTER, all done OR lives=0]──► summary
  summary ──[PLAY_AGAIN]──► welcome (or playing)
```

The `phase` field on `NightState` drives which top-level screen is rendered.
The welcome phase is a separate boolean (`hasStarted`) in `App` state to avoid
polluting `NightState` with UI-only state.

---

## 6. Theming — CSS Variables

All variables live in `src/styles/variables.css`, imported once in `main.tsx`.

```css
:root {
  /* Colours */
  --color-bg:          #1a1008;   /* dark wood / night */
  --color-surface:     #2e1f0e;   /* desk surface */
  --color-parchment:   #e8d9b0;   /* letter background */
  --color-ink:         #2b1d0e;   /* letter text */
  --color-candle:      #f5a623;   /* flame yellow */
  --color-accent:      #8b2500;   /* wax seal red */
  --color-correct:     #4a7c59;   /* green, used with text label too */
  --color-wrong:       #8b2500;   /* red, used with text label too */
  --color-focus:       #f5e642;   /* visible focus ring */

  /* Typography */
  --font-body:         'IM Fell English', Georgia, serif;
  --font-ui:           system-ui, sans-serif;
  --font-size-base:    1rem;

  /* Motion */
  --transition-letter: 0.4s ease-out;
  --transition-candle: 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  --transition-letter: 0s;
  --transition-candle: 0s;
}
```

Additional files:
- `src/styles/animations.css` — `@keyframes` for flame flicker, letter slide,
  candle snuff.
- `src/styles/components.css` — component-scoped styles (or co-located `.css`
  files next to each component if preferred).

---

## 7. Animations

| Animation | Implementation | Reduced-motion fallback |
|---|---|---|
| Letter slide-in | CSS `transform: translateY` + `opacity`, triggered by class | Instant display |
| Candle flicker | SVG `<animate>` or `@keyframes` on flame path | Static flame |
| Candle snuff | Keyframe that shrinks flame to zero | Immediate hide |
| Curse-mark reveal | Keyframe overlay opacity pulse | Static opacity reveal |
| Feedback pop | Scale + opacity on FeedbackPanel | Immediate show |

---

## 8. Testing Strategy

### 8.1 Unit Tests (Vitest)

Located alongside the module under test (e.g., `src/game/scoring.test.ts`).

| Test file | What it covers |
|---|---|
| `scoring.test.ts` | applyVerdict: correct/incorrect, lives floor, streak reset |
| `nightGen.test.ts` | generateNight: count, determinism, composition guarantee |
| `summary.test.ts` | calcMissedFlags: sorting, empty input, all-correct input |
| `reducer.test.ts` | gameReducer: state transitions for all action types |

### 8.2 Property-Based Tests (fast-check)

Also in the same test files, using `fc.assert(fc.property(…))`.

| Property | Generators |
|---|---|
| `generateNight` length invariant | `fc.integer({ min: 0, max: 2^32 })` as seed |
| Phishing count in [4, 6] | Same seed generator |
| Difficulty ramp: avg(last 3) ≥ avg(first 3) | Same seed generator |
| Determinism | Same seed → same output |
| `applyVerdict` lives ≥ 0 | Arbitrary `NightState` subsets |
| `applyVerdict` score monotone on correct | Correct verdict inputs |
| `calcMissedFlags` total count ≤ letters judged | Arbitrary `NightLetter[]` |

### 8.3 Schema / Content Tests (Vitest)

Located at `src/content/letters.test.ts`.

Validates every `Letter` in the pool at import time:
- Required fields non-empty.
- `verdict === "phishing"` ⇒ `redFlags.length ≥ 1`.
- `explanation` non-empty.
- `difficulty` is 1, 2, or 3; ≥ 6 letters per tier.
- Pool size ≥ 30 (≥ 14 phishing, ≥ 12 legit).
- ≥ 40% of legit letters have a link whose `realUrl` host matches sender domain.
- ≥ 25% of phishing letters have no link.
- Every `RedFlagId` used in the pool appears in ≥ 3 phishing letters.
- No `realUrl` contains `phish`, `harvest`, `steal`, `capture`, or `creds`.
- No domain suffix `.gov`, `.gov.uk`, `.co.uk`, or `.edu` in emails or URLs.

### 8.4 Component Tests

Not in scope for initial implementation. Consider React Testing Library for
FeedbackPanel and SummaryScreen if time allows.

---

## 9. localStorage Integration

```ts
// src/game/storage.ts
const KEY = "haunted-inbox-best";

export function loadBestScore(): number {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "0") as number; }
  catch { return 0; }
}

export function saveBestScore(score: number): void {
  try { localStorage.setItem(KEY, JSON.stringify(score)); }
  catch { /* silent */ }
}
```

Called in `App` on mount (load) and in the reducer's `PLAY_AGAIN` / summary
display (save). The reducer itself does not call storage; `App` calls the
storage helpers after `dispatch`.

---

## 10. Build and Deploy

- `vite.config.ts` sets `base: "./"` for relative asset paths (compatible with
  GitHub Pages subdirectory deploys).
- `.github/workflows/deploy.yml` or `vercel.json` for deployment config.
- `npm run build` → `dist/`.
- `npm test` → `vitest --run`.
