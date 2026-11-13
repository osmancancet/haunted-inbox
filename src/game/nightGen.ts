// =====================================================================
// Haunted Inbox — Seeded PRNG and Night Generation
// Pure functions — no side effects, no React imports.
// =====================================================================

import type { Letter } from '../content/letters'

// ------------------------------------------------------------------ //
// Mulberry32 — fast 32-bit seeded PRNG
// Public domain algorithm by Tommy Ettinger.
// Returns a function that produces floats in [0, 1).
// ------------------------------------------------------------------ //

export function mulberry32(seed: number): () => number {
  let s = seed >>> 0 // ensure unsigned 32-bit
  return function () {
    s = (s + 0x6d2b79f5) >>> 0
    let z = s
    z = Math.imul(z ^ (z >>> 15), z | 1)
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61)
    z = (z ^ (z >>> 14)) >>> 0
    return z / 4294967296
  }
}

// ------------------------------------------------------------------ //
// Fisher-Yates in-place shuffle using the given PRNG
// ------------------------------------------------------------------ //

function shuffle<T>(array: T[], rng: () => number): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ------------------------------------------------------------------ //
// rampSort
//
// Sort `letters` so that difficulty increases across the night while
// allowing variety within each tier.
//
// Algorithm:
//   1. Group letters by difficulty tier (1, 2, 3).
//   2. Shuffle each tier independently with the PRNG.
//   3. Concatenate: all tier-1 → all tier-2 → all tier-3.
//
// Guarantee: avg(last 3) >= avg(first 3) for any seed because the
// later positions always come from equal-or-higher difficulty tiers.
// ------------------------------------------------------------------ //

function rampSort(letters: Letter[], rng: () => number): Letter[] {
  const tier1 = shuffle(letters.filter((l) => l.difficulty === 1), rng)
  const tier2 = shuffle(letters.filter((l) => l.difficulty === 2), rng)
  const tier3 = shuffle(letters.filter((l) => l.difficulty === 3), rng)
  return [...tier1, ...tier2, ...tier3]
}

// ------------------------------------------------------------------ //
// generateNight
//
// Strategy:
//   1. Split pool into phishing and legit buckets.
//   2. Shuffle each bucket independently.
//   3. Determine phishing count in [4, 6] using the PRNG.
//   4. Take that many phishing letters; fill the remaining slots from legit.
//   5. Apply rampSort so difficulty increases across the 10 letters.
//
// Guarantees for a 10-letter night:
//   • Exactly 10 letters.
//   • 4–6 phishing, 4–6 legit.
//   • No duplicate ids.
//   • Same seed → same output (deterministic).
//   • avg(difficulty of last 3) >= avg(difficulty of first 3).
// ------------------------------------------------------------------ //

export function generateNight(
  pool: Letter[],
  seed: number,
  count: number = 10,
): Letter[] {
  const rng = mulberry32(seed)

  const phishingPool = shuffle(
    pool.filter((l) => l.verdict === 'phishing'),
    rng,
  )
  const legitPool = shuffle(
    pool.filter((l) => l.verdict === 'legit'),
    rng,
  )

  // Pick phishing count in [4, 6]:  floor(rng() * 3) gives 0|1|2 → +4 = 4|5|6
  const phishingCount = 4 + Math.floor(rng() * 3)
  const legitCount = count - phishingCount

  if (phishingPool.length < phishingCount) {
    throw new Error(
      `generateNight: pool has only ${phishingPool.length} phishing letters but needs ${phishingCount}`,
    )
  }
  if (legitPool.length < legitCount) {
    throw new Error(
      `generateNight: pool has only ${legitPool.length} legit letters but needs ${legitCount}`,
    )
  }

  const selected = [
    ...phishingPool.slice(0, phishingCount),
    ...legitPool.slice(0, legitCount),
  ]

  // Sort by difficulty tier with within-tier shuffle for variety.
  return rampSort(selected, rng)
}
