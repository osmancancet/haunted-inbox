// =====================================================================
// Schema tests for the letter pool.
// These tests enforce content rules at build/test time.
// =====================================================================

import { describe, expect, it } from 'vitest'
import letters from './letters'

// ------------------------------------------------------------------ //
// Helpers
// ------------------------------------------------------------------ //

/** Extract the hostname from a URL string (e.g. "foo.com" from "https://foo.com/path"). */
function hostOf(url: string): string {
  // Handle bare domains like "foo.com/path" as well as fully qualified ones.
  const withScheme = url.includes('://') ? url : `https://${url}`
  try {
    return new URL(withScheme).hostname.toLowerCase()
  } catch {
    return url.toLowerCase()
  }
}

/** Extract the domain portion of an email address. */
function domainOfEmail(email: string): string {
  const idx = email.lastIndexOf('@')
  return idx >= 0 ? email.slice(idx + 1).toLowerCase() : email.toLowerCase()
}

// ------------------------------------------------------------------ //
// Pool size
// ------------------------------------------------------------------ //

describe('letter pool — pool size', () => {
  it('contains at least 30 letters', () => {
    expect(letters.length).toBeGreaterThanOrEqual(30)
  })

  it('contains at least 14 phishing letters', () => {
    const phishing = letters.filter((l) => l.verdict === 'phishing')
    expect(phishing.length).toBeGreaterThanOrEqual(14)
  })

  it('contains at least 12 legitimate letters', () => {
    const legit = letters.filter((l) => l.verdict === 'legit')
    expect(legit.length).toBeGreaterThanOrEqual(12)
  })
})

// ------------------------------------------------------------------ //
// Required fields
// ------------------------------------------------------------------ //

describe('letter pool — required fields', () => {
  it('every letter has a non-empty id', () => {
    for (const letter of letters) {
      expect(letter.id, `letter missing id`).toBeTruthy()
    }
  })

  it('every letter id is unique', () => {
    const ids = letters.map((l) => l.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('every letter has a non-empty sender', () => {
    for (const letter of letters) {
      expect(letter.sender, `${letter.id}: missing sender`).toBeTruthy()
    }
  })

  it('every letter has a non-empty senderEmail', () => {
    for (const letter of letters) {
      expect(letter.senderEmail, `${letter.id}: missing senderEmail`).toBeTruthy()
    }
  })

  it('every letter has a non-empty subject', () => {
    for (const letter of letters) {
      expect(letter.subject, `${letter.id}: missing subject`).toBeTruthy()
    }
  })

  it('every letter has a non-empty body', () => {
    for (const letter of letters) {
      expect(letter.body, `${letter.id}: missing body`).toBeTruthy()
    }
  })

  it('every letter has a verdict of "legit" or "phishing"', () => {
    for (const letter of letters) {
      expect(['legit', 'phishing'], `${letter.id}: invalid verdict`).toContain(letter.verdict)
    }
  })

  it('every letter has a non-empty explanation', () => {
    for (const letter of letters) {
      expect(letter.explanation, `${letter.id}: missing explanation`).toBeTruthy()
    }
  })
})

// ------------------------------------------------------------------ //
// Red flags
// ------------------------------------------------------------------ //

describe('letter pool — red flags', () => {
  it('every phishing letter has at least one red flag', () => {
    const phishing = letters.filter((l) => l.verdict === 'phishing')
    for (const letter of phishing) {
      expect(
        letter.redFlags.length,
        `${letter.id}: phishing letter must have ≥1 red flag`,
      ).toBeGreaterThanOrEqual(1)
    }
  })

  it('every legit letter has an empty red-flags array', () => {
    const legit = letters.filter((l) => l.verdict === 'legit')
    for (const letter of legit) {
      expect(
        letter.redFlags.length,
        `${letter.id}: legit letter must have 0 red flags`,
      ).toBe(0)
    }
  })

  it('every red-flag type used in the pool appears in at least 3 phishing letters', () => {
    const phishing = letters.filter((l) => l.verdict === 'phishing')
    const counts = new Map<string, number>()
    for (const letter of phishing) {
      for (const flag of letter.redFlags) {
        counts.set(flag, (counts.get(flag) ?? 0) + 1)
      }
    }
    for (const [flagId, count] of counts) {
      expect(
        count,
        `red flag "${flagId}" appears in only ${count} phishing letter(s); need ≥ 3`,
      ).toBeGreaterThanOrEqual(3)
    }
  })
})

// ------------------------------------------------------------------ //
// Difficulty tiers
// ------------------------------------------------------------------ //

describe('letter pool — difficulty tiers', () => {
  it('every letter has difficulty 1, 2, or 3', () => {
    for (const letter of letters) {
      expect(
        [1, 2, 3],
        `${letter.id}: difficulty must be 1, 2 or 3`,
      ).toContain(letter.difficulty)
    }
  })

  it('at least 6 letters at difficulty 1', () => {
    const tier1 = letters.filter((l) => l.difficulty === 1)
    expect(tier1.length, 'need ≥ 6 letters at difficulty 1').toBeGreaterThanOrEqual(6)
  })

  it('at least 6 letters at difficulty 2', () => {
    const tier2 = letters.filter((l) => l.difficulty === 2)
    expect(tier2.length, 'need ≥ 6 letters at difficulty 2').toBeGreaterThanOrEqual(6)
  })

  it('at least 6 letters at difficulty 3', () => {
    const tier3 = letters.filter((l) => l.difficulty === 3)
    expect(tier3.length, 'need ≥ 6 letters at difficulty 3').toBeGreaterThanOrEqual(6)
  })
})

// ------------------------------------------------------------------ //
// Link / tone balance
// ------------------------------------------------------------------ //

describe('letter pool — link and tone balance', () => {
  it('at least 40% of legit letters have a link matching the sender domain', () => {
    const legit = letters.filter((l) => l.verdict === 'legit')
    const withMatchingLink = legit.filter((l) => {
      if (!l.link) return false
      const urlHost = hostOf(l.link.realUrl)
      const emailDomain = domainOfEmail(l.senderEmail)
      return urlHost === emailDomain || urlHost.endsWith(`.${emailDomain}`)
    })
    const ratio = withMatchingLink.length / legit.length
    expect(
      ratio,
      `only ${withMatchingLink.length}/${legit.length} legit letters have a matching link (need ≥ 40%)`,
    ).toBeGreaterThanOrEqual(0.4)
  })

  it('at least 25% of phishing letters have no link (reply-based scams)', () => {
    const phishing = letters.filter((l) => l.verdict === 'phishing')
    const noLink = phishing.filter((l) => !l.link)
    const ratio = noLink.length / phishing.length
    expect(
      ratio,
      `only ${noLink.length}/${phishing.length} phishing letters have no link (need ≥ 25%)`,
    ).toBeGreaterThanOrEqual(0.25)
  })
})

// ------------------------------------------------------------------ //
// URL safety rules
// ------------------------------------------------------------------ //

describe('letter pool — URL safety', () => {
  const GIVEAWAY_PATHS = ['phish', 'harvest', 'steal', 'capture', 'creds']
  const BANNED_SUFFIXES = ['.gov', '.gov.uk', '.co.uk', '.edu']

  it('no realUrl contains a giveaway path substring', () => {
    for (const letter of letters) {
      if (!letter.link) continue
      const url = letter.link.realUrl.toLowerCase()
      for (const word of GIVEAWAY_PATHS) {
        expect(
          url,
          `${letter.id}: realUrl "${url}" contains giveaway word "${word}"`,
        ).not.toContain(word)
      }
    }
  })

  it('no senderEmail uses a banned domain suffix', () => {
    for (const letter of letters) {
      const domain = domainOfEmail(letter.senderEmail)
      for (const suffix of BANNED_SUFFIXES) {
        expect(
          domain,
          `${letter.id}: senderEmail domain "${domain}" uses banned suffix "${suffix}"`,
        ).not.toMatch(new RegExp(`\\${suffix}$`))
      }
    }
  })

  it('no realUrl uses a banned domain suffix', () => {
    for (const letter of letters) {
      if (!letter.link) continue
      const host = hostOf(letter.link.realUrl)
      for (const suffix of BANNED_SUFFIXES) {
        expect(
          host,
          `${letter.id}: realUrl host "${host}" uses banned suffix "${suffix}"`,
        ).not.toMatch(new RegExp(`\\${suffix}$`))
      }
    }
  })
})
