import { RED_FLAG_MAP } from '../content/redFlags'
import type { Letter, Verdict } from '../content/letters'

interface FeedbackPanelProps {
  letter: Letter
  playerVerdict: Verdict
  onNext: () => void
}

/**
 * Shown after the player submits a verdict.
 *
 * Displays:
 *  - Correct / wrong indicator (text + CSS class — never colour-only)
 *  - All red flags present on the letter (name + description), looked up
 *    via RED_FLAG_MAP which covers all 8 flag types
 *  - The letter's specific explanation
 *  - "Next Letter" button
 */
export default function FeedbackPanel({ letter, playerVerdict, onNext }: FeedbackPanelProps) {
  const correct = playerVerdict === letter.verdict

  return (
    <section
      className={`feedback-panel feedback-panel--${correct ? 'correct' : 'wrong'} feedback-enter`}
      aria-label="Feedback"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Verdict indicator — text label is mandatory (not colour-only) */}
      <div className="feedback-panel__verdict">
        <span
          className={`feedback-panel__verdict-badge feedback-panel__verdict-badge--${correct ? 'correct' : 'wrong'}`}
          aria-label={correct ? 'Correct' : 'Wrong'}
        >
          {correct ? '✓ Correct!' : '✗ Wrong!'}
        </span>
        <span className="feedback-panel__verdict-detail">
          This letter was{' '}
          <strong>{letter.verdict === 'phishing' ? 'phishing' : 'legitimate'}</strong>.
        </span>
      </div>

      {/* Red flags (phishing only) */}
      {letter.redFlags.length > 0 && (
        <div className="feedback-panel__flags">
          <h2 className="feedback-panel__flags-title">Warning signs in this letter</h2>
          <ul className="feedback-panel__flags-list">
            {letter.redFlags.map((flagId) => {
              const def = RED_FLAG_MAP.get(flagId)
              if (!def) return null
              return (
                <li key={flagId} className="feedback-panel__flag-item">
                  <span className="feedback-panel__flag-name">{def.name}</span>
                  <span className="feedback-panel__flag-desc">{def.description}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Legit: no flags, just affirm */}
      {letter.redFlags.length === 0 && (
        <div className="feedback-panel__safe">
          <p>No warning signs — this letter was safe to deliver.</p>
        </div>
      )}

      {/* Specific lesson for this letter */}
      <div className="feedback-panel__explanation">
        <h2 className="feedback-panel__explanation-title">Lesson</h2>
        <p>{letter.explanation}</p>
      </div>

      {/* Advance button */}
      <button
        type="button"
        className="feedback-panel__next-btn"
        onClick={onNext}
        autoFocus
      >
        Next Letter
      </button>
    </section>
  )
}
