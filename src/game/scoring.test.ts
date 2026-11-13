// =====================================================================
// Tests for the scoring / verdict-application logic.
// Written before the implementation (Task 09 — test-first).
// =====================================================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type { Letter } from '../content/letters'
import { applyVerdict } from './scoring'

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //

const legitLetter: Letter = {
  id: 'test-legit',
  sender: 'Test Sender',
  senderEmail: 'test@example.fake',
  subject: 'Test',
  body: 'Hello.',
  verdict: 'legit',
  redFlags: [],
  explanation: 'This is a test.',
  difficulty: 1,
}

const phishingLetter: Letter = {
  id: 'test-phishing',
  sender: 'Evil Sender',
  senderEmail: 'evil@evil.fake',
  subject: 'Urgent!',
  body: 'Click now.',
  verdict: 'phishing',
  redFlags: ['urgency'],
  explanation: 'This is a phishing test.',
  difficulty: 1,
}

const baseState = { lives: 3, score: 0, streak: 0, maxStreak: 0 }

// ------------------------------------------------------------------ //
// Unit tests
// ------------------------------------------------------------------ //

describe('applyVerdict — correct answers', () => {
  it('increments score by 1', () => {
    const result = applyVerdict(baseState, legitLetter, 'legit')
    expect(result.scoreAfter).toBe(1)
  })

  it('does not change lives', () => {
    const result = applyVerdict(baseState, legitLetter, 'legit')
    expect(result.livesAfter).toBe(3)
  })

  it('increments streak by 1', () => {
    const result = applyVerdict(baseState, legitLetter, 'legit')
    expect(result.streakAfter).toBe(1)
  })

  it('updates maxStreak when new streak exceeds it', () => {
    const state = { ...baseState, streak: 4, maxStreak: 4 }
    const result = applyVerdict(state, legitLetter, 'legit')
    expect(result.maxStreakAfter).toBe(5)
  })

  it('does not update maxStreak when streak stays below it', () => {
    // streak is 2, maxStreak is 7 → after correct answer streak becomes 3, maxStreak stays 7
    const state = { lives: 3, score: 5, streak: 2, maxStreak: 7 }
    const result = applyVerdict(state, legitLetter, 'legit')
    expect(result.maxStreakAfter).toBe(7)
  })

  it('marks the result as correct', () => {
    const result = applyVerdict(baseState, legitLetter, 'legit')
    expect(result.correct).toBe(true)
  })

  it('works for correct phishing identification', () => {
    const result = applyVerdict(baseState, phishingLetter, 'phishing')
    expect(result.correct).toBe(true)
    expect(result.scoreAfter).toBe(1)
  })
})

describe('applyVerdict — wrong answers', () => {
  it('decrements lives by 1', () => {
    const result = applyVerdict(baseState, legitLetter, 'phishing')
    expect(result.livesAfter).toBe(2)
  })

  it('does not change score', () => {
    const result = applyVerdict(baseState, legitLetter, 'phishing')
    expect(result.scoreAfter).toBe(0)
  })

  it('resets streak to 0', () => {
    const state = { ...baseState, streak: 5 }
    const result = applyVerdict(state, legitLetter, 'phishing')
    expect(result.streakAfter).toBe(0)
  })

  it('does not update maxStreak when streak resets', () => {
    // streak was 3, maxStreak was 5 → after wrong answer streak = 0, maxStreak stays 5
    const state = { lives: 3, score: 3, streak: 3, maxStreak: 5 }
    const result = applyVerdict(state, legitLetter, 'phishing')
    expect(result.maxStreakAfter).toBe(5)
  })

  it('marks the result as incorrect', () => {
    const result = applyVerdict(baseState, legitLetter, 'phishing')
    expect(result.correct).toBe(false)
  })

  it('never reduces lives below 0', () => {
    const state = { ...baseState, lives: 0 }
    const result = applyVerdict(state, legitLetter, 'phishing')
    expect(result.livesAfter).toBe(0)
  })
})

// ------------------------------------------------------------------ //
// Property-based tests (fast-check)
// ------------------------------------------------------------------ //

/** Arbitrary state for scoring properties. */
const arbState = fc.record({
  lives: fc.integer({ min: 0, max: 3 }),
  score: fc.integer({ min: 0, max: 10 }),
  streak: fc.integer({ min: 0, max: 10 }),
  maxStreak: fc.integer({ min: 0, max: 10 }),
})

const arbVerdict = fc.constantFrom('legit' as const, 'phishing' as const)

describe('applyVerdict — properties', () => {
  it('lives never go below 0', () => {
    fc.assert(
      fc.property(arbState, arbVerdict, arbVerdict, (state, letterVerdict, playerVerdict) => {
        const letter = letterVerdict === 'legit' ? legitLetter : phishingLetter
        const result = applyVerdict(state, letter, playerVerdict)
        return result.livesAfter >= 0
      }),
    )
  })

  it('score never decreases', () => {
    fc.assert(
      fc.property(arbState, arbVerdict, arbVerdict, (state, letterVerdict, playerVerdict) => {
        const letter = letterVerdict === 'legit' ? legitLetter : phishingLetter
        const result = applyVerdict(state, letter, playerVerdict)
        return result.scoreAfter >= state.score
      }),
    )
  })

  it('correct answer never decreases lives', () => {
    fc.assert(
      fc.property(arbState, (state) => {
        const result = applyVerdict(state, legitLetter, 'legit')
        return result.livesAfter >= state.lives
      }),
    )
  })

  it('wrong answer always resets streak to 0', () => {
    fc.assert(
      fc.property(arbState, (state) => {
        const result = applyVerdict(state, legitLetter, 'phishing')
        return result.streakAfter === 0
      }),
    )
  })

  it('maxStreakAfter is always ≥ maxStreak', () => {
    fc.assert(
      fc.property(arbState, arbVerdict, arbVerdict, (state, letterVerdict, playerVerdict) => {
        const letter = letterVerdict === 'legit' ? legitLetter : phishingLetter
        const result = applyVerdict(state, letter, playerVerdict)
        return result.maxStreakAfter >= state.maxStreak
      }),
    )
  })
})
