# Haunted Inbox — Requirements

## Overview

Haunted Inbox is a single-page browser game. The player works the night shift
sorting letters in a haunted manor, deciding whether each one is legitimate or
a "cursed" (phishing) letter. The game teaches practical social-engineering
awareness through 10-letter nights, candle-based lives, and educational
feedback.

---

## User Stories and Acceptance Criteria

The acceptance criteria use EARS notation:

- **Ubiquitous:** `The system shall …`
- **Event-driven:** `When <trigger>, the system shall …`
- **Unwanted behaviour:** `If <condition>, the system shall …`
- **State-driven:** `While <state>, the system shall …`
- **Optional feature:** `Where <feature is included>, the system shall …`

---

### US-01 — Start a Night

As a player, I want to start a new 10-letter night so that I can begin
playing.

**Acceptance criteria**

- AC-01-01: When the player opens the app for the first time, the system shall
  display a welcome screen with a "Begin Night" button before any letter is
  shown.
- AC-01-02: When the player clicks or activates "Begin Night", the system shall
  deal the first letter of the night onto the desk.
- AC-01-03: The system shall generate a night of exactly 10 letters from the
  full letter pool, shuffled with a seeded pseudo-random function so that the
  same seed always produces the same sequence.
- AC-01-04: The system shall ensure each night contains between 4 and 6
  phishing letters (inclusive), with the remainder being legitimate letters
  (i.e. 4–6 phishing and 4–6 legit out of 10).
- AC-01-05: The system shall order the 10 letters so that difficulty ramps up
  across the night: the average `difficulty` of the last 3 letters shall be
  greater than or equal to the average `difficulty` of the first 3 letters.

---

### US-02 — Read a Letter

As a player, I want to see the full content of a letter so that I can judge
whether it is legitimate.

**Acceptance criteria**

- AC-02-01: The system shall display each letter with: sender name, sender
  email address, subject line, body text, and an optional link field.
- AC-02-02: The system shall render all links as non-interactive text so that
  no link is ever a real, clickable hyperlink.
- AC-02-03: When a letter slides onto the desk, the system shall animate the
  arrival (slide-in) using a CSS transition. While `prefers-reduced-motion` is
  active, the system shall display the letter without motion transitions.
- AC-02-04: The system shall display a letter counter ("Letter N of 10") so the
  player always knows their progress.

---

### US-03 — Inspect a Link

As a player, I want to reveal a link's real destination by hovering, focusing,
or tapping it so that I can spot mismatched URLs on any device.

**Acceptance criteria**

- AC-03-01: When the player hovers over a link field (or focuses it via
  keyboard), the system shall show a tooltip or expanded text revealing the
  link's `realUrl` property alongside the display text.
- AC-03-02: The system shall make this tooltip accessible: it shall be
  reachable by keyboard focus (Tab key) and readable by a screen reader via an
  `aria-describedby` or `role="tooltip"` pattern.
- AC-03-03: The system shall never use the link as an `<a href>` with a real
  destination; both the display URL and real URL shall be rendered as text only.
- AC-03-04: When the player taps or clicks the link field on a touch device (or
  with a mouse), the system shall toggle the tooltip open and closed so that the
  real URL is revealed without requiring hover or persistent focus.

---

### US-04 — Reveal Curse Marks (Candle Inspection)

As a player, I want to hold the letter to the candle to reveal hidden red
flags so that I have a tool to find clues before deciding.

**Acceptance criteria**

- AC-04-01: The system shall display a "Hold to Candle" button (or equivalent
  interaction) on each letter screen.
- AC-04-02: While the player holds the button (mouse down or key held), the
  system shall visually reveal the curse-mark overlay on the letter (e.g., a
  glow or highlighted phrases). While `prefers-reduced-motion` is active, the
  system shall use a non-motion reveal (e.g., opacity fade or static highlight)
  instead of an animated flicker.
- AC-04-03: The system shall not expose the verdict or the red-flag labels
  while the candle inspection is active; it shall only show stylistic highlights
  that hint at suspicious regions.
- AC-04-04: When the player releases the button, the system shall hide the
  curse-mark overlay.
- AC-04-05: The candle inspection shall be operable with a keyboard (e.g., Space
  or Enter held down).

---

### US-05 — Deliver or Burn

As a player, I want to choose "Deliver" or "Burn" for each letter so that I
can register my verdict.

**Acceptance criteria**

- AC-05-01: The system shall display two clearly labelled actions—"Deliver" and
  "Burn"—while a letter is on the desk.
- AC-05-02: When the player activates "Deliver", the system shall record the
  verdict `"legit"` for that letter.
- AC-05-03: When the player activates "Burn", the system shall record the
  verdict `"phishing"` for that letter.
- AC-05-04: The system shall be fully operable by keyboard: the Deliver and
  Burn buttons shall be focusable and activatable via Enter or Space.
- AC-05-05: The system shall provide sufficient colour contrast (WCAG AA ≥ 4.5:1
  for text) and shall not rely on colour alone to distinguish Deliver from Burn;
  each action shall also carry a distinct icon or label.

---

### US-06 — Receive Feedback

As a player, I want to see which red flags were present and a one-sentence
lesson after each decision so that I can learn from my answer.

**Acceptance criteria**

- AC-06-01: When the player submits a verdict, the system shall immediately
  display a feedback panel showing: correct/incorrect indicator, the list of
  red flags that were present (each identified by name and a short description),
  and a one-sentence lesson from the letter's `explanation` field.
- AC-06-02: When the verdict is correct, the system shall display a positive
  indicator (text label such as "Correct!" and a visual flourish).
- AC-06-03: When the verdict is incorrect, the system shall display a negative
  indicator (text label such as "Wrong!" and snuff one candle).
- AC-06-04: If a letter is legitimate (no red flags), the feedback panel shall
  confirm it was safe and show the explanation.
- AC-06-05: The system shall make all feedback content available as text; it
  shall not rely solely on colour or animation to convey whether the answer
  was correct.
- AC-06-06: When the player confirms the feedback (button "Next Letter" or
  keyboard), the system shall advance to the next letter or to the end-of-night
  summary if all 10 letters have been judged.

---

### US-07 — Lives (Candles)

As a player, I want three candle lives so that wrong answers have consequences.

**Acceptance criteria**

- AC-07-01: The system shall display 3 candle icons at the start of every
  night; each represents one life.
- AC-07-02: When the player gives a wrong verdict, the system shall decrement
  the remaining lives by 1 and visually extinguish one candle icon.
- AC-07-03: The system shall accompany candle loss with a text change (e.g.,
  aria-live region "One candle snuffed — 2 remaining") to remain accessible
  when colour/animation is not available.
- AC-07-04: If lives reach 0 before the night ends, the system shall end the
  night immediately and proceed to the end-of-night summary with the letters
  played so far.
- AC-07-05: The system shall never subtract more than one life per letter,
  regardless of the number of red flags missed.

---

### US-08 — Scoring and Streak

As a player, I want a score and streak tracked through the night so that I
feel rewarded for consecutive correct answers.

**Acceptance criteria**

- AC-08-01: The system shall award 1 point for every correct verdict.
- AC-08-02: The system shall maintain a "current streak" counter that increments
  by 1 for each consecutive correct verdict and resets to 0 on any wrong verdict.
- AC-08-03: The system shall display the current score and streak somewhere
  visible during play (e.g., in the HUD).
- AC-08-04: The system shall store the best score for a completed night in
  `localStorage`; on app load the system shall display the best score if one
  exists.
- AC-08-05: If `localStorage` is unavailable or throws, the system shall
  silently fall back to in-memory state only (no crash).

---

### US-09 — End-of-Night Summary

As a player, I want a summary at the end of the night so that I can review my
performance.

**Acceptance criteria**

- AC-09-01: When all 10 letters have been judged, or when lives reach 0, the
  system shall display the end-of-night summary screen.
- AC-09-02: The summary shall display: total score (out of 10), longest streak
  of the night, number of candles remaining, and a list of red-flag types the
  player missed most (by frequency).
- AC-09-03: The summary shall show each missed red-flag type with its name and
  a brief description so the player can study them.
- AC-09-04: The system shall provide a "Play Again" button that starts a new
  night with a new seed. When activated, the system shall return to the welcome
  screen or immediately deal the first letter of a new night (either behaviour
  is acceptable, but must be consistent).
- AC-09-05: The system shall display the all-time best score from `localStorage`
  on the summary screen.

---

### US-10 — Content Rules

As a content author, I want all in-game letters to follow strict fiction and
design rules so that the game is safe, educationally accurate, and not
solvable by shortcuts.

**Acceptance criteria**

- AC-10-01: The system shall validate at test time that every letter in
  `src/content/letters.ts` has a non-empty `sender`, `senderEmail`, `subject`,
  `body`, and `verdict` field.
- AC-10-02: The system shall validate at test time that every phishing letter
  (`verdict === "phishing"`) has at least one entry in its `redFlags` array.
- AC-10-03: The system shall validate at test time that every letter has a
  non-empty `explanation` string.
- AC-10-04: The system shall not contain any real brand names, real domains, or
  references to real people in letter content; this is enforced by an author
  convention documented in a comment inside `letters.ts`.
- AC-10-05: The letter pool shall contain a minimum of 30 letters (at least 14
  phishing, at least 12 legitimate) to allow varied nights without immediate
  repetition.
- AC-10-06: The system shall validate at test time that every letter has a
  `difficulty` field with value 1, 2, or 3, and that the pool contains at least
  6 letters per difficulty tier.
- AC-10-07: The system shall validate at test time that at least 40% of legit
  letters have a `link` whose `realUrl` host matches the sender's email domain,
  so that "has a link" does not predict phishing.
- AC-10-08: The system shall validate at test time that at least 25% of phishing
  letters have no `link` field (reply-based scams), so that "no link" does not
  predict legitimacy.
- AC-10-09: The system shall validate at test time that every `redFlag` type
  used in the pool appears in at least 3 phishing letters.
- AC-10-10: The system shall validate at test time that no `realUrl` value
  contains the substrings `phish`, `harvest`, `steal`, `capture`, or `creds`
  (paths must look realistic, e.g. `/login`, `/verify`, `/account`).
- AC-10-11: The system shall validate at test time that no `senderEmail` or
  `realUrl` uses a domain suffix of `.gov`, `.gov.uk`, `.co.uk`, or `.edu`
  (use ordinary suffixes only: `.com`, `.net`, `.org`, `.co`).
- AC-10-12: Letter body text shall use the neutral fictional currency
  "silver marks" rather than any real-world currency symbol or name; this is
  enforced by author convention documented in `letters.ts`.

---

### US-11 — Accessibility

As a keyboard or screen-reader user, I want the entire game to be operable
without a mouse so that I can play regardless of my input method.

**Acceptance criteria**

- AC-11-01: The system shall ensure every interactive element (buttons, link
  tooltips, candle inspection) is reachable and activatable by keyboard.
- AC-11-02: The system shall display a visible focus indicator on every focused
  element (not relying solely on the browser default if that default is
  insufficient contrast).
- AC-11-03: The system shall not rely on colour alone to convey any game
  information; every state change communicated by colour shall also be
  communicated by text or icon label.
- AC-11-04: The system shall use semantic HTML elements (`<button>`, `<main>`,
  `<section>`, `<header>`, headings hierarchy) so screen readers can navigate
  the page structure.
- AC-11-05: Dynamic state changes (candle loss, correct/wrong feedback, new
  letter arrival) shall be announced via `aria-live` regions.

---

### US-12 — Theming and Polish

As a player, I want a cohesive spooky-manor visual theme so that the game is
immersive and polished (Kiroween Costume Contest requirement).

**Acceptance criteria**

- AC-12-01: The system shall use CSS variables for all colours, spacing, and
  typography so the theme is controlled from a single source of truth.
- AC-12-02: The system shall include candle flame, parchment letter, and desk
  visual elements using original CSS or SVG art (no third-party images unless
  listed in `CREDITS.md`).
- AC-12-03: Where `prefers-reduced-motion` is not active, the system shall
  animate letter arrival and candle flicker using CSS transitions or keyframes.
- AC-12-04: Sound effects, if present, shall be off by default and togglable
  by the player; the game shall be fully enjoyable with sound disabled.

---

### US-13 — Build and Deploy

As a developer, I want a static build that deploys to Vercel or GitHub Pages
so that the game is publicly accessible.

**Acceptance criteria**

- AC-13-01: `npm run build` shall produce a `dist/` directory that works as a
  fully self-contained static site.
- AC-13-02: The system shall not require a server or any runtime environment
  beyond a static file host.
- AC-13-03: `npm test` shall run all Vitest unit, schema, and property-based
  tests and exit with code 0 when all pass.
