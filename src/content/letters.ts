// =====================================================================
// Haunted Inbox — Letter Pool
// STUB — will be replaced in Task 06 with the full letter content.
//
// CONTENT RULES (read before editing):
//   • All companies, banks, couriers, and people are INVENTED.
//   • Never use real brand names, real domains, or real people.
//   • Links are text only — never real, never clickable.
//   • Tone: spooky and playful, never gory. Suitable for classroom use.
// =====================================================================

import type { RedFlagId } from './redFlags'

export type Verdict = 'legit' | 'phishing'

export interface LetterLink {
  /** The URL text the reader sees in the message body. */
  displayText: string
  /** The actual destination — rendered as text only, never an href. */
  realUrl: string
}

export interface Letter {
  /** Unique kebab-case slug, e.g. "gravewell-bank-01". */
  id: string
  /** Display name of the sender, e.g. "Gravewell Bank". */
  sender: string
  /** Fictional email address. */
  senderEmail: string
  subject: string
  body: string
  link?: LetterLink
  verdict: Verdict
  /** Empty array for legit letters; ≥ 1 entry for phishing letters. */
  redFlags: RedFlagId[]
  /** One-sentence educational lesson shown in the feedback panel. */
  explanation: string
}

// Stub — empty pool so TypeScript is happy; schema tests will fail until Task 06.
const letters: Letter[] = []

export default letters
