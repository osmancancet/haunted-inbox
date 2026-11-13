interface ActionBarProps {
  onDeliver: () => void
  onBurn: () => void
  disabled?: boolean
}

/**
 * Deliver / Burn action buttons.
 * Each has a distinct icon AND a text label — not colour-only (AC-05-05).
 * Both are standard <button> elements, keyboard-accessible out of the box.
 */
export default function ActionBar({ onDeliver, onBurn, disabled = false }: ActionBarProps) {
  return (
    <div className="action-bar" role="group" aria-label="Verdict">
      <button
        type="button"
        className="action-bar__btn action-bar__btn--deliver"
        onClick={onDeliver}
        disabled={disabled}
        aria-label="Deliver — mark as legitimate"
      >
        {/* Envelope / check icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          aria-hidden="true"
          focusable="false"
          className="action-bar__icon"
        >
          <rect x="2" y="5" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <polyline points="2,5 11,13 20,5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <polyline points="6,15 9,12" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <polyline points="13,12 16,15" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <span>Deliver</span>
      </button>

      <button
        type="button"
        className="action-bar__btn action-bar__btn--burn"
        onClick={onBurn}
        disabled={disabled}
        aria-label="Burn — mark as phishing"
      >
        {/* Flame icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          aria-hidden="true"
          focusable="false"
          className="action-bar__icon"
        >
          <path
            d="M11 2 C11 2 16 7 16 12 C16 15.3 13.8 18 11 18 C8.2 18 6 15.3 6 12 C6 9 8 6 9 5 C9 7 10 8 11 8 C10 6 11 2 11 2Z"
            fill="currentColor"
          />
          <ellipse cx="11" cy="14" rx="2.5" ry="3" fill="#fff5" />
        </svg>
        <span>Burn</span>
      </button>
    </div>
  )
}
