import { useEffect, useRef, useState } from 'react'

interface HUDProps {
  lives: number
  score: number
  streak: number
  letterIndex: number
  nightLength: number
}

/** Inline SVG candle icon. Flame is animated when lit; hidden when snuffed. */
function CandleIcon({ lit }: { lit: boolean }) {
  return (
    <svg
      width="24"
      height="40"
      viewBox="0 0 24 40"
      aria-hidden="true"
      focusable="false"
      className={`candle-icon${lit ? ' candle-icon--lit' : ' candle-icon--snuffed'}`}
    >
      {/* Candle body */}
      <rect x="8" y="20" width="8" height="18" rx="2" fill="var(--color-parchment)" />
      {/* Flame (visible only when lit) */}
      {lit && (
        <ellipse
          cx="12"
          cy="17"
          rx="4"
          ry="6"
          fill="var(--color-candle)"
          className="candle-flame"
        />
      )}
      {/* Wick */}
      <line
        x1="12"
        y1="20"
        x2="12"
        y2={lit ? '23' : '20'}
        stroke={lit ? '#3a2710' : 'var(--color-muted)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Snuffed indicator */}
      {!lit && (
        <line
          x1="9"
          y1="17"
          x2="15"
          y2="17"
          stroke="var(--color-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export default function HUD({ lives, score, streak, letterIndex, nightLength }: HUDProps) {
  // Track previous lives to detect candle-loss events for aria-live announcement
  const prevLivesRef = useRef(lives)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      setAnnouncement(
        lives === 0
          ? 'All candles snuffed — the night is over.'
          : `One candle snuffed — ${lives} remaining.`,
      )
    }
    prevLivesRef.current = lives
  }, [lives])

  return (
    <header className="hud" role="banner">
      {/* Candles / lives */}
      <div className="hud__candles" aria-label={`Lives: ${lives} of 3`}>
        {Array.from({ length: 3 }, (_, i) => (
          <CandleIcon key={i} lit={i < lives} />
        ))}
      </div>

      {/* Letter counter */}
      <div className="hud__counter" aria-label={`Letter ${letterIndex + 1} of ${nightLength}`}>
        <span className="hud__label">Letter</span>
        <span className="hud__value">{letterIndex + 1} / {nightLength}</span>
      </div>

      {/* Score */}
      <div className="hud__score" aria-label={`Score: ${score}`}>
        <span className="hud__label">Score</span>
        <span className="hud__value">{score}</span>
      </div>

      {/* Streak */}
      <div className="hud__streak" aria-label={`Streak: ${streak}`}>
        <span className="hud__label">Streak</span>
        <span className="hud__value">{streak}</span>
      </div>

      {/* Accessible live region for candle-loss announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </header>
  )
}
