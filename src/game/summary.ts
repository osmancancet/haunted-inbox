// =====================================================================
// Haunted Inbox — End-of-Night Summary Calculation
// Pure function — no side effects, no React imports.
// =====================================================================

import type { RedFlagId } from '../content/redFlags'
import type { NightLetter } from './types'

// ------------------------------------------------------------------ //
// Types
// ------------------------------------------------------------------ //

export interface MissedFlag {
  flagId: RedFlagId
  count: number
}

// ------------------------------------------------------------------ //
// calcMissedFlags
//
// A flag is "missed" when:
//   • the letter's verdict is "phishing", AND
//   • the player voted "legit" (incorrectly delivered it).
//
// Returns all missed flag types sorted by frequency (highest first).
// ------------------------------------------------------------------ //

export function calcMissedFlags(letters: NightLetter[]): MissedFlag[] {
  const counts = new Map<RedFlagId, number>()

  for (const { letter, playerVerdict } of letters) {
    // Only count flags from phishing letters the player failed to identify.
    if (letter.verdict !== 'phishing' || playerVerdict !== 'legit') continue

    for (const flagId of letter.redFlags) {
      counts.set(flagId, (counts.get(flagId) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([flagId, count]) => ({ flagId, count }))
    .sort((a, b) => b.count - a.count)
}
