'use client'

import { useEffect } from 'react'
import { initLenis, destroyLenis } from '@/lib/lenis'

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (!prefersReduced) {
      initLenis()
    }

    return () => {
      destroyLenis()
    }
  }, [])

  return <>{children}</>
}
