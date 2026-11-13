// =====================================================================
// Tests for the missed-flags summary calculation.
// Written before the implementation (Task 11 — test-first).
// =====================================================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import type { Letter } from '../content/letters'
import type { NightLetter } from './types'
import { calcMissedFlags } from './summary'

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //

function makeLetter(overrides: Partial<Letter> = {}): Letter {
  return {
    id: 'test-01',
    sender: 'Test',
    senderEmail: 'test@test.fake',
    subject: 'Test',
    body: 'Test',
    verdict: 'phishing',
    redFlags: ['urgency'],
    explanation: 'Test explanation.',
    ...overrides,
  }
}

function makeNightLetter(
  letterOverrides: Partial<Letter> = {},
  playerVerdict: 'legit' | 'phishing' | null = null,
): NightLetter {
  return {
    letter: makeLetter(letterOverrides),
    playerVerdict,
  }
}

// ------------------------------------------------------------------ //
// Unit tests
// ------------------------------------------------------------------ //

describe('calcMissedFlags', () => {
  it('returns empty array for empty input', () => {
    expect(calcMissedFlags([])).toEqual([])
  })

  it('returns empty array when all verdicts are null (not yet judged)', () => {
    const letters: NightLetter[] = [makeNightLetter({}, null), makeNightLetter({}, null)]
    expect(calcMissedFlags(letters)).toEqual([])
  })

  it('returns empty array when all phishing letters were correctly identified', () => {
    const letters: NightLetter[] = [
      makeNightLetter({ verdict: 'phishing', redFlags: ['urgency'] }, 'phishing'),
      makeNightLetter({ id: 'test-02', verdict: 'phishing', redFlags: ['spoofed_sender'] }, 'phishing'),
    ]
    expect(calcMissedFlags(letters)).toEqual([])
  })

  it('counts a flag once when a phishing letter is missed', () => {
    const letters: NightLetter[] = [
      makeNightLetter({ verdict: 'phishing', redFlags: ['urgency'] }, 'legit'), // missed
    ]
    const result = calcMissedFlags(letters)
    expect(result).toHaveLength(1)
    expect(result[0].flagId).toBe('urgency')
    expect(result[0].count).toBe(1)
  })

  it('counts each flag from a multi-flag missed letter separately', () => {
    const letters: NightLetter[] = [
      makeNightLetter(
        { verdict: 'phishing', redFlags: ['urgency', 'spoofed_sender', 'mismatched_link'] },
        'legit', // missed
      ),
    ]
    const result = calcMissedFlags(letters)
    const flagIds = result.map((r) => r.flagId).sort()
    expect(flagIds).toEqual(['mismatched_link', 'spoofed_sender', 'urgency'].sort())
    expect(result.every((r) => r.count === 1)).toBe(true)
  })

  it('accumulates count when the same flag appears in multiple missed letters', () => {
    const letters: NightLetter[] = [
      makeNightLetter({ id: 'p1', verdict: 'phishing', redFlags: ['urgency'] }, 'legit'),
      makeNightLetter({ id: 'p2', verdict: 'phishing', redFlags: ['urgency'] }, 'legit'),
      makeNightLetter({ id: 'p3', verdict: 'phishing', redFlags: ['urgency', 'spoofed_sender'] }, 'legit'),
    ]
    const result = calcMissedFlags(letters)
    const urgency = result.find((r) => r.flagId === 'urgency')
    const spoofed = result.find((r) => r.flagId === 'spoofed_sender')
    expect(urgency?.count).toBe(3)
    expect(spoofed?.count).toBe(1)
  })

  it('sorts results by count descending', () => {
    const letters: NightLetter[] = [
      makeNightLetter({ id: 'p1', verdict: 'phishing', redFlags: ['urgency', 'credential_request'] }, 'legit'),
      makeNightLetter({ id: 'p2', verdict: 'phishing', redFlags: ['urgency'] }, 'legit'),
      makeNightLetter({ id: 'p3', verdict: 'phishing', redFlags: ['spoofed_sender'] }, 'legit'),
    ]
    // urgency: 2, credential_request: 1, spoofed_sender: 1
    const result = calcMissedFlags(letters)
    expect(result[0].flagId).toBe('urgency')
    expect(result[0].count).toBe(2)
    // The rest can be in any order among themselves (count = 1)
    expect(result.slice(1).every((r) => r.count === 1)).toBe(true)
  })

  it('does not count legit letters that were wrongly burned', () => {
    const letters: NightLetter[] = [
      // Wrongly burning a legit letter — no red flags to count
      makeNightLetter({ id: 'l1', verdict: 'legit', redFlags: [] }, 'phishing'),
    ]
    expect(calcMissedFlags(letters)).toEqual([])
  })

  it('does not count correctly burned phishing letters', () => {
    const letters: NightLetter[] = [
      makeNightLetter({ verdict: 'phishing', redFlags: ['urgency'] }, 'phishing'), // correct
    ]
    expect(calcMissedFlags(letters)).toEqual([])
  })
})

// ------------------------------------------------------------------ //
// Property-based tests
// ------------------------------------------------------------------ //

describe('calcMissedFlags — properties', () => {
  /**
   * The sum of all miss counts must equal the total number of red flags
   * across letters that were phishing and incorrectly delivered.
   */
  it('total flag count equals total red flags in missed phishing letters', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 4, maxLength: 8 }),
            verdict: fc.constantFrom('legit' as const, 'phishing' as const),
            redFlags: fc.array(
              fc.constantFrom(
                'urgency' as const,
                'spoofed_sender' as const,
                'mismatched_link' as const,
                'credential_request' as const,
              ),
              { minLength: 0, maxLength: 4 },
            ),
            playerVerdict: fc.constantFrom('legit' as const, 'phishing' as const, null),
          }),
          { maxLength: 15 },
        ),
        (rawLetters) => {
          const nightLetters: NightLetter[] = rawLetters.map((raw) => ({
            letter: {
              id: raw.id,
              sender: 'S',
              senderEmail: 's@s.fake',
              subject: 'S',
              body: 'S',
              verdict: raw.verdict,
              redFlags: raw.verdict === 'legit' ? [] : raw.redFlags,
              explanation: 'E',
            },
            playerVerdict: raw.playerVerdict,
          }))

          const missed = nightLetters.filter(
            (nl) => nl.letter.verdict === 'phishing' && nl.playerVerdict === 'legit',
          )
          const expectedTotal = missed.reduce((sum, nl) => sum + nl.letter.redFlags.length, 0)

          const result = calcMissedFlags(nightLetters)
          const actualTotal = result.reduce((sum, r) => sum + r.count, 0)
          return actualTotal === expectedTotal
        },
      ),
    )
  })

  it('results are sorted by count descending', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 4, maxLength: 8 }),
            verdict: fc.constantFrom('legit' as const, 'phishing' as const),
            redFlags: fc.array(
              fc.constantFrom(
                'urgency' as const,
                'spoofed_sender' as const,
                'mismatched_link' as const,
              ),
              { minLength: 0, maxLength: 3 },
            ),
            playerVerdict: fc.constantFrom('legit' as const, 'phishing' as const, null),
          }),
          { maxLength: 10 },
        ),
        (rawLetters) => {
          const nightLetters: NightLetter[] = rawLetters.map((raw) => ({
            letter: {
              id: raw.id,
              sender: 'S',
              senderEmail: 's@s.fake',
              subject: 'S',
              body: 'S',
              verdict: raw.verdict,
              redFlags: raw.verdict === 'legit' ? [] : raw.redFlags,
              explanation: 'E',
            },
            playerVerdict: raw.playerVerdict,
          }))
          const result = calcMissedFlags(nightLetters)
          for (let i = 1; i < result.length; i++) {
            if (result[i].count > result[i - 1].count) return false
          }
          return true
        },
      ),
    )
  })
})
