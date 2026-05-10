'use client'

import { useEffect, useRef } from 'react'
import { useRunWhenNearViewport } from '@/hooks/useRunWhenNearViewport'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { WaveShape } from '@/components/shapes'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const igCardRef      = useRef<HTMLAnchorElement>(null)
  const telCardRef     = useRef<HTMLAnchorElement>(null)
  const eventooCardRef = useRef<HTMLAnchorElement>(null)
  const nearViewport = useRunWhenNearViewport(sectionRef, '380px')

  useEffect(() => {
    if (!nearViewport) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => {
          const tl = gsap.timeline()
          tl.fromTo(titleRef.current,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out' }
          )
          tl.fromTo(subtitleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
            '-=0.6'
          )
          tl.fromTo([igCardRef.current, telCardRef.current, eventooCardRef.current],
            { y: 60, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out' },
            '-=0.4'
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
      id="contact"
      className="section-pad overflow-hidden relative"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Background shape */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-20" aria-hidden="true">
        <WaveShape color="#E7C9A9" size={700} rotation={-8} strokeWidth={0.7} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-px bg-orange" />
          <span className="t-label text-orange tracking-[0.16em]">Contact</span>
        </div>

        {/* Title */}
        <h2
          ref={titleRef}
          className="font-display font-bold text-ink leading-[0.88] tracking-[-0.04em] mb-6"
          style={{ fontSize: 'clamp(4rem, 12vw, 14rem)', opacity: 0 }}
        >
          Parlons.
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="t-body text-ink/50 mb-16 md:mb-24 max-w-lg"
          style={{ opacity: 0, fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}
        >
          Affiche DJ, branding de club, aftermovie, identity pack ?<br />
          Contactez-nous directement, on répond vite.<br />
          <span style={{ fontSize: '0.9em', opacity: 0.65 }}>Autre projet ? On est ouverts.</span>
        </p>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">

          {/* Instagram */}
          <a
            ref={igCardRef}
            href="https://www.instagram.com/octo.visuals/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group relative overflow-hidden flex flex-col justify-between"
            style={{
              borderRadius: '6px',
              minHeight: '280px',
              opacity: 0,
              background: 'linear-gradient(135deg, #FF6A3D 0%, #ff8c67 100%)',
              padding: '2rem',
              textDecoration: 'none',
            }}
          >
            {/* Grain texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/grain.svg')",
                backgroundSize: '200px',
                opacity: 0.06,
                mixBlendMode: 'multiply',
              }}
              aria-hidden="true"
            />

            {/* Decorative circle */}
            <div
              className="absolute -right-12 -bottom-12 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2"
              aria-hidden="true"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
            <div
              className="absolute -right-6 -bottom-6"
              aria-hidden="true"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            />

            {/* Top */}
            <div className="relative z-10 flex items-start justify-between">
              {/* Icon */}
              <div
                className="flex items-center justify-center w-11 h-11"
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                </svg>
              </div>
              {/* Arrow */}
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path d="M2 14L14 2M14 2H6M14 2V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Bottom */}
            <div className="relative z-10">
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: '0.4rem', fontFamily: 'var(--font-body)' }}>
                Instagram
              </p>
              <p
                className="font-display font-bold tracking-[-0.03em] transition-transform duration-400 group-hover:translate-x-1"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'white', lineHeight: 1.05 }}
              >
                @octo.visuals
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.5rem', fontFamily: 'var(--font-body)', letterSpacing: '-0.01em' }}>
                DM direct pour toute demande
              </p>
            </div>
          </a>

          {/* Téléphone */}
          <a
            ref={telCardRef}
            href="tel:+33766799387"
            data-cursor="hover"
            className="group relative overflow-hidden flex flex-col justify-between"
            style={{
              borderRadius: '6px',
              minHeight: '280px',
              opacity: 0,
              backgroundColor: 'var(--graphite)',
              padding: '2rem',
              textDecoration: 'none',
            }}
          >
            {/* Grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/grain.svg')",
                backgroundSize: '200px',
                opacity: 0.05,
                mixBlendMode: 'overlay',
              }}
              aria-hidden="true"
            />

            {/* Decorative lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <div
                className="absolute top-6 right-6 transition-transform duration-700 group-hover:rotate-12"
                style={{ width: '80px', height: '1px', backgroundColor: 'rgba(248,244,238,0.12)', transform: 'rotate(45deg)' }}
              />
              <div
                style={{ position: 'absolute', bottom: '40px', right: '50px', width: '50px', height: '1px', backgroundColor: 'rgba(248,244,238,0.08)', transform: 'rotate(-20deg)' }}
              />
              <div
                className="absolute -right-8 -top-8"
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  border: '1px solid rgba(248,244,238,0.06)',
                }}
              />
            </div>

            {/* Top */}
            <div className="relative z-10 flex items-start justify-between">
              <div
                className="flex items-center justify-center w-11 h-11"
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,106,61,0.18)',
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.7 12.1 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.59 1.3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.01-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path d="M2 14L14 2M14 2H6M14 2V10" stroke="rgba(248,244,238,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Bottom */}
            <div className="relative z-10">
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.4)', marginBottom: '0.4rem', fontFamily: 'var(--font-body)' }}>
                Téléphone
              </p>
              <p
                className="font-display font-bold tracking-[-0.03em] transition-transform duration-400 group-hover:translate-x-1 whitespace-nowrap"
                style={{ fontSize: 'clamp(1.1rem, 2.8vw, 2rem)', color: '#F8F4EE', lineHeight: 1.05 }}
              >
                07 66 79 93 87
              </p>
            </div>
          </a>

          {/* myeventoo_france */}
          <a
            ref={eventooCardRef}
            href="https://www.instagram.com/myeventoo_france/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group relative overflow-hidden flex flex-col justify-between"
            style={{
              borderRadius: '6px',
              minHeight: '280px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
              padding: '2rem',
              textDecoration: 'none',
            }}
          >
            {/* Grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/grain.svg')",
                backgroundSize: '200px',
                opacity: 0.06,
                mixBlendMode: 'overlay',
              }}
              aria-hidden="true"
            />

            {/* Cercles déco */}
            <div
              className="absolute -right-12 -bottom-12 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2"
              aria-hidden="true"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            <div
              className="absolute -right-6 -bottom-6"
              aria-hidden="true"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            />
            {/* Accent glow */}
            <div
              className="absolute -top-8 -left-8 pointer-events-none"
              aria-hidden="true"
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,106,61,0.14) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Top */}
            <div className="relative z-10 flex items-start justify-between">
              <div
                className="flex items-center justify-center w-11 h-11"
                style={{
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,106,61,0.18)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6A3D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#FF6A3D" stroke="none" />
                </svg>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path d="M2 14L14 2M14 2H6M14 2V10" stroke="rgba(248,244,238,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Bottom */}
            <div className="relative z-10">
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(248,244,238,0.38)', marginBottom: '0.4rem', fontFamily: 'var(--font-body)' }}>
                Gérant OctoVisuals
              </p>
              <p
                className="font-display font-bold tracking-[-0.03em] transition-transform duration-400 group-hover:translate-x-1 whitespace-nowrap"
                style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.6rem)', color: '#F8F4EE', lineHeight: 1.05 }}
              >
                @myeventoo_france
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(248,244,238,0.38)', marginTop: '0.5rem', fontFamily: 'var(--font-body)', letterSpacing: '-0.01em' }}>
                DM pour tout projet pro
              </p>
            </div>
          </a>
        </div>

        {/* Note */}
        <p className="t-label text-ink/22 mt-10 tracking-[0.08em]">
          Réponse garantie sous 12h · Basé à Montpellier, projets partout
        </p>
      </div>
    </section>
  )
}
