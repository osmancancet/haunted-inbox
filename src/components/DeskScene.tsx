import { useState } from 'react'
import type { Verdict } from '../content/letters'
import type { GameAction, NightState } from '../game/types'
import ActionBar from './ActionBar'
import CandleInspectButton from './CandleInspectButton'
import HUD from './HUD'
import LetterCard from './LetterCard'

interface DeskSceneProps {
  nightState: NightState
  dispatch: React.Dispatch<GameAction>
}

/**
 * Layout wrapper for the active playing phase.
 * Owns the `isInspecting` boolean and assembles:
 *   HUD → LetterCard → CandleInspectButton → ActionBar
 */
export default function DeskScene({ nightState, dispatch }: DeskSceneProps) {
  const [isInspecting, setIsInspecting] = useState(false)

  const currentNightLetter = nightState.letters[nightState.currentIndex]
  const letter = currentNightLetter?.letter

  if (!letter) return null

  function handleVerdict(verdict: Verdict) {
    dispatch({ type: 'SUBMIT_VERDICT', verdict })
    setIsInspecting(false)
  }

  return (
    <div className="desk-scene">
      <HUD
        lives={nightState.lives}
        score={nightState.score}
        streak={nightState.streak}
        letterIndex={nightState.currentIndex}
        nightLength={nightState.letters.length}
      />

      <main className="desk-scene__desk" aria-label="Desk">
        {/* Candle group — decorative, also houses inspect button */}
        <div className="desk-scene__candle-area">
          {/* Visual candle flame (decorative) */}
          <svg
            className="desk-scene__candle-deco"
            width="32"
            height="56"
            viewBox="0 0 32 56"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="11" y="28" width="10" height="24" rx="2" fill="var(--color-parchment)" />
            <ellipse cx="16" cy="20" rx="6" ry="10" fill="var(--color-candle)" className="candle-flame" />
            <ellipse cx="16" cy="17" rx="3" ry="6" fill="#fff9" />
            <line x1="16" y1="28" x2="16" y2="31" stroke="#3a2710" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <CandleInspectButton
            onInspectStart={() => setIsInspecting(true)}
            onInspectEnd={() => setIsInspecting(false)}
            isInspecting={isInspecting}
          />
        </div>

        {/* Letter */}
        <LetterCard letter={letter} isInspecting={isInspecting} />

        {/* Actions */}
        <ActionBar
          onDeliver={() => handleVerdict('legit')}
          onBurn={() => handleVerdict('phishing')}
        />
      </main>
    </div>
  )
}
