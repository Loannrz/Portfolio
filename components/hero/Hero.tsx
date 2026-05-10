'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'
import { IS_DEV } from '@/lib/runtime'
import {
  BlobShape,
  ArcShape,
  CircleShape,
  OrbitShape,
  NoiseShape,
  SparkShape,
  GridShape,
} from '@/components/shapes'

const TAGLINE_WORDS = [
  'Visuels',
  'premium',
  'pour',
  'les',
  'DJs,',
  'clubs',
  'et',
  'artistes',
  'qui',
  'dominent.',
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleCharsRef = useRef<HTMLSpanElement[]>([])
  const taglineWordsRef = useRef<HTMLSpanElement[]>([])
  const arrowRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const shapesRef = useRef<HTMLDivElement>(null)
  const mouseParallaxRef = useRef({ x: 0, y: 0 })

  const TITLE = 'OctoVisual'

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    const chars = titleCharsRef.current
    const words = taglineWordsRef.current
    const arrow = arrowRef.current
    const scrollInd = scrollIndicatorRef.current

    const ctx = gsap.context(() => {
      // Entry animation
      const tl = gsap.timeline({ delay: 0.2 })

      tl.fromTo(
        chars,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          stagger: 0.04,
          duration: 1.2,
          ease: 'power4.out',
        }
      )

      tl.fromTo(
        words,
        { y: 30, opacity: 0, filter: IS_DEV ? 'blur(4px)' : 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.7'
      )

      tl.fromTo(
        [arrow, scrollInd],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )

      // Scroll decomposition
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress

          chars.forEach((char, i) => {
            const spread = (i - chars.length / 2) * 18 * p
            const lift = p * 120
            gsap.set(char, {
              x: spread,
              y: -lift,
              opacity: 1 - p * 0.8,
              scale: 1 + p * 0.3,
              filter: `blur(${p * (IS_DEV ? 6 : 12)}px)`,
            })
          })

          words.forEach((word, i) => {
            gsap.set(word, { opacity: 1 - p * 1.5, y: -p * 60 * (i * 0.1 + 1) })
          })

          if (arrow) gsap.set(arrow, { opacity: 1 - p * 3, y: p * 40 })
        },
      })
    }, sectionRef)

    // Mouse parallax — handled outside gsap.context since it's a DOM listener
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseParallaxRef.current = { x, y }

      if (shapesRef.current) {
        gsap.to(shapesRef.current, {
          x: x * (IS_DEV ? 10 : 18),
          y: y * (IS_DEV ? 8 : 14),
          duration: 1.4,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[110vh] flex flex-col justify-center overflow-hidden"
      style={{ paddingTop: '4rem' }}
    >
      {/* Background shapes — parallax layer */}
      <div
        ref={shapesRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute -top-32 -right-32 opacity-60 animate-float" style={{ animationDelay: '0s' }}>
          <BlobShape color="#E7C9A9" size={560} opacity={0.7} rotation={-20} />
        </div>
        <div className="absolute top-1/3 -left-40 opacity-40 animate-float" style={{ animationDelay: '2.5s' }}>
          <NoiseShape color="#FF6A3D" size={420} opacity={0.3} rotation={10} />
        </div>
        <div className="absolute bottom-0 right-1/4 animate-float" style={{ animationDelay: '1.2s' }}>
          <OrbitShape color="#2D4BFF" size={260} opacity={0.2} rotation={-15} />
        </div>
        <div className="absolute top-[12%] left-[8%]">
          <GridShape color="#121212" size={180} opacity={0.06} rotation={5} />
        </div>
        <div className="absolute bottom-[15%] left-[15%]">
          <ArcShape color="#FF6A3D" size={200} opacity={0.22} rotation={-30} />
        </div>
        <div className="absolute top-[20%] right-[12%]">
          <CircleShape color="#2B2B2B" size={120} opacity={0.14} />
        </div>
        <div className="absolute bottom-[25%] right-[8%]">
          <SparkShape color="#FF6A3D" size={70} opacity={0.5} rotation={15} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-7 md:px-14 pt-20 md:pt-28">

        {/* Eyebrow label */}
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <span className="block w-12 h-px bg-orange" />
        <span className="t-label text-orange tracking-[0.18em]">
          Nightlife Visual Studio
        </span>
        </div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="font-display font-bold leading-[0.88] tracking-[-0.04em] overflow-hidden"
          style={{ fontSize: 'clamp(5.5rem, 18vw, 22rem)' }}
          aria-label={TITLE}
        >
          {TITLE.split('').map((char, i) => (
            <span
              key={i}
              className="overflow-hidden inline-block"
              style={{ display: 'inline-block' }}
            >
              <span
                ref={(el) => {
                  if (el) titleCharsRef.current[i] = el
                }}
                className="inline-block will-change-transform"
                style={{ opacity: 0 }}
              >
                {char}
              </span>
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <div className="mt-8 md:mt-12 flex flex-wrap gap-x-3 gap-y-1 max-w-2xl">
          {TAGLINE_WORDS.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) taglineWordsRef.current[i] = el
              }}
              className="font-body text-graphite/70 will-change-transform"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.35rem)',
                opacity: 0,
                letterSpacing: '-0.01em',
                lineHeight: 1.5,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Arrow CTA */}
        <div
          ref={arrowRef}
          className="mt-14 md:mt-20 flex items-center gap-4 group"
          style={{ opacity: 0 }}
        >
          <a
            href="#gallery"
            onClick={(e) => {
              e.preventDefault()
              const target = document.getElementById('gallery')
              if (!target) return
              const lenis = getLenis()
              if (lenis) {
                lenis.scrollTo(target, { duration: 2, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
              } else {
                target.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="flex items-center gap-4"
            data-cursor="hover"
          >
            {/* Editorial arrow */}
            <div
              className="relative w-16 h-16 border border-ink/20 rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-orange group-hover:border-orange"
              data-magnetic
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              >
                <path
                  d="M3.5 14.5L14.5 3.5M14.5 3.5H7M14.5 3.5V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="t-label text-ink/60 tracking-[0.12em]">
              Découvrir les projets
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 right-10 flex flex-col items-center gap-3"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <span className="t-label text-ink/30 tracking-[0.15em] writing-mode-vertical"
          style={{ writingMode: 'vertical-rl', letterSpacing: '0.15em' }}
        >
          Scroll
        </span>
        <div className="w-px h-14 bg-ink/15 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-orange"
            style={{
              height: '40%',
              animation: 'scrollLine 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(280%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
