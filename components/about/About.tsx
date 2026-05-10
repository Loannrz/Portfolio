'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRunWhenNearViewport } from '@/hooks/useRunWhenNearViewport'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'
import { SparkShape, ArcShape, BlobShape } from '@/components/shapes'

const STATS = [
  { value: '5+', label: 'Années\nnightlife' },
  { value: '200+', label: 'Affiches\ncréées' },
  { value: '80+', label: 'DJs &\nclubs' },
  { value: '18M+', label: 'Streams\nvisuels' },
]

const TEXT_LINES = [
  'OctoVisual est un studio créatif spécialisé dans',
  'l\'univers de la nightlife : affiches DJs, branding',
  'de clubs, directions artistiques d\'artistes.',
  ' ',
  'Nous créons les visuels des artistes et établissements',
  'qui dominent la scène nightlife moderne.',
  'Des images qui s\'impriment dans la mémoire.',
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<HTMLSpanElement[]>([])
  const statsRef = useRef<HTMLDivElement[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const nearViewport = useRunWhenNearViewport(sectionRef, '380px')

  useEffect(() => {
    if (!nearViewport) return
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    // gsap.context() ensures all ScrollTriggers and tweens are properly reverted on cleanup
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
        },
        once: true,
      })

      ScrollTrigger.create({
        trigger: photoRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            photoRef.current,
            { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
            { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.1, ease: 'power4.out' }
          )
        },
        once: true,
      })

      ScrollTrigger.create({
        trigger: linesRef.current[0],
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            linesRef.current.filter(Boolean),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out' }
          )
        },
        once: true,
      })

      ScrollTrigger.create({
        trigger: statsRef.current[0],
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(
            statsRef.current.filter(Boolean),
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }
          )
        },
        once: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [nearViewport])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pad overflow-hidden relative"
      style={{ backgroundColor: 'var(--cream-light)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-16 md:mb-24">
        <span className="w-8 h-px bg-orange" />
        <span className="t-label text-orange tracking-[0.16em]">Studio</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* Left — Photo */}
        <div className="relative">
          <div
            ref={photoRef}
            className="relative overflow-hidden"
            style={{
              clipPath: 'inset(100% 0 0 0)',
              borderRadius: '4px',
              opacity: 0,
            }}
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <Image
                src="https://picsum.photos/seed/studio01/800/1000"
                alt="OctoVisual Studio"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Tint */}
              <div className="absolute inset-0 bg-orange/8 mix-blend-multiply" />
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute -bottom-12 -left-12 pointer-events-none" aria-hidden="true">
            <BlobShape color="#E7C9A9" size={240} opacity={0.5} rotation={20} />
          </div>
          <div className="absolute -top-8 -right-8 pointer-events-none" aria-hidden="true">
            <ArcShape color="#FF6A3D" size={120} opacity={0.3} rotation={-15} />
          </div>
          <div className="absolute top-8 right-8 pointer-events-none" aria-hidden="true">
            <SparkShape color="#FF6A3D" size={50} opacity={0.6} />
          </div>

          {/* Floating label */}
          <div
            className="absolute bottom-6 right-6 px-4 py-2 bg-cream/90 backdrop-blur-sm"
            style={{ borderRadius: '2px', border: '1px solid rgba(18,18,18,0.08)' }}
          >
            <p className="t-label text-ink/60 tracking-[0.1em]">MPL · France</p>
          </div>
        </div>

        {/* Right — Text */}
        <div>
          <h2
            ref={titleRef}
            className="t-heading text-ink mb-10 md:mb-14"
            style={{ opacity: 0 }}
          >
            Les visuels<br />des artistes<br />qui comptent
          </h2>

          <div className="space-y-0 mb-12">
            {TEXT_LINES.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <span
                  ref={(el) => { if (el) linesRef.current[i] = el }}
                  className="block t-body text-ink/65 leading-[1.8]"
                  style={{ opacity: 0 }}
                >
                  {line || '\u00A0'}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              const target = document.getElementById('contact')
              if (!target) return
              const lenis = getLenis()
              if (lenis) {
                lenis.scrollTo(target, { duration: 2, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
              } else {
                target.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="inline-flex items-center gap-4 group"
            data-cursor="hover"
          >
            <span
              className="flex items-center justify-center w-12 h-12 border border-ink/20 rounded-full transition-all duration-400 group-hover:bg-orange group-hover:border-orange"
              data-magnetic
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="t-label text-ink/60 tracking-[0.12em] group-hover:text-ink transition-colors">
              Travaillons ensemble
            </span>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 md:mt-28 pt-12 border-t border-sand/60">
        {STATS.map((stat, i) => (
          <div
            key={stat.value}
            ref={(el) => { if (el) statsRef.current[i] = el }}
            className="flex flex-col gap-2"
            style={{ opacity: 0 }}
          >
            <span
              className="font-display font-bold text-ink leading-none tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              {stat.value}
            </span>
            <span className="t-label text-ink/40 tracking-[0.08em] whitespace-pre-line leading-relaxed">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
