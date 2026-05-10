'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRunWhenNearViewport } from '@/hooks/useRunWhenNearViewport'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface Slide {
  id: string
  category: string
  headline: string
  sub: string
  accent: string
  bg: string
  imgSeed: string
  index: string
}

const SLIDES: Slide[] = [
  {
    id: 's1',
    category: 'DJ POSTERS',
    headline: 'Affiches\nIconiques',
    sub: 'Affiches DJs, soirées et festivals. Chaque visuel construit une identité forte et mémorable.',
    accent: '#FF6A3D',
    bg: '#F8F4EE',
    imgSeed: 'nite01',
    index: '01',
  },
  {
    id: 's2',
    category: 'VIDÉO',
    headline: 'Films &\nAfterMovies',
    sub: 'Aftermovies, teasers artistiques, recap soirées et contenus nightlife premium.',
    accent: '#2D4BFF',
    bg: '#F3EEE6',
    imgSeed: 'nite02',
    index: '02',
  },
  {
    id: 's3',
    category: 'BRANDING',
    headline: 'Identités\nNightlife',
    sub: 'Branding de clubs, artistes, labels et établissements. Du logo à la charte complète.',
    accent: '#121212',
    bg: '#EDE8DF',
    imgSeed: 'nite03',
    index: '03',
  },
  {
    id: 's4',
    category: 'ARTIST DA',
    headline: 'Direction\nArtistique',
    sub: 'DA complète pour DJs et artistes : identity packs, covers, press kits visuels.',
    accent: '#FF6A3D',
    bg: '#F8F4EE',
    imgSeed: 'nite04',
    index: '04',
  },
]

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<HTMLDivElement[]>([])
  const headlineRefs = useRef<HTMLHeadingElement[]>([])
  const nearViewport = useRunWhenNearViewport(sectionRef, '280px')

  useEffect(() => {
    if (!nearViewport) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    /*
     * gsap.matchMedia() gère automatiquement le setup ET le cleanup
     * à chaque redimensionnement de fenêtre, évitant le pin-spacer fantôme.
     */
    const mm = gsap.matchMedia()

    /* ── Mobile : animations d'apparition par slide au scroll ── */
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      slideRefs.current.forEach((slide, i) => {
        if (!slide) return
        const headline = headlineRefs.current[i]
        const label    = slide.querySelector<HTMLElement>('.slide-label')
        const body     = slide.querySelector<HTMLElement>('.slide-body')
        const cta      = slide.querySelector<HTMLElement>('.slide-cta')

        const targets = [headline, label, body, cta].filter(Boolean)

        gsap.set(targets, { y: 48, opacity: 0 })

        ScrollTrigger.create({
          trigger: slide,
          start: 'top 78%',
          once: true,
          onEnter: () => {
            gsap.to(targets, {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.1,
            })
          },
        })
      })

      return () => {
        slideRefs.current.forEach((slide) => {
          if (!slide) return
          const headline = headlineRefs.current[slideRefs.current.indexOf(slide)]
          const label = slide.querySelector<HTMLElement>('.slide-label')
          const body  = slide.querySelector<HTMLElement>('.slide-body')
          const cta   = slide.querySelector<HTMLElement>('.slide-cta')
          gsap.set([headline, label, body, cta].filter(Boolean), { clearProps: 'all' })
        })
      }
    })

    /* ── Desktop : scroll horizontal piné ── */
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      /* Largeur totale du track + 100vw par slide */
      track.style.width = `${SLIDES.length * 100}vw`
      slideRefs.current.forEach((slide) => {
        if (slide) slide.style.width = '100vw'
      })

      const viewportWidth = window.innerWidth
      const distance = track.scrollWidth - viewportWidth

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${distance + viewportWidth * 0.5}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          gsap.set(track, { x: -distance * self.progress })
          slideRefs.current.forEach((slide, i) => {
            const p = Math.max(0, Math.min(1, self.progress * SLIDES.length - i))
            const img = slide.querySelector<HTMLElement>('.slide-img')
            if (img) gsap.set(img, { x: p * 40, scale: 1 + p * 0.05 })
          })
        },
      })

      headlineRefs.current.forEach((headline, i) => {
        /* Slide 0 = déjà visible à y=0 ; slides suivantes = cachées en y=60 en attente du scroll */
        const initP = Math.max(0, Math.min(1, 1 - i))
        gsap.set(headline, { y: (1 - initP) * 60, opacity: initP })
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${distance + viewportWidth * 0.5}`,
          scrub: true,
          onUpdate: (self) => {
            /* +1 pour que slide 0 soit déjà à y=0 dès progress=0 */
            const p = Math.max(0, Math.min(1, self.progress * SLIDES.length - i + 1))
            gsap.set(headline, { y: (1 - p) * 60, opacity: Math.min(1, p * 2) })
          },
        })
      })

      /* Cleanup appelé automatiquement quand le breakpoint quitte (resize ou démontage) */
      return () => {
        st.kill()
        ScrollTrigger.getAll().forEach((t) => { if (t.trigger === section) t.kill() })
        track.style.width = ''
        slideRefs.current.forEach((slide) => { if (slide) slide.style.width = '' })
        gsap.set(track, { x: 0, clearProps: 'x' })
      }
    })

    return () => mm.revert()
  }, [nearViewport])

  return (
    <section
      ref={sectionRef}
      id="horizontal"
      /* overflow-hidden partout pour éviter le scroll horizontal parasite */
      className="relative overflow-hidden md:h-screen"
      aria-label="Nos disciplines"
    >
      <div
        ref={trackRef}
        className="md:flex md:h-full will-change-transform"
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            ref={(el) => { if (el) slideRefs.current[i] = el }}
            className="relative flex h-screen w-full md:shrink-0 md:h-full overflow-hidden"
            /* Fond sombre sur mobile, couleur slide sur desktop */
            style={{ backgroundColor: '#0c0c0c' }}
          >
            {/* Image full-bleed */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="slide-img absolute inset-0 will-change-transform" style={{ scale: 1.05 }}>
                <Image
                  src={`https://picsum.photos/seed/${slide.imgSeed}/900/800`}
                  alt={slide.category}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={i === 0}
                />
                {/* Overlay desktop : fondu depuis la gauche */}
                <div
                  className="hidden md:block absolute inset-0"
                  style={{ background: `linear-gradient(to right, ${slide.bg} 0%, ${slide.bg}CC 28%, transparent 55%)` }}
                />
                {/* Overlay mobile : sombre sur tout + plus fort en bas pour le texte */}
                <div
                  className="md:hidden absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.25) 100%)' }}
                />
              </div>
            </div>

            {/* Contenu */}
            <div className="relative z-10 flex flex-col justify-between h-full w-full md:w-1/2 px-7 md:px-20 py-14 md:py-16">
              <div className="slide-label flex items-center justify-between">
                <span className="t-label tracking-[0.18em]" style={{ color: slide.accent }}>
                  {slide.category}
                </span>
                <span className="t-label text-white/50 md:text-ink/25 tabular-nums">
                  {slide.index} / {SLIDES.length.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex-1 flex items-center">
                <h2
                  ref={(el) => { if (el) headlineRefs.current[i] = el }}
                  className="font-display font-bold text-white md:text-ink tracking-[-0.04em] leading-[0.9] whitespace-pre-line"
                  style={{ fontSize: 'clamp(3rem, 7.5vw, 9rem)' }}
                >
                  {slide.headline}
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                <p className="slide-body t-body text-white/75 md:text-ink/55 max-w-xs leading-relaxed">{slide.sub}</p>
                <div className="slide-cta flex items-center gap-3 group">
                  <span
                    className="w-8 h-px transition-all duration-500 group-hover:w-14"
                    style={{ backgroundColor: slide.accent }}
                  />
                  <a href="#gallery" className="t-label tracking-[0.12em] transition-colors duration-300" style={{ color: slide.accent }} data-cursor="hover">
                    Voir les projets
                  </a>
                </div>
              </div>
            </div>

            {/* Ghost label — desktop seulement pour éviter overflow mobile */}
            <div
              className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
              style={{
                writingMode: 'vertical-rl',
                color: slide.accent,
                opacity: 0.1,
                fontSize: 'clamp(4rem, 8vw, 10rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                userSelect: 'none',
              }}
            >
              {slide.category}
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots — desktop seulement */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 gap-2 z-20" aria-hidden="true">
        {SLIDES.map((slide) => (
          <div key={slide.id} className="w-1.5 h-1.5 rounded-full bg-ink/20" />
        ))}
      </div>
    </section>
  )
}
