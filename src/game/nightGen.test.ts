// =====================================================================
// Tests for the seeded PRNG and night generation logic.
// Written before the implementation (Task 07 — test-first).
// =====================================================================

import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import letters from '../content/letters'
import { generateNight, mulberry32 } from './nightGen'

// ------------------------------------------------------------------ //
// mulberry32 PRNG
// ------------------------------------------------------------------ //

describe('mulberry32', () => {
  it('returns a function that produces numbers in [0, 1)', () => {
    const rng = mulberry32(42)
    for (let i = 0; i < 100; i++) {
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('produces the same sequence for the same seed', () => {
    const rng1 = mulberry32(12345)
    const rng2 = mulberry32(12345)
    for (let i = 0; i < 20; i++) {
      expect(rng1()).toBe(rng2())
    }
  })

  it('produces different sequences for different seeds', () => {
    const seq1 = Array.from({ length: 10 }, mulberry32(1))
    const seq2 = Array.from({ length: 10 }, mulberry32(2))
    expect(seq1).not.toEqual(seq2)
  })
})

// ------------------------------------------------------------------ //
// generateNight — unit tests
// ------------------------------------------------------------------ //

describe('generateNight', () => {
  it('returns exactly 10 letters', () => {
    const night = generateNight(letters, 42)
    expect(night).toHaveLength(10)
  })

  it('phishing count is between 4 and 6 (inclusive)', () => {
    const night = generateNight(letters, 99)
    const phishingCount = night.filter((l) => l.verdict === 'phishing').length
    expect(phishingCount).toBeGreaterThanOrEqual(4)
    expect(phishingCount).toBeLessThanOrEqual(6)
  })

  it('legit count equals 10 minus phishing count', () => {
    const night = generateNight(letters, 7)
    const phishingCount = night.filter((l) => l.verdict === 'phishing').length
    const legitCount = night.filter((l) => l.verdict === 'legit').length
    expect(legitCount).toBe(10 - phishingCount)
  })

  it('same seed produces the same sequence', () => {
    const night1 = generateNight(letters, 999)
    const night2 = generateNight(letters, 999)
    expect(night1.map((l) => l.id)).toEqual(night2.map((l) => l.id))
  })

  it('no duplicate letter ids in a single night', () => {
    const night = generateNight(letters, 2024)
    const ids = night.map((l) => l.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('different seeds produce different sequences', () => {
    const ids1 = generateNight(letters, 1).map((l) => l.id)
    const ids2 = generateNight(letters, 2).map((l) => l.id)
    // Not guaranteed mathematically to differ, but highly likely with 18-letter pool.
    // Using a third seed as tiebreaker to avoid a flaky test.
    const ids3 = generateNight(letters, 3).map((l) => l.id)
    expect(ids1).not.toEqual(ids2)
    expect(ids2).not.toEqual(ids3)
  })
})

// ------------------------------------------------------------------ //
// generateNight — property-based tests (fast-check)
// ------------------------------------------------------------------ //

describe('generateNight — properties', () => {
  it('always returns exactly 10 items for any seed', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 2 ** 32 - 1 }), (seed) => {
        const night = generateNight(letters, seed)
        return night.length === 10
      }),
      { numRuns: 200 },
    )
  })

  it('phishing count is always in [4, 6] for any seed', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 2 ** 32 - 1 }), (seed) => {
        const night = generateNight(letters, seed)
        const count = night.filter((l) => l.verdict === 'phishing').length
        return count >= 4 && count <= 6
      }),
      { numRuns: 200 },
    )
  })

  it('is deterministic: same seed always gives same id sequence', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 2 ** 32 - 1 }), (seed) => {
        const night1 = generateNight(letters, seed)
        const night2 = generateNight(letters, seed)
        return night1.every((l, i) => l.id === night2[i].id)
      }),
      { numRuns: 200 },
    )
  })

  it('never contains duplicate ids', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 2 ** 32 - 1 }), (seed) => {
        const night = generateNight(letters, seed)
        const ids = night.map((l) => l.id)
        return new Set(ids).size === ids.length
      }),
      { numRuns: 200 },
    )
  })
})
