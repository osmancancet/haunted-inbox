import { useId, useState } from 'react'
import type { LetterLink } from '../content/letters'

interface LinkFieldProps {
  link: LetterLink
}

/**
 * Renders a link field as plain text with a toggleable tooltip that reveals
 * the real destination URL.
 *
 * Tooltip is shown on:
 *   - hover (mouseenter / mouseleave)
 *   - keyboard focus / blur
 *   - click / tap (toggle)
 *
 * Never renders an <a> tag. Both URLs are plain text only.
 */
export default function LinkField({ link }: LinkFieldProps) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  function show() { setVisible(true) }
  function hide() { setVisible(false) }
  function toggle(e: React.MouseEvent) {
    // Prevent the click from immediately closing via blur
    e.preventDefault()
    setVisible((v) => !v)
  }

  return (
    <div className="link-field">
      <span className="link-field__label">Link</span>
      {/* Trigger: focusable span acting as a button */}
      <span
        className="link-field__display"
        role="button"
        tabIndex={0}
        aria-describedby={visible ? tooltipId : undefined}
        aria-expanded={visible}
        aria-label={`Inspect link: ${link.displayText}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setVisible((v) => !v)
          }
        }}
      >
        {link.displayText}
      </span>

      {/* Tooltip with real URL */}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className="link-field__tooltip"
        >
          <span className="link-field__tooltip-label">Real destination: </span>
          {link.realUrl}
        </span>
      )}
    </div>
  )
}
