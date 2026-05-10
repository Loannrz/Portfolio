'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { BlobShape, ArcShape, CircleShape, OrbitShape, SparkShape } from '@/components/shapes'

export type IntroProps = {
  onComplete: () => void
  /** Mot affiché lettre par lettre (ex. BIENVENUE, SHOWROOM) */
  headline?: string
  subtitle?: string
}

export default function Intro({
  onComplete,
  headline = 'BIENVENUE',
  subtitle = 'OctoVisual — Creative Visual Studio',
}: IntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const wipeRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const letters = headline.split('')
  const [visible, setVisible] = useState(true)

  const runAnimation = () => {
    const letterEls = lettersRef.current.filter(Boolean)
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(wipeRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power4.inOut',
          transformOrigin: 'left center',
          onComplete: () => {
            gsap.to(wipeRef.current, {
              backgroundColor: 'var(--cream)',
              duration: 0.5,
              ease: 'none',
              onComplete: () => {
                gsap.to(rootRef.current, {
                  opacity: 0,
                  duration: 0.4,
                  ease: 'power2.inOut',
                  onComplete: () => {
                    setVisible(false)
                    onComplete()
                  },
                })
              },
            })
          },
        })
      },
    })

    tlRef.current = tl

    tl.fromTo(
      letterEls,
      {
        opacity: 0,
        filter: 'blur(30px)',
        y: 60,
        scale: 1.3,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        scale: 1,
        stagger: 0.07,
        duration: 1.1,
        ease: 'back.out(1.6)',
      }
    )

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
      '-=0.4'
    )

    tl.to({}, { duration: 1.2 })

    tl.to(
      letterEls,
      {
        scale: 2.5,
        opacity: 0,
        filter: 'blur(20px)',
        stagger: { each: 0.03, from: 'center' },
        duration: 0.9,
        ease: 'power4.in',
      },
      '+=0.1'
    )

    tl.to(
      subtitleRef.current,
      { opacity: 0, y: -20, duration: 0.5, ease: 'power3.in' },
      '<+0.1'
    )
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      setVisible(false)
      onComplete()
      return
    }

    gsap.set(wipeRef.current, { scaleX: 0, transformOrigin: 'left center' })

    const timer = setTimeout(runAnimation, 200)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headline])

  const handleSkip = () => {
    tlRef.current?.kill()
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setVisible(false)
        onComplete()
      },
    })
  }

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9990] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 animate-float" style={{ animationDelay: '0s' }}>
          <BlobShape color="#E7C9A9" size={480} opacity={0.5} rotation={-15} />
        </div>
        <div className="absolute -bottom-24 -right-24 animate-float" style={{ animationDelay: '2s' }}>
          <BlobShape color="#FF6A3D" size={380} opacity={0.2} rotation={45} />
        </div>
        <div className="absolute top-1/4 right-[8%] animate-float" style={{ animationDelay: '1s' }}>
          <OrbitShape color="#2D4BFF" size={200} opacity={0.2} rotation={20} />
        </div>
        <div className="absolute bottom-1/4 left-[6%] animate-float" style={{ animationDelay: '3s' }}>
          <CircleShape color="#2B2B2B" size={140} opacity={0.12} />
        </div>
        <div className="absolute top-[15%] left-[25%]">
          <ArcShape color="#FF6A3D" size={160} opacity={0.18} rotation={30} />
        </div>
        <div className="absolute bottom-[20%] right-[20%]">
          <SparkShape color="#FF6A3D" size={60} opacity={0.4} />
        </div>
      </div>

      <div
        className="relative z-10 flex gap-[0.04em] select-none overflow-hidden px-4"
        aria-label={headline}
      >
        {letters.map((letter, i) => (
          <span
            key={`${headline}-${i}`}
            ref={(el) => {
              if (el) lettersRef.current[i] = el
            }}
            className="font-display font-bold inline-block"
            style={{
              fontSize: 'clamp(4rem, 14vw, 16rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: 'var(--ink)',
              willChange: 'transform, opacity, filter',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <p
        ref={subtitleRef}
        className="relative z-10 mt-6 t-label text-graphite tracking-[0.2em] text-center px-6 max-w-lg"
        style={{ opacity: 0 }}
      >
        {subtitle}
      </p>

      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-8 right-10 t-label text-ink/40 hover:text-ink/70 transition-colors duration-300"
        data-cursor="link"
      >
        SKIP →
      </button>

      <div
        ref={wipeRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ backgroundColor: 'var(--orange)', transformOrigin: 'left center' }}
      />
    </div>
  )
}
