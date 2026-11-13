// =====================================================================
// Haunted Inbox — localStorage Persistence
// All calls are wrapped in try/catch; failures are silently ignored
// so a missing or blocked localStorage never crashes the game.
// =====================================================================

const KEY = 'haunted-inbox-best'

export function loadBestScore(): number {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return 0
    const parsed = JSON.parse(raw)
    return typeof parsed === 'number' ? parsed : 0
  } catch {
    return 0
  }
}

export function saveBestScore(score: number): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(score))
  } catch {
    // Silently ignore quota errors, security errors, etc.
  }
}
