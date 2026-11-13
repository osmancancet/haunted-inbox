import { useEffect, useRef } from 'react'
import type { Letter } from '../content/letters'
import LinkField from './LinkField'

interface LetterCardProps {
  letter: Letter
  isInspecting: boolean
}

/**
 * Parchment-style letter card.
 * - Slide-in animation via CSS class added on mount.
 * - `.inspecting` class triggers the curse-mark reveal overlay.
 * - All links rendered as text via LinkField — never as <a href>.
 */
export default function LetterCard({ letter, isInspecting }: LetterCardProps) {
  const cardRef = useRef<HTMLElement>(null)

  // Trigger slide-in animation on mount (and whenever letter changes)
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    el.classList.remove('letter-enter')
    // Force reflow so removing and re-adding the class restarts the animation
    void el.offsetWidth
    el.classList.add('letter-enter')
  }, [letter.id])

  return (
    <article
      ref={cardRef}
      className={`letter-card${isInspecting ? ' inspecting' : ''}`}
      aria-label={`Letter from ${letter.sender}`}
    >
      {/* Curse-mark overlay — visual only, shown when inspecting */}
      <div className="letter-card__curse-overlay" aria-hidden="true" />

      {/* Header */}
      <header className="letter-card__header">
        <div className="letter-card__field">
          <span className="letter-card__field-label">From</span>
          <span className="letter-card__field-value">{letter.sender}</span>
        </div>
        <div className="letter-card__field">
          <span className="letter-card__field-label">Address</span>
          <span className="letter-card__field-value letter-card__email">
            {letter.senderEmail}
          </span>
        </div>
        <div className="letter-card__field">
          <span className="letter-card__field-label">Subject</span>
          <span className="letter-card__field-value letter-card__subject">
            {letter.subject}
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="letter-card__body">
        {letter.body.split('\n').map((line, i) =>
          line === '' ? <br key={i} /> : <p key={i}>{line}</p>,
        )}
      </div>

      {/* Link (optional) */}
      {letter.link && (
        <div className="letter-card__link">
          <LinkField link={letter.link} />
        </div>
      )}
    </article>
  )
}
