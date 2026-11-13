interface CandleInspectButtonProps {
  onInspectStart: () => void
  onInspectEnd: () => void
  isInspecting?: boolean
}

/**
 * "Hold to Candle" button — reveals curse marks while held.
 *
 * Supported interactions:
 *   Mouse: pointerdown → start, pointerup / pointerleave → end
 *   Keyboard: Space or Enter keydown → start, keyup → end
 *   Touch: pointerdown (touch) → start, pointerup / pointercancel → end
 */
export default function CandleInspectButton({
  onInspectStart,
  onInspectEnd,
  isInspecting = false,
}: CandleInspectButtonProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault() // prevent page scroll on Space
      if (!e.repeat) onInspectStart()
    }
  }

  function handleKeyUp(e: React.KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      onInspectEnd()
    }
  }

  return (
    <button
      type="button"
      className={`candle-inspect-btn${isInspecting ? ' candle-inspect-btn--active' : ''}`}
      aria-pressed={isInspecting}
      aria-label="Hold to Candle — reveals hidden curse marks"
      onPointerDown={onInspectStart}
      onPointerUp={onInspectEnd}
      onPointerLeave={onInspectEnd}
      onPointerCancel={onInspectEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      // Prevent default so long-press doesn't trigger text selection
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Flame icon */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        aria-hidden="true"
        focusable="false"
        className="candle-inspect-btn__flame"
      >
        <ellipse cx="10" cy="10" rx="6" ry="9" fill="var(--color-candle)" />
        <ellipse cx="10" cy="8" rx="3" ry="5" fill="#fff9" />
      </svg>
      <span>Hold to Candle</span>
    </button>
  )
}
