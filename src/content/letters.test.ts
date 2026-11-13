// =====================================================================
// Schema tests for the letter pool.
// These tests enforce content rules at build/test time.
// =====================================================================

import { describe, expect, it } from 'vitest'
import letters from './letters'

describe('letter pool — schema validation', () => {
  it('contains at least 15 letters', () => {
    expect(letters.length).toBeGreaterThanOrEqual(15)
  })

  it('contains at least 8 phishing letters', () => {
    const phishing = letters.filter((l) => l.verdict === 'phishing')
    expect(phishing.length).toBeGreaterThanOrEqual(8)
  })

  it('contains at least 5 legitimate letters', () => {
    const legit = letters.filter((l) => l.verdict === 'legit')
    expect(legit.length).toBeGreaterThanOrEqual(5)
  })

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

  it('every letter has a verdict', () => {
    for (const letter of letters) {
      expect(['legit', 'phishing']).toContain(letter.verdict)
    }
  })

  it('every letter has a non-empty explanation', () => {
    for (const letter of letters) {
      expect(letter.explanation, `${letter.id}: missing explanation`).toBeTruthy()
    }
  })

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
})
