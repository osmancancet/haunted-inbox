// =====================================================================
// Haunted Inbox — Scoring Logic
// Pure function — no side effects, no React imports.
// =====================================================================

import type { Letter, Verdict } from '../content/letters'
import type { NightState } from './types'

// ------------------------------------------------------------------ //
// Types
// ------------------------------------------------------------------ //

export interface ScoringResult {
  correct: boolean
  livesAfter: number
  scoreAfter: number
  streakAfter: number
  maxStreakAfter: number
}

// ------------------------------------------------------------------ //
// applyVerdict
//
// Rules:
//   • Correct if playerVerdict === letter.verdict.
//   • Correct → score +1, streak +1, lives unchanged.
//   • Incorrect → lives -1 (floored at 0), streak = 0, score unchanged.
//   • maxStreakAfter = max(maxStreak, streakAfter).
// ------------------------------------------------------------------ //

export function applyVerdict(
  state: Pick<NightState, 'lives' | 'score' | 'streak' | 'maxStreak'>,
  letter: Letter,
  playerVerdict: Verdict,
): ScoringResult {
  const correct = playerVerdict === letter.verdict

  const scoreAfter = correct ? state.score + 1 : state.score
  const livesAfter = correct ? state.lives : Math.max(0, state.lives - 1)
  const streakAfter = correct ? state.streak + 1 : 0
  const maxStreakAfter = Math.max(state.maxStreak, streakAfter)

  return { correct, livesAfter, scoreAfter, streakAfter, maxStreakAfter }
}
