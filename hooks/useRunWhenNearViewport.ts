'use client'

import { type RefObject, useEffect, useState } from 'react'

/**
 * True once the element is near or inside the viewport.
 * Use to defer heavy GSAP / ScrollTrigger setup until the section is needed.
 */
export function useRunWhenNearViewport<T extends HTMLElement>(
  ref: RefObject<T>,
  rootMargin = '180px'
): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setReady(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  return ready
}
