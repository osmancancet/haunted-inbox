// Smoke test — confirms the Vitest runner is configured correctly.
import { describe, expect, it } from 'vitest'

describe('smoke', () => {
  it('arithmetic works', () => {
    expect(1 + 1).toBe(2)
  })
})
