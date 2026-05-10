'use client'

import { useState, useEffect, lazy, Suspense, useMemo } from 'react'
import { usePathname } from 'next/navigation'

const Intro = lazy(() => import('./Intro'))

const isDev = process.env.NODE_ENV === 'development'

export default function IntroGate({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isShowroom = pathname?.startsWith('/product') ?? false

  const [showIntro, setShowIntro] = useState(false)
  const [ready, setReady] = useState(false)

  const { headline, subtitle } = useMemo(
    () =>
      isShowroom
        ? {
            headline: 'SHOWROOM',
            subtitle: 'OctoVisual — Packs créatifs & offres nightlife',
          }
        : {
            headline: 'BIENVENUE',
            subtitle: 'OctoVisual — Creative Visual Studio',
          },
    [isShowroom]
  )

  useEffect(() => {
    // Dev : pas d’intro sur l’accueil (itération rapide), mais intro SHOWROOM sur /product
    if (isDev && !isShowroom) {
      setShowIntro(false)
      setReady(true)
      return
    }
    setShowIntro(true)
    setReady(true)
  }, [isShowroom])

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  if (!ready) return null

  return (
    <>
      {showIntro && (
        <Suspense fallback={null}>
          <Intro
            key={headline}
            onComplete={handleIntroComplete}
            headline={headline}
            subtitle={subtitle}
          />
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
