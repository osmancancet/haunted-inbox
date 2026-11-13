import { useEffect, useReducer, useState } from 'react'
import letters from './content/letters'
import DeskScene from './components/DeskScene'
import FeedbackPanel from './components/FeedbackPanel'
import SummaryScreen from './components/SummaryScreen'
import WelcomeScreen from './components/WelcomeScreen'
import { generateNight } from './game/nightGen'
import { gameReducer, makeInitialState } from './game/reducer'
import { loadBestScore, saveBestScore } from './game/storage'

// Use a time-based seed for the first night; subsequent nights increment it.
function newSeed() {
  return Date.now() & 0xffff_ffff
}

export default function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [bestScore, setBestScore] = useState(0)

  // Load persisted best score on mount
  useEffect(() => {
    setBestScore(loadBestScore())
  }, [])

  // Build initial night state lazily
  const [nightState, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => makeInitialState(0, []),
  )

  function startNight() {
    const seed = newSeed()
    const night = generateNight(letters, seed)
    dispatch({ type: 'START_NIGHT', seed, letters: night })
    setHasStarted(true)
  }

  function handleNext() {
    // If the night just ended save the best score before transitioning
    const nextIndex = nightState.currentIndex + 1
    const nightOver = nextIndex >= nightState.letters.length || nightState.lives === 0
    if (nightOver && nightState.score > bestScore) {
      saveBestScore(nightState.score)
      setBestScore(nightState.score)
    }
    dispatch({ type: 'NEXT_LETTER' })
  }

  function handlePlayAgain() {
    const seed = newSeed()
    const night = generateNight(letters, seed)
    dispatch({ type: 'PLAY_AGAIN', seed, letters: night })
    // Keep hasStarted true — go straight to playing
  }

  // ------------------------------------------------------------------ //
  // Routing — driven by hasStarted + nightState.phase
  // ------------------------------------------------------------------ //

  if (!hasStarted) {
    return (
      <>
        <LiveRegion />
        <WelcomeScreen bestScore={bestScore} onBegin={startNight} />
      </>
    )
  }

  if (nightState.phase === 'summary') {
    return (
      <>
        <LiveRegion />
        <SummaryScreen
          state={nightState}
          bestScore={bestScore}
          onPlayAgain={handlePlayAgain}
        />
      </>
    )
  }

  const currentNightLetter = nightState.letters[nightState.currentIndex]

  if (nightState.phase === 'feedback' && currentNightLetter?.playerVerdict) {
    return (
      <>
        <LiveRegion />
        <DeskScene nightState={nightState} dispatch={dispatch} />
        <FeedbackPanel
          letter={currentNightLetter.letter}
          playerVerdict={currentNightLetter.playerVerdict}
          onNext={handleNext}
        />
      </>
    )
  }

  // phase === 'playing'
  return (
    <>
      <LiveRegion />
      <DeskScene nightState={nightState} dispatch={dispatch} />
    </>
  )
}

/**
 * Global aria-live region for dynamic announcements that don't belong to
 * a specific component (e.g. screen transitions).
 */
function LiveRegion() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="app-live-region"
    />
  )
}
