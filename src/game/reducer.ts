// =====================================================================
// Haunted Inbox — Game Reducer
// Pure function — delegates to scoring helpers, no side effects.
// =====================================================================

import type { Letter } from '../content/letters'
import { applyVerdict } from './scoring'
import type { GameAction, NightLetter, NightState } from './types'

// ------------------------------------------------------------------ //
// Factory
// ------------------------------------------------------------------ //

/** Build the initial NightState for a new night. */
export function makeInitialState(seed: number, letters: Letter[]): NightState {
  const nightLetters: NightLetter[] = letters.map((letter) => ({
    letter,
    playerVerdict: null,
  }))

  return {
    seed,
    letters: nightLetters,
    currentIndex: 0,
    lives: 3,
    score: 0,
    streak: 0,
    maxStreak: 0,
    phase: 'playing',
  }
}

// ------------------------------------------------------------------ //
// Reducer
// ------------------------------------------------------------------ //

export function gameReducer(state: NightState, action: GameAction): NightState {
  switch (action.type) {
    case 'START_NIGHT': {
      return makeInitialState(action.seed, action.letters)
    }

    case 'SUBMIT_VERDICT': {
      // A verdict counts once: ignore submissions outside the playing phase
      // (e.g. a second click while the feedback panel is open).
      if (state.phase !== 'playing') return state

      const current = state.letters[state.currentIndex]
      if (!current) return state

      const scoring = applyVerdict(
        { lives: state.lives, score: state.score, streak: state.streak, maxStreak: state.maxStreak },
        current.letter,
        action.verdict,
      )

      // Update the player verdict on this letter slot.
      const updatedLetters = state.letters.map((nl, i) =>
        i === state.currentIndex ? { ...nl, playerVerdict: action.verdict } : nl,
      )

      return {
        ...state,
        letters: updatedLetters,
        lives: scoring.livesAfter,
        score: scoring.scoreAfter,
        streak: scoring.streakAfter,
        maxStreak: scoring.maxStreakAfter,
        phase: 'feedback',
      }
    }

    case 'NEXT_LETTER': {
      const nextIndex = state.currentIndex + 1
      const nightOver = nextIndex >= state.letters.length || state.lives === 0

      if (nightOver) {
        return { ...state, phase: 'summary' }
      }

      return {
        ...state,
        currentIndex: nextIndex,
        phase: 'playing',
      }
    }

    case 'PLAY_AGAIN': {
      return makeInitialState(action.seed, action.letters)
    }

    default:
      return state
  }
}
