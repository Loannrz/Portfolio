import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

let lenisInstance: Lenis | null = null
// Keep a reference to the ticker so we can remove it on destroy
let rafTickerFn: ((time: number) => void) | null = null

export function initLenis(): Lenis {
  // Guard: destroy previous instance cleanly before creating a new one
  if (lenisInstance) {
    destroyLenis()
  }

  const lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
  })

  lenis.on('scroll', ScrollTrigger.update)

  rafTickerFn = (time: number) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(rafTickerFn)
  gsap.ticker.lagSmoothing(0)

  lenisInstance = lenis
  return lenis
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function destroyLenis(): void {
  if (rafTickerFn) {
    gsap.ticker.remove(rafTickerFn)
    rafTickerFn = null
  }
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}
