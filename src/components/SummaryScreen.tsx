import { RED_FLAG_MAP } from '../content/redFlags'
import { calcMissedFlags } from '../game/summary'
import type { NightState } from '../game/types'

interface SummaryScreenProps {
  state: NightState
  bestScore: number
  onPlayAgain: () => void
}

export default function SummaryScreen({ state, bestScore, onPlayAgain }: SummaryScreenProps) {
  const missed = calcMissedFlags(state.letters)
  const totalLetters = state.letters.filter((nl) => nl.playerVerdict !== null).length
  const isNewBest = state.score > 0 && state.score >= bestScore

  return (
    <main className="summary-screen" aria-label="Night summary">
      <h1 className="summary-screen__title">Night's End</h1>

      {/* Score block */}
      <section className="summary-screen__scores" aria-label="Scores">
        <div className="summary-screen__stat">
          <span className="summary-screen__stat-label">Score</span>
          <span className="summary-screen__stat-value">
            {state.score} / {totalLetters}
          </span>
        </div>
        <div className="summary-screen__stat">
          <span className="summary-screen__stat-label">Best streak</span>
          <span className="summary-screen__stat-value">{state.maxStreak}</span>
        </div>
        <div className="summary-screen__stat">
          <span className="summary-screen__stat-label">Candles left</span>
          <span className="summary-screen__stat-value">{state.lives}</span>
        </div>
        <div className="summary-screen__stat">
          <span className="summary-screen__stat-label">All-time best</span>
          <span className="summary-screen__stat-value">
            {bestScore}
            {isNewBest && (
              <span className="summary-screen__new-best" aria-label="New best score!"> ★</span>
            )}
          </span>
        </div>
      </section>

      {/* Missed flags */}
      {missed.length > 0 && (
        <section className="summary-screen__missed" aria-label="Warning signs you missed">
          <h2 className="summary-screen__missed-title">Warning signs you missed most</h2>
          <ul className="summary-screen__missed-list">
            {missed.map(({ flagId, count }) => {
              const def = RED_FLAG_MAP.get(flagId)
              if (!def) return null
              return (
                <li key={flagId} className="summary-screen__missed-item">
                  <span className="summary-screen__missed-name">
                    {def.name}
                    <span className="summary-screen__missed-count"> ×{count}</span>
                  </span>
                  <span className="summary-screen__missed-desc">{def.description}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {missed.length === 0 && (
        <p className="summary-screen__perfect">Perfect night — not a single warning sign slipped past you!</p>
      )}

      <button
        type="button"
        className="summary-screen__play-again"
        onClick={onPlayAgain}
        autoFocus
      >
        Play Again
      </button>
    </main>
  )
}
