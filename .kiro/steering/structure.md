# Structure

```
.kiro/            specs, hooks and steering (must stay in the repo, never gitignored)
src/
  game/           pure game logic (rules, scoring, night generation) + tests
  content/        letters and red-flag definitions (typed data) + schema tests
  components/     React components (Desk, Letter, Candle, Verdict, Summary)
  styles/         CSS variables, theme, animations
  App.tsx, main.tsx
public/           static assets (original SVGs, optional audio)
docs/             project notes (Turkish notes for the author are fine here)
```

Conventions: small components, no logic inside components that could live in
`src/game`; every new rule gets a test first; commit after each completed task.
