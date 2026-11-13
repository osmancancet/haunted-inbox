// =====================================================================
// Haunted Inbox — Core Game Types
// =====================================================================

import type { Letter } from '../content/letters'

// ------------------------------------------------------------------ //
// Verdict
// ------------------------------------------------------------------ //

/** The player's (or letter's true) classification. */
export type Verdict = 'legit' | 'phishing'

// ------------------------------------------------------------------ //
// Night state
// ------------------------------------------------------------------ //

/** One letter slot in the current night, together with the player's answer. */
export interface NightLetter {
  letter: Letter
  /** null until the player has submitted a verdict for this letter. */
  playerVerdict: Verdict | null
}

/** Full runtime state for one playing night. */
export interface NightState {
  seed: number
  /** Always exactly 10 elements. */
  letters: NightLetter[]
  /** Index of the letter currently on the desk (0–9). */
  currentIndex: number
  /** Remaining lives (0–3). */
  lives: number
  /** Number of correct verdicts this night. */
  score: number
  /** Current consecutive-correct streak. */
  streak: number
  /** Highest streak achieved in this night. */
  maxStreak: number
  phase: 'playing' | 'feedback' | 'summary'
}

// ------------------------------------------------------------------ //
// Reducer actions
// ------------------------------------------------------------------ //

export type GameAction =
  | { type: 'START_NIGHT'; seed: number; letters: Letter[] }
  | { type: 'SUBMIT_VERDICT'; verdict: Verdict }
  | { type: 'NEXT_LETTER' }
  | { type: 'PLAY_AGAIN'; seed: number; letters: Letter[] }
