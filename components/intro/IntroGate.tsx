'use client'

import { useState, useEffect, lazy, Suspense } from 'react'

const Intro = lazy(() => import('./Intro'))

const isDev = process.env.NODE_ENV === 'development'

export default function IntroGate({
  children,
}: {
  children: React.ReactNode
}) {
  const [showIntro, setShowIntro] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // In development, skip the intro entirely for faster iteration
    if (isDev) {
      setShowIntro(false)
      setReady(true)
      return
    }
    setShowIntro(true)
    setReady(true)
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  if (!ready) return null

  return (
    <>
      {showIntro && (
        <Suspense fallback={null}>
          <Intro onComplete={handleIntroComplete} />
        </Suspense>
      )}
      <div
        style={{
          opacity: showIntro ? 0 : 1,
          transition: 'opacity 0.5s ease 0.1s',
          pointerEvents: showIntro ? 'none' : 'auto',
        }}
      >
        {children}
      </div>
    </>
  )
}
