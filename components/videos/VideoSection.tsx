'use client'

import { useEffect, useRef, useState } from 'react'
import { useRunWhenNearViewport } from '@/hooks/useRunWhenNearViewport'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { IS_DEV } from '@/lib/runtime'
import { videos } from '@/data/videos'

/* ──────────────────────────────────────────────────────────────
   Helper : hex → "r,g,b" pour les box-shadow colorées
────────────────────────────────────────────────────────────── */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

/* ──────────────────────────────────────────────────────────────
   Tunnel : 20 cartes réparties sur 5 couches de profondeur
   x / y  = décalage depuis le centre de l'écran (px)
   z      = profondeur 3D (négatif = devant la caméra)
   ry/rx  = rotation de la carte (degrés)
   w      = largeur de la carte (px)

   Distribution intentionnellement plus dense dans les couches
   profondes : plus on avance, plus on en voit.
────────────────────────────────────────────────────────────── */
type TunnelItem = { vi: number; x: number; y: number; z: number; ry: number; rx: number; w: number }

const TUNNEL: TunnelItem[] = [
  /* ── Couche A : visible dès l'entrée (2 cartes) ── */
  { vi: 2, x: -230, y:  -20, z:   -130, ry: -11, rx:  3, w: 230 },
  { vi: 5, x:  200, y:   15, z:   -420, ry:  10, rx: -2, w: 210 },

  /* ── Couche B : proche — 3 cartes ── */
  { vi: 0, x: -270, y:   40, z:   -720, ry:  14, rx: -3, w: 195 },
  { vi: 3, x:  245, y:  -35, z:  -1050, ry: -13, rx:  2, w: 185 },
  { vi: 1, x:   20, y:  -55, z:  -1500, ry:   6, rx:  4, w: 200 },

  /* ── Couche C : milieu — 4 cartes ── */
  { vi: 4, x: -325, y:   55, z:  -1950, ry:  17, rx: -4, w: 180 },
  { vi: 2, x:  300, y:  -40, z:  -2400, ry: -16, rx:  3, w: 175 },
  { vi: 0, x:  -30, y:   70, z:  -2900, ry:   8, rx: -5, w: 185 },
  { vi: 5, x: -290, y:  -35, z:  -3350, ry:  19, rx: -2, w: 170 },

  /* ── Couche D : profond — 5 cartes ── */
  { vi: 3, x:  345, y:   40, z:  -3800, ry: -18, rx:  4, w: 168 },
  { vi: 1, x:   40, y:  -75, z:  -4200, ry:   9, rx:  5, w: 175 },
  { vi: 4, x: -380, y:   55, z:  -4650, ry:  22, rx: -3, w: 162 },
  { vi: 2, x:  320, y:  -50, z:  -5000, ry: -17, rx:  3, w: 165 },
  { vi: 0, x:  -20, y:   45, z:  -5400, ry:   5, rx: -4, w: 168 },

  /* ── Couche E : très profond — 6 cartes (cluster final) ── */
  { vi: 5, x: -410, y:  -65, z:  -5850, ry:  23, rx: -5, w: 157 },
  { vi: 3, x:  370, y:   55, z:  -6200, ry: -21, rx:  4, w: 152 },
  { vi: 1, x:  -45, y: -110, z:  -6500, ry:   7, rx:  7, w: 154 },
  { vi: 4, x: -315, y:   85, z:  -6750, ry:  17, rx: -3, w: 148 },
  { vi: 2, x:  295, y:  -60, z:  -6850, ry: -16, rx:  3, w: 144 },
  { vi: 0, x:   20, y:   38, z:  -7000, ry:   4, rx: -2, w: 150 },
]

/*
  SCROLL_DEPTH = distance Z totale parcourue par la caméra
  PIN_DISTANCE = nb de hauteurs d'écran disponibles pour scroller
  scrub        = inertie de l'animation (secondes de délai)
*/
const SCROLL_DEPTH = 7500
const PIN_DISTANCE = 6
const STARFIELD_COUNT = IS_DEV ? 64 : 220

export default function VideoSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const cameraRef   = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const starsRef    = useRef<HTMLCanvasElement>(null)
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([])
  const videoElRefs = useRef<(HTMLVideoElement | null)[]>([])

  const nearViewport = useRunWhenNearViewport(sectionRef, '380px')

  /* Facteur d'échelle viewport : réduit les offsets x/y et largeurs sur mobile */
  const [vpScale, setVpScale] = useState(1)

  useEffect(() => {
    setVpScale(Math.min(1, Math.max(0.28, window.innerWidth / 1400)))
  }, [])

  useEffect(() => {
    if (!nearViewport) return
    /* ── Champ d'étoiles statiques ── */
    const canvas = starsRef.current
    if (canvas) {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        for (let i = 0; i < STARFIELD_COUNT; i++) {
          ctx.beginPath()
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 1.4 + 0.15,
            0, Math.PI * 2,
          )
          ctx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.45 + 0.04).toFixed(2)})`
          ctx.fill()
        }
      }
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const section = sectionRef.current
    const camera  = cameraRef.current
    const title   = titleRef.current
    const label   = labelRef.current
    if (!section || !camera || !title || !label) return

    /* ── Lazy video: play only when section is visible ── */
    const videoIO = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          videoElRefs.current.forEach((v) => v?.play().catch(() => {}))
        } else {
          videoElRefs.current.forEach((v) => v?.pause())
        }
      },
      { threshold: 0.1 }
    )
    videoIO.observe(section)

    /* ── Reveal du titre à l'entrée dans le viewport ── */
    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(label,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        )
        gsap.fromTo(title,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.15 },
        )
      },
      once: true,
    })

    /* ── Pin + traversée du tunnel 3D ── */
    const pinDist = window.innerWidth < 768 ? 4 : PIN_DISTANCE
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${window.innerHeight * pinDist}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const p       = self.progress
        const cameraZ = SCROLL_DEPTH * p

        /* Avance de la caméra en profondeur */
        gsap.set(camera, { translateZ: cameraZ })

        /* Disparition progressive du titre */
        gsap.set(title, { opacity: Math.max(0, 1 - p * 5), y: -p * 50 })
        gsap.set(label, { opacity: Math.max(0, 1 - p * 6) })

        /* Barre de progression */
        if (progressRef.current) {
          gsap.set(progressRef.current, {
            scaleX: p,
            transformOrigin: 'left center',
          })
        }

        /*
          Opacité par carte selon la distance absolue à la caméra :
            aZ < -3500       → invisible (trop loin, pas encore visible)
            -3500 → -500     → fondu progressif (apparition depuis les profondeurs)
            -500  → +200     → pleinement visible (zone idéale)
            +200  → +900     → fondu de sortie (passe devant la caméra)
            > +900           → invisible (déjà passé)
        */
        cardRefs.current.forEach((card, i) => {
          if (!card || !TUNNEL[i]) return
          const aZ = TUNNEL[i].z + cameraZ
          let op: number

          if (aZ < -3500) {
            op = 0
          } else if (aZ < -500) {
            op = (aZ + 3500) / 3000
          } else if (aZ < 200) {
            op = 1
          } else if (aZ < 900) {
            op = Math.max(0, 1 - (aZ - 200) / 700)
          } else {
            op = 0
          }

          gsap.set(card, {
            opacity: op,
            pointerEvents: op > 0.4 ? 'auto' : 'none',
          })
        })
      },
    })

    return () => {
      st.kill()
      videoIO.disconnect()
      videoElRefs.current.forEach((v) => v?.pause())
    }
  }, [nearViewport])

  const bokehBlurA = IS_DEV ? 28 : 55
  const bokehBlurB = IS_DEV ? 34 : 70

  return (
    <section
      ref={sectionRef}
      id="videos"
      className="relative overflow-hidden"
      style={{ height: '100vh', backgroundColor: '#050505' }}
    >
      {/* ── Champ d'étoiles ── */}
      <canvas
        ref={starsRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.65 }}
        aria-hidden="true"
      />

      {/* ── Ambiance colorée (bokeh) ── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <div style={{
          position: 'absolute', top: '15%', left: '18%',
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,106,61,0.08) 0%, transparent 70%)',
          filter: `blur(${bokehBlurA}px)`,
        }} />
        <div style={{
          position: 'absolute', top: '58%', left: '62%',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,75,255,0.07) 0%, transparent 70%)',
          filter: `blur(${bokehBlurA}px)`,
        }} />
        <div style={{
          position: 'absolute', top: '38%', left: '42%',
          width: 600, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(130,40,180,0.05) 0%, transparent 70%)',
          filter: `blur(${bokehBlurB}px)`,
        }} />
      </div>

      {/* ── Vignette de profondeur ── */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse 62% 54% at 50% 50%, transparent 0%, rgba(5,5,5,0.25) 55%, rgba(5,5,5,0.92) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #050505 0%, transparent 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, #050505 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* ── En-tête ── */}
      <div className="absolute top-0 left-0 right-0 z-30 px-7 md:px-14 pt-14">
        <div
          ref={labelRef}
          className="flex items-center gap-3 mb-4"
          style={{ opacity: 0 }}
        >
          <span className="w-7 h-px bg-orange" />
          <span className="t-label text-orange tracking-[0.16em]">Vidéo Nightlife</span>
        </div>
        <h2
          ref={titleRef}
          className="font-display font-bold tracking-[-0.04em] leading-[0.9]"
          style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            color: '#F8F4EE',
            opacity: 0,
          }}
        >
          Aftermovies<br />&amp; Reels
        </h2>
      </div>

      {/* ── Scène 3D ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: '700px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Groupe caméra — translate en Z au scroll */}
        <div
          ref={cameraRef}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0)',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {TUNNEL.map((item, i) => {
            const vid  = videos[item.vi % videos.length]
            /* Réduction proportionnelle sur petits écrans */
            const s    = vpScale
            const wPx  = Math.round(item.w * Math.max(0.52, s))
            const h    = Math.round(wPx * 16 / 9)
            const xPx  = Math.round(item.x * s)
            const yPx  = Math.round(item.y * s)
            const rgb  = hexToRgb(vid.accent)

            return (
              <div
                key={`tc-${i}`}
                ref={(el) => { cardRefs.current[i] = el }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width:  `${wPx}px`,
                  height: `${h}px`,
                  transform: `
                    translate(-50%, -50%)
                    translateX(${xPx}px)
                    translateY(${yPx}px)
                    translateZ(${item.z}px)
                    rotateY(${item.ry}deg)
                    rotateX(${item.rx}deg)
                  `,
                  opacity: 0,
                  willChange: 'opacity',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  boxShadow: IS_DEV
                    ? `0 18px 48px rgba(0,0,0,0.82),
                      0 0 0 1px rgba(255,255,255,0.07),
                      0 0 36px rgba(${rgb},0.14)`
                    : `0 28px 75px rgba(0,0,0,0.88),
                      0 0 0 1px rgba(255,255,255,0.07),
                      0 0 60px rgba(${rgb},0.18)`,
                }}
              >
                {/* Vidéo lazy — joue uniquement quand la section est dans le viewport */}
                <video
                  ref={(el) => { videoElRefs.current[i] = el }}
                  src={vid.videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  preload="none"
                />

                {/* Dégradé bas */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
                  }}
                />

                {/* Badge catégorie */}
                <div className="absolute top-3 left-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      backgroundColor: vid.accent,
                      color: '#fff',
                      borderRadius: '4px',
                      opacity: 0.92,
                    }}
                  >
                    {vid.category}
                  </span>
                </div>

                {/* Titre + client */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: '#F8F4EE',
                      lineHeight: 1.2,
                    }}
                  >
                    {vid.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.54rem',
                      color: 'rgba(248,244,238,0.45)',
                      marginTop: '3px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {vid.client}
                  </p>
                </div>

                {/* Reflet haut */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.16), transparent)',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Barre de progression de profondeur ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        <div
          ref={progressRef}
          style={{
            height: '100%',
            backgroundColor: '#FF6A3D',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
      </div>
    </section>
  )
}
