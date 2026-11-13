// =====================================================================
// Tests for the game reducer and state machine transitions.
// Written before the implementation (Task 13 — test-first).
// =====================================================================

import { describe, expect, it } from 'vitest'
import type { Letter } from '../content/letters'
import { gameReducer, makeInitialState } from './reducer'
import type { NightState } from './types'

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //

function makeLetter(overrides: Partial<Letter> = {}): Letter {
  return {
    id: 'letter-01',
    sender: 'Test Sender',
    senderEmail: 'test@test.fake',
    subject: 'Test Subject',
    body: 'Test body.',
    verdict: 'legit',
    redFlags: [],
    explanation: 'Test explanation.',
    ...overrides,
  }
}

/** Build a minimal valid initial state for a 2-letter night. */
function twoLetterNight(): NightState {
  const letters = [
    makeLetter({ id: 'l1', verdict: 'legit' }),
    makeLetter({ id: 'l2', verdict: 'phishing', redFlags: ['urgency'] }),
  ]
  return makeInitialState(0, letters)
}

// ------------------------------------------------------------------ //
// makeInitialState
// ------------------------------------------------------------------ //

describe('makeInitialState', () => {
  it('sets lives to 3', () => {
    const state = twoLetterNight()
    expect(state.lives).toBe(3)
  })

  it('sets score to 0', () => {
    const state = twoLetterNight()
    expect(state.score).toBe(0)
  })

  it('sets streak and maxStreak to 0', () => {
    const state = twoLetterNight()
    expect(state.streak).toBe(0)
    expect(state.maxStreak).toBe(0)
  })

  it('sets currentIndex to 0', () => {
    const state = twoLetterNight()
    expect(state.currentIndex).toBe(0)
  })

  it('sets phase to "playing"', () => {
    const state = twoLetterNight()
    expect(state.phase).toBe('playing')
  })

  it('wraps every letter with playerVerdict null', () => {
    const state = twoLetterNight()
    expect(state.letters.every((nl) => nl.playerVerdict === null)).toBe(true)
  })
})

// ------------------------------------------------------------------ //
// START_NIGHT
// ------------------------------------------------------------------ //

describe('gameReducer — START_NIGHT', () => {
  it('initialises a fresh night with correct defaults', () => {
    const letters = [makeLetter({ id: 'x1' }), makeLetter({ id: 'x2' })]
    // Start from an arbitrary non-fresh state to confirm it is reset.
    const prevState: NightState = {
      seed: 1,
      letters: [],
      currentIndex: 5,
      lives: 1,
      score: 7,
      streak: 3,
      maxStreak: 5,
      phase: 'summary',
    }
    const next = gameReducer(prevState, { type: 'START_NIGHT', seed: 42, letters })
    expect(next.lives).toBe(3)
    expect(next.score).toBe(0)
    expect(next.streak).toBe(0)
    expect(next.currentIndex).toBe(0)
    expect(next.phase).toBe('playing')
    expect(next.letters).toHaveLength(2)
    expect(next.letters.every((nl) => nl.playerVerdict === null)).toBe(true)
  })
})

// ------------------------------------------------------------------ //
// SUBMIT_VERDICT
// ------------------------------------------------------------------ //

describe('gameReducer — SUBMIT_VERDICT', () => {
  it('transitions phase to "feedback"', () => {
    const state = twoLetterNight()
    const next = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'legit' })
    expect(next.phase).toBe('feedback')
  })

  it('stores the player verdict on the current letter', () => {
    const state = twoLetterNight()
    const next = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'legit' })
    expect(next.letters[0].playerVerdict).toBe('legit')
  })

  it('increments score on a correct verdict', () => {
    const state = twoLetterNight() // first letter is legit
    const next = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'legit' })
    expect(next.score).toBe(1)
  })

  it('decrements lives on a wrong verdict', () => {
    const state = twoLetterNight() // first letter is legit
    const next = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'phishing' })
    expect(next.lives).toBe(2)
  })

  it('does not change currentIndex', () => {
    const state = twoLetterNight()
    const next = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'legit' })
    expect(next.currentIndex).toBe(0)
  })
})

// ------------------------------------------------------------------ //
// NEXT_LETTER — with letters remaining
// ------------------------------------------------------------------ //

describe('gameReducer — NEXT_LETTER with letters remaining', () => {
  it('increments currentIndex', () => {
    let state = twoLetterNight()
    state = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'legit' })
    state = gameReducer(state, { type: 'NEXT_LETTER' })
    expect(state.currentIndex).toBe(1)
  })

  it('sets phase back to "playing"', () => {
    let state = twoLetterNight()
    state = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'legit' })
    state = gameReducer(state, { type: 'NEXT_LETTER' })
    expect(state.phase).toBe('playing')
  })
})

// ------------------------------------------------------------------ //
// NEXT_LETTER — after last letter
// ------------------------------------------------------------------ //

describe('gameReducer — NEXT_LETTER after last letter', () => {
  it('sets phase to "summary" after all letters are judged', () => {
    let state = twoLetterNight()
    // Judge letter 0
    state = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'legit' })
    state = gameReducer(state, { type: 'NEXT_LETTER' })
    // Judge letter 1 (last)
    state = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'phishing' })
    state = gameReducer(state, { type: 'NEXT_LETTER' })
    expect(state.phase).toBe('summary')
  })
})

// ------------------------------------------------------------------ //
// NEXT_LETTER — lives = 0
// ------------------------------------------------------------------ //

describe('gameReducer — NEXT_LETTER when lives = 0', () => {
  it('sets phase to "summary" when lives reach 0 regardless of letters remaining', () => {
    let state = twoLetterNight()
    // Drain lives: start with 3, wrong verdict reduces to 2
    state = { ...state, lives: 0 } // simulate already exhausted
    state = gameReducer(state, { type: 'SUBMIT_VERDICT', verdict: 'phishing' }) // wrong on legit
    state = gameReducer(state, { type: 'NEXT_LETTER' })
    expect(state.phase).toBe('summary')
  })
})

// ------------------------------------------------------------------ //
// PLAY_AGAIN
// ------------------------------------------------------------------ //

describe('gameReducer — PLAY_AGAIN', () => {
  it('resets to a fresh playing state with the new letters', () => {
    // Build a finished state
    let state = twoLetterNight()
    state = { ...state, phase: 'summary', score: 2, streak: 2, lives: 1, currentIndex: 1 }
    const newLetters = [makeLetter({ id: 'new1' }), makeLetter({ id: 'new2' })]
    const next = gameReducer(state, { type: 'PLAY_AGAIN', seed: 7, letters: newLetters })
    expect(next.phase).toBe('playing')
    expect(next.score).toBe(0)
    expect(next.streak).toBe(0)
    expect(next.lives).toBe(3)
    expect(next.currentIndex).toBe(0)
    expect(next.letters.map((nl) => nl.letter.id)).toEqual(['new1', 'new2'])
  })
})
