'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
} from 'react'
import Image from 'next/image'
import { useRunWhenNearViewport } from '@/hooks/useRunWhenNearViewport'
import { gsap } from '@/lib/gsap'
import { projects, ALL_CATEGORIES } from '@/data/projects'
import type { Project, GalleryCategory } from '@/data/projects'

type Category = GalleryCategory

const TRANSITION_DURATION = 0.72
const AUTO_ADVANCE_MS = 4500

export default function Gallery() {
  const sectionRef    = useRef<HTMLElement>(null)
  const slidesRef     = useRef<HTMLDivElement[]>([])
  const filterBarRef  = useRef<HTMLDivElement>(null)
  const timerBarRef   = useRef<HTMLDivElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const overlayLabelRef = useRef<HTMLDivElement>(null)

  const nearViewport = useRunWhenNearViewport(sectionRef, '400px')

  const [activeCategory, setActiveCategory] = useState<Category>('TOUS')
  const [activeIndex, setActiveIndex]       = useState(0)

  const activeIndexRef      = useRef(0)
  const isTransitioningRef  = useRef(false)
  const timerAnimRef        = useRef<gsap.core.Tween | null>(null)
  const filteredRef         = useRef(projects)

  const filtered = activeCategory === 'TOUS' ? projects : projects.filter((p) => p.category === activeCategory)
  filteredRef.current = filtered

  /* ─────────────────────────────────────────────────
     Timer
  ───────────────────────────────────────────────── */
  const stopTimer = useCallback(() => {
    timerAnimRef.current?.kill()
    timerAnimRef.current = null
    if (timerBarRef.current) gsap.set(timerBarRef.current, { scaleX: 0 })
  }, [])

  const goToSlideRef = useRef<(next: number, dir: 1 | -1) => void>(() => {})

  const startTimer = useCallback(() => {
    stopTimer()
    const bar = timerBarRef.current
    if (!bar) return

    timerAnimRef.current = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: AUTO_ADVANCE_MS / 1000,
        ease: 'none',
        onComplete: () => {
          const curr  = activeIndexRef.current
          const total = filteredRef.current.length
          goToSlideRef.current((curr + 1) % total, 1)
        },
      }
    )
  }, [stopTimer])

  /* ─────────────────────────────────────────────────
     Core slide transition
  ───────────────────────────────────────────────── */
  const goToSlide = useCallback(
    (nextIdx: number, dir: 1 | -1) => {
      if (isTransitioningRef.current) return
      const slides = slidesRef.current
      const curr   = slides[activeIndexRef.current]
      const next   = slides[nextIdx]
      if (!curr || !next) return

      isTransitioningRef.current = true
      stopTimer()

      gsap.set(next, { zIndex: 2, yPercent: dir > 0 ? 105 : -105, scale: 1.04, opacity: 1 })
      gsap.set(curr, { zIndex: 1 })

      gsap.timeline({
        onComplete: () => {
          activeIndexRef.current = nextIdx
          setActiveIndex(nextIdx)
          isTransitioningRef.current = false

          slides.forEach((s, i) => {
            if (i !== nextIdx) {
              gsap.set(s, { zIndex: 0, yPercent: i < nextIdx ? -105 : 105, opacity: 0 })
            }
          })

          startTimer()
        },
      })
        .to(curr, { yPercent: dir > 0 ? -20 : 20, scale: 0.93, opacity: 0, duration: TRANSITION_DURATION, ease: 'power4.inOut' }, 0)
        .to(next, { yPercent: 0, scale: 1, opacity: 1, duration: TRANSITION_DURATION, ease: 'power4.inOut' }, 0)
    },
    [startTimer, stopTimer]
  )

  goToSlideRef.current = goToSlide

  /* ─────────────────────────────────────────────────
     Cinematic category transition (wipe plein écran)
  ───────────────────────────────────────────────── */
  const handleCategoryChange = useCallback(
    (cat: Category) => {
      if (cat === activeCategory) return
      const overlay = overlayRef.current
      const label   = overlayLabelRef.current
      if (!overlay) { setActiveCategory(cat); return }

      stopTimer()
      if (label) label.textContent = cat

      gsap.timeline()
        /* Balayage entrant — gauche → droite */
        .set(overlay, {
          display: 'flex',
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        })
        .to(overlay, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.5,
          ease: 'power4.inOut',
        })
        /* Nom de catégorie */
        .fromTo(
          label,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' },
          '-=0.05'
        )
        /* Changement effectif au milieu du balayage */
        .call(() => setActiveCategory(cat), [], '+=0.1')
        /* Sortie du nom */
        .to(label, { opacity: 0, y: -14, duration: 0.2, ease: 'power2.in' }, '+=0.05')
        /* Balayage sortant — droite → droite (volet qui s'efface) */
        .to(overlay, {
          clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          duration: 0.5,
          ease: 'power4.inOut',
        }, '-=0.1')
        .set(overlay, { display: 'none' })
    },
    [activeCategory, stopTimer]
  )

  /* ─────────────────────────────────────────────────
     Init slides + start timer
  ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!nearViewport) return
    activeIndexRef.current = 0
    setActiveIndex(0)
    isTransitioningRef.current = false
    stopTimer()

    requestAnimationFrame(() => {
      slidesRef.current.filter(Boolean).forEach((slide, i) => {
        gsap.set(slide, {
          zIndex: i === 0 ? 2 : 0,
          yPercent: i === 0 ? 0 : 105,
          scale: 1,
          opacity: i === 0 ? 1 : 0,
        })
      })
      startTimer()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, nearViewport])

  /* ─────────────────────────────────────────────────
     Filter bar reveal on entry
  ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!nearViewport) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.fromTo(
            filterBarRef.current,
            { y: -16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
          )
          io.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [nearViewport])

  useEffect(() => () => stopTimer(), [stopTimer])

  /* Keyboard navigation */
  useEffect(() => {
    if (!nearViewport) return
    const onKey = (e: KeyboardEvent) => {
      const section = sectionRef.current
      if (!section) return
      const rect   = section.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return

      const total = filteredRef.current.length
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToSlide((activeIndexRef.current + 1) % total, 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToSlide((activeIndexRef.current - 1 + total) % total, -1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goToSlide, nearViewport])

  const current = filtered[activeIndex] ?? filtered[0]

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative"
      style={{
        height: '100vh',
        backgroundColor: current?.accent ? `${current.accent}09` : 'var(--cream-secondary)',
        transition: 'background-color 1s ease',
      }}
    >
      {/* ── Barre de filtres premium ── */}
      <div
        ref={filterBarRef}
        className="absolute top-0 left-0 right-0 z-30 flex flex-col md:flex-row items-start md:items-center justify-between px-7 md:px-14 pt-[4.5rem] pb-4 gap-4"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.72) 0%, transparent 100%)',
          opacity: 0,
        }}
      >
        {/* Label gauche */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="w-5 h-px bg-orange" />
          <span className="t-label text-orange tracking-[0.16em]">Portfolio</span>
        </div>

        {/* Filtres */}
        <nav
          className="flex flex-wrap items-center gap-y-0 w-full md:w-auto"
          role="tablist"
          aria-label="Filtres de catégorie"
          style={{
            border: '1px solid rgba(248,244,238,0.13)',
            borderRadius: '6px',
            backgroundColor: 'rgba(5,5,5,0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '2px 4px',
          }}
        >
          {ALL_CATEGORIES.map((cat, idx) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(cat)}
                className="relative flex flex-col items-start gap-1 px-2.5 md:px-4 py-2 transition-colors duration-300"
                style={{ cursor: 'none' }}
                data-cursor="link"
              >
                {/* Numéro éditorial */}
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.46rem',
                    letterSpacing: '0.12em',
                    color: isActive ? '#FF6A3D' : 'rgba(248,244,238,0.22)',
                    transition: 'color 0.35s ease',
                    lineHeight: 1,
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {/* Libellé */}
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#F8F4EE' : 'rgba(248,244,238,0.38)',
                    transition: 'color 0.35s ease, font-weight 0.2s ease',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </span>
                {/* Ligne active (orange) */}
                <span
                  className="absolute bottom-0 left-3 right-3 h-px"
                  style={{
                    backgroundColor: '#FF6A3D',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── Stack de slides ── */}
      <div className="absolute inset-0 overflow-hidden">
        {filtered.map((project, i) => (
          <Slide
            key={`${activeCategory}-${project.id}`}
            project={project}
            index={i}
            total={filtered.length}
            isActive={i === activeIndex}
            slideRef={(el) => { if (el) slidesRef.current[i] = el }}
            onNext={() => {
              const total = filteredRef.current.length
              goToSlide((i + 1) % total, 1)
            }}
            onPrev={() => {
              const total = filteredRef.current.length
              goToSlide((i - 1 + total) % total, -1)
            }}
          />
        ))}
      </div>

      {/* ── Overlay de transition cinématique ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-40 items-center justify-center"
        style={{
          display: 'none',
          backgroundColor: '#080808',
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        }}
        aria-hidden="true"
      >
        <div
          ref={overlayLabelRef}
          className="font-display font-bold text-center tracking-[-0.03em] select-none"
          style={{
            fontSize: 'clamp(1.8rem, 6vw, 7rem)',
            color: '#F8F4EE',
            letterSpacing: '-0.03em',
            opacity: 0,
          }}
        />
      </div>

      {/* ── Barre de timer ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{ height: '2px', backgroundColor: 'rgba(248,244,238,0.07)' }}
      >
        <div
          ref={timerBarRef}
          style={{
            height: '100%',
            backgroundColor: current?.accent ?? '#FF6A3D',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            transition: 'background-color 0.6s ease',
          }}
        />
      </div>

      {/* ── UI bas de page ── */}
      <div className="absolute bottom-5 left-7 md:left-14 right-7 md:right-14 z-30 flex items-center justify-between">

        {/* Dots + compteur */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {filtered.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i, i >= activeIndex ? 1 : -1)}
                style={{
                  width: i === activeIndex ? '22px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: i === activeIndex
                    ? (current?.accent ?? '#FF6A3D')
                    : 'rgba(248,244,238,0.18)',
                  transition: 'all 0.4s ease',
                  cursor: 'none',
                  border: 'none',
                  padding: 0,
                }}
                aria-label={`Aller au projet ${i + 1}`}
                data-cursor="link"
              />
            ))}
          </div>
          <span
            className="font-display font-semibold tracking-[-0.02em]"
            style={{ fontSize: '1rem', color: 'rgba(248,244,238,0.28)', lineHeight: 1 }}
          >
            <span style={{ color: '#F8F4EE', fontSize: '1.1rem' }}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            {' '}/ {String(filtered.length).padStart(2, '0')}
          </span>
        </div>

        {/* Flèches */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              const total = filteredRef.current.length
              goToSlide((activeIndex - 1 + total) % total, -1)
            }}
            className="w-9 h-9 flex items-center justify-center transition-colors"
            style={{ borderRadius: '2px', border: '1px solid rgba(248,244,238,0.18)' }}
            aria-label="Précédent"
            data-cursor="link"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M9 5.5H2M2 5.5L5.5 2M2 5.5L5.5 9" stroke="rgba(248,244,238,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => {
              const total = filteredRef.current.length
              goToSlide((activeIndex + 1) % total, 1)
            }}
            className="w-9 h-9 flex items-center justify-center transition-colors"
            style={{ borderRadius: '2px', border: '1px solid rgba(248,244,238,0.18)' }}
            aria-label="Suivant"
            data-cursor="link"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5H9M9 5.5L5.5 2M9 5.5L5.5 9" stroke="rgba(248,244,238,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────
   Slide component
────────────────────────────────────── */
interface SlideProps {
  project: Project
  index: number
  total: number
  isActive: boolean
  slideRef: (el: HTMLDivElement | null) => void
  onNext: () => void
  onPrev: () => void
}

function Slide({ project, index, isActive, slideRef, onNext, onPrev }: SlideProps) {
  const imgRef     = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const innerRef   = useRef<HTMLDivElement | null>(null)

  /* Reveal du contenu quand la slide devient active */
  useEffect(() => {
    if (!isActive || !contentRef.current) return
    const children = Array.from(contentRef.current.children)
    gsap.fromTo(
      children,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.65,
        delay: TRANSITION_DURATION * 0.5,
        ease: 'power3.out',
      }
    )
  }, [isActive])

  /* Parallax souris sur desktop */
  useEffect(() => {
    if (!isActive) return
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 14
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      if (imgRef.current) gsap.to(imgRef.current, { x, y, duration: 1.4, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [isActive])

  return (
    <div
      ref={(el) => {
        ;(innerRef as MutableRefObject<HTMLDivElement | null>).current = el
        slideRef(el)
      }}
      className="absolute inset-0"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Image full-bleed — fonctionne pour tous les formats et tous les écrans */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0" style={{ backgroundColor: `${project.accent}12` }} />

        <div ref={imgRef} className="absolute inset-0 will-change-transform" style={{ scale: 1.06 }}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.88) 0%, rgba(12,12,12,0.18) 45%, transparent 100%)',
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(12,12,12,0.35) 0%, transparent 50%)',
          }} />
        </div>

        {/* Contenu bas-gauche */}
        <div ref={contentRef} className="absolute bottom-20 md:bottom-24 left-7 md:left-14 z-10 max-w-sm md:max-w-lg">
          <SlideContent project={project} />
        </div>
      </div>

      {/* Zones de clic prev/next invisibles */}
      <button
        className="absolute inset-y-0 left-0 z-20 opacity-0"
        style={{ width: '15%' }}
        onClick={onPrev}
        tabIndex={-1}
        aria-hidden="true"
      />
      <button
        className="absolute inset-y-0 right-0 z-20 opacity-0"
        style={{ width: '15%' }}
        onClick={onNext}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

/* ── Bloc de contenu ── */
function SlideContent({ project }: { project: Project }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <span className="w-5 h-px" style={{ backgroundColor: project.accent }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.58rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: project.accent,
        }}>
          {project.category}
        </span>
      </div>

      <h2
        className="font-display font-bold tracking-[-0.04em] leading-[0.88] mb-4"
        style={{ fontSize: 'clamp(2.4rem, 6vw, 6.5rem)', color: '#F8F4EE' }}
      >
        {project.title}
      </h2>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.82rem, 1.2vw, 0.96rem)',
        color: 'rgba(248,244,238,0.48)',
        letterSpacing: '-0.01em',
        marginBottom: '1rem',
        lineHeight: 1.6,
      }}>
        {project.subtitle}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.55rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 9px',
            border: '1px solid rgba(248,244,238,0.16)',
            borderRadius: '2px',
            color: 'rgba(248,244,238,0.48)',
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="w-4 h-px" style={{ backgroundColor: project.accent, opacity: 0.5 }} />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.58rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(248,244,238,0.38)',
        }}>
          {project.client} · {project.year}
        </span>
      </div>
    </>
  )
}
