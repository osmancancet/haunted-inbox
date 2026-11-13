interface WelcomeScreenProps {
  bestScore: number
  onBegin: () => void
}

export default function WelcomeScreen({ bestScore, onBegin }: WelcomeScreenProps) {
  return (
    <main className="welcome-screen" aria-label="Welcome">
      <div className="welcome-screen__inner">
        {/* Decorative candle SVG */}
        <svg
          className="welcome-screen__candle"
          width="48"
          height="80"
          viewBox="0 0 48 80"
          aria-hidden="true"
          focusable="false"
        >
          {/* Body */}
          <rect x="16" y="40" width="16" height="36" rx="3" fill="var(--color-parchment)" />
          {/* Flame */}
          <ellipse cx="24" cy="30" rx="8" ry="12" fill="var(--color-candle)" className="candle-flame" />
          <ellipse cx="24" cy="27" rx="4" ry="7" fill="#fff9" />
          {/* Wick */}
          <line x1="24" y1="40" x2="24" y2="43" stroke="#3a2710" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <h1 className="welcome-screen__title">Haunted Inbox</h1>
        <p className="welcome-screen__tagline">
          The night shift never ends — and neither do the cursed letters.
        </p>
        <p className="welcome-screen__instructions">
          Inspect each letter for warning signs, then choose to{' '}
          <strong>Deliver</strong> or <strong>Burn</strong> it.
          You have <strong>3 candles</strong>. Don't let them go out.
        </p>

        {bestScore > 0 && (
          <p className="welcome-screen__best-score" aria-label={`Your all-time best score is ${bestScore}`}>
            Best score: <strong>{bestScore}</strong>
          </p>
        )}

        <button
          type="button"
          className="welcome-screen__begin-btn"
          onClick={onBegin}
          autoFocus
        >
          Begin Night
        </button>
      </div>
    </main>
  )
}
