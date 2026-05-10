'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Link from 'next/link'
import { getLenis } from '@/lib/lenis'

// ─── Data ────────────────────────────────────────────────────────────────────────

interface Pack {
  id: string
  number: string
  title: string
  subtitle: string
  tag: string
  price: string
  accent: string
  bg: string
  description: string
  includes: string[]
  note: string
}

const PACKS: Pack[] = [
  {
    id: 'content-night',
    number: '01',
    title: 'CONTENT NIGHT',
    subtitle: 'Captation nightlife immersive',
    tag: 'Événementiel',
    price: 'Sur devis',
    accent: '#FF6A3D',
    bg: 'radial-gradient(ellipse at 60% 40%, #2d1205 0%, #0d0402 70%)',
    description: 'Une présence visuelle complète sur votre événement nightlife. Photo, vidéo, reels, stories live — tout le contenu pour immortaliser et amplifier votre soirée.',
    includes: ['Captation photo et vidéo', 'Reels soirée premium', 'Stories live pour la nuit', 'Montage cinématique', 'Livraison 48h garantie'],
    note: 'Adapté selon la durée, le volume et le niveau de production.',
  },
  {
    id: 'image-identite',
    number: '02',
    title: 'IMAGE & IDENTITÉ',
    subtitle: 'Univers visuel premium',
    tag: 'Branding',
    price: 'Estimation personnalisée',
    accent: '#C8A97E',
    bg: 'radial-gradient(ellipse at 40% 60%, #1a1410 0%, #080706 70%)',
    description: 'Construction d\'un univers visuel cohérent et mémorable. Direction artistique, branding, chartes graphiques — une identité qui s\'impose dans l\'esprit.',
    includes: ['Direction artistique', 'Logo et charte graphique', 'Templates réseaux sociaux', 'Affiches événementielles', 'Identity pack complet'],
    note: 'Périmètre et délais adaptés à votre projet.',
  },
  {
    id: 'event-boost',
    number: '03',
    title: 'EVENT BOOST',
    subtitle: 'Visibilité événementielle maximale',
    tag: 'Stratégie',
    price: 'Selon le projet',
    accent: '#4A7AFF',
    bg: 'radial-gradient(ellipse at 50% 30%, #050a1a 0%, #020308 70%)',
    description: 'Une stratégie visuelle pour booster votre visibilité avant, pendant et après l\'événement. Teasing, reels, storytelling — la montée en puissance visuelle.',
    includes: ['Stratégie contenu sur mesure', 'Teasing pré-événement', 'Reels de campagne', 'Calendrier éditorial', 'Optimisation réseaux'],
    note: 'Tarification flexible selon la durée de la campagne.',
  },
  {
    id: 'full-nightlife',
    number: '04',
    title: 'FULL NIGHTLIFE',
    subtitle: 'Partenariat créatif long terme',
    tag: 'Premium',
    price: 'Sur devis',
    accent: '#FF6A3D',
    bg: 'radial-gradient(ellipse at 70% 50%, #1a1200 0%, #060502 70%)',
    description: 'Le partenariat créatif complet. Gestion d\'image, contenu récurrent, stratégie globale — un studio dédié en permanence à votre univers nightlife.',
    includes: ['Gestion image complète', 'Contenu mensuel récurrent', 'Stratégie globale', 'Branding avancé et évolutif', 'Reporting et analyse mensuelle'],
    note: 'Engagement mensuel, entièrement adapté à vos besoins.',
  },
  {
    id: 'a-la-carte',
    number: '05',
    title: 'À LA CARTE',
    subtitle: 'Composez votre projet librement',
    tag: 'Sur mesure',
    price: 'Selon votre sélection',
    accent: '#E8E0D0',
    bg: 'radial-gradient(ellipse at 50% 50%, #111111 0%, #060606 70%)',
    description: 'Choisissez précisément les services dont vous avez besoin. Chaque élément est disponible individuellement ou en combinaison — pour une réponse 100% sur mesure.',
    includes: ['Affiche événementielle', 'Logo et identité', 'Reel court format', 'Aftermovie cinématique', 'Shooting photo', 'Direction artistique', 'Audit visuel'],
    note: 'Estimation personnalisée sur chaque service sélectionné.',
  },
]

const OCTOVISUAL_INSTAGRAM = 'https://www.instagram.com/octo.visuals/'

const SERVICES = [
  { id: 'affiche', label: 'Affiche', icon: '◈' },
  { id: 'logo', label: 'Logo', icon: '◉' },
  { id: 'reel', label: 'Reel', icon: '▶' },
  { id: 'aftermovie', label: 'Aftermovie', icon: '◎' },
  { id: 'shooting', label: 'Shooting', icon: '◷' },
  { id: 'da', label: 'Direction artistique', icon: '◫' },
  { id: 'branding', label: 'Branding', icon: '◬' },
  { id: 'strategie', label: 'Stratégie', icon: '◻' },
]

// ─── Pack Card ───────────────────────────────────────────────────────────────────

function PackCard({
  pack,
  index: _index,
  cardRef,
  onOpen,
  allowInteraction = true,
}: {
  pack: Pack
  index: number
  cardRef: (el: HTMLDivElement | null) => void
  onOpen: (pack: Pack) => void
  allowInteraction?: boolean
}) {
  const innerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect()
    const cx = card.left + card.width / 2
    const cy = card.top + card.height / 2
    const dx = (e.clientX - cx) / (card.width / 2)
    const dy = (e.clientY - cy) / (card.height / 2)
    gsap.to(innerRef.current, {
      rotationY: dx * 6,
      rotationX: -dy * 4,
      z: 30,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    gsap.to(innerRef.current, {
      rotationY: 0,
      rotationX: 0,
      z: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [])

  return (
    <div
      ref={cardRef}
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 50%',
        pointerEvents: allowInteraction ? 'auto' : 'none',
      }}
      onMouseMove={allowInteraction ? handleMouseMove : undefined}
      onMouseLeave={allowInteraction ? handleMouseLeave : undefined}
      onClick={allowInteraction ? () => onOpen(pack) : undefined}
    >
      <div
        ref={innerRef}
        data-cursor="hover"
        style={{
          width: 'min(580px, 88vw)',
          height: 'min(680px, 72vh)',
          background: pack.bg,
          borderRadius: '12px',
          border: allowInteraction ? `1px solid ${pack.accent}55` : `1px solid ${pack.accent}22`,
          boxShadow: allowInteraction
            ? `0 0 0 1px rgba(248, 244, 238, 0.12), 0 0 96px ${pack.accent}26, 0 40px 120px rgba(0,0,0,0.82), inset 0 1px 0 ${pack.accent}28`
            : `0 0 80px ${pack.accent}18, 0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 ${pack.accent}18`,
          transition: 'border-color 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
          cursor: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/grain.svg')",
            backgroundSize: '200px',
            opacity: 0.04,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Ambient glow top */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${pack.accent}20 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />

        {/* Decorative lines */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            border: `1px solid ${pack.accent}18`,
            borderRadius: '50%',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: '2rem',
            right: '2rem',
            width: '40px',
            height: '40px',
            border: `1px solid ${pack.accent}12`,
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.22em',
                  color: `${pack.accent}99`,
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                {pack.number} — {pack.tag}
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.9,
                  color: '#F8F4EE',
                }}
              >
                {pack.title}
              </h2>
            </div>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.4, marginTop: '0.25rem', flexShrink: 0 }}>
              <path d="M2 14L14 2M14 2H6M14 2V10" stroke="#F8F4EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.82rem, 1.3vw, 0.95rem)',
              color: 'rgba(248,244,238,0.5)',
              lineHeight: 1.65,
              maxWidth: '400px',
            }}
          >
            {pack.description}
          </p>

          {/* Includes preview */}
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {pack.includes.slice(0, 3).map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: `${pack.accent}cc`,
                    border: `1px solid ${pack.accent}28`,
                    borderRadius: '3px',
                    padding: '0.3rem 0.65rem',
                    backgroundColor: `${pack.accent}0a`,
                  }}
                >
                  {item}
                </span>
              ))}
              {pack.includes.length > 3 && (
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(248,244,238,0.28)',
                    padding: '0.3rem 0.65rem',
                  }}
                >
                  +{pack.includes.length - 3}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.5rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(248,244,238,0.28)',
                    marginBottom: '0.3rem',
                  }}
                >
                  Tarification
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
                    fontWeight: 600,
                    color: '#F8F4EE',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {pack.price}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: pack.accent,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: '24px', height: '1px', backgroundColor: pack.accent, display: 'inline-block' }} />
                Découvrir
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pack Detail Panel ────────────────────────────────────────────────────────────

function PackDetail({ pack, onClose }: { pack: Pack; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(panelRef.current,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out' }
    )
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleClose = () => {
    gsap.to(panelRef.current, {
      opacity: 0,
      scale: 0.96,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(4,4,4,0.94)', backdropFilter: 'blur(20px)' }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl mx-4 md:mx-auto overflow-hidden"
        style={{
          borderRadius: '12px',
          background: pack.bg,
          border: `1px solid ${pack.accent}22`,
          boxShadow: `0 0 120px ${pack.accent}18, 0 60px 150px rgba(0,0,0,0.9)`,
          maxHeight: '90vh',
          overflowY: 'auto',
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
        />
        {/* Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${pack.accent}18 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />

        <div className="relative z-10 p-8 md:p-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.22em',
                  color: `${pack.accent}99`,
                  textTransform: 'uppercase',
                  marginBottom: '0.8rem',
                }}
              >
                {pack.number} — {pack.tag}
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.88,
                  color: '#F8F4EE',
                }}
              >
                {pack.title}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'rgba(248,244,238,0.4)',
                  marginTop: '0.6rem',
                  letterSpacing: '0.04em',
                }}
              >
                {pack.subtitle}
              </p>
            </div>
            <button
              onClick={handleClose}
              data-cursor="hover"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(248,244,238,0.14)',
                backgroundColor: 'rgba(248,244,238,0.06)',
                color: 'rgba(248,244,238,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'none',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.92rem',
              color: 'rgba(248,244,238,0.6)',
              lineHeight: 1.72,
              marginBottom: '2.5rem',
            }}
          >
            {pack.description}
          </p>

          {/* Includes */}
          <div className="mb-8">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.5rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(248,244,238,0.28)',
                marginBottom: '1rem',
              }}
            >
              Inclus dans ce pack
            </p>
            <div className="flex flex-col gap-3">
              {pack.includes.map((item, i) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `1px solid ${pack.accent}44`,
                      backgroundColor: `${pack.accent}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: pack.accent, display: 'block' }} />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.82rem',
                      color: 'rgba(248,244,238,0.72)',
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: `${pack.accent}77`,
              fontStyle: 'italic',
              marginBottom: '2.5rem',
              letterSpacing: '0.01em',
            }}
          >
            {pack.note}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={OCTOVISUAL_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              data-cursor="hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.9rem 2rem',
                backgroundColor: pack.accent,
                color: '#0c0c0c',
                borderRadius: '6px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'none',
                flex: 1,
              }}
            >
              Demander un devis
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M2 14L14 2M14 2H6M14 2V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={OCTOVISUAL_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              data-cursor="hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.9rem 1.5rem',
                border: `1px solid rgba(248,244,238,0.14)`,
                color: 'rgba(248,244,238,0.6)',
                borderRadius: '6px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'none',
              }}
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Configurateur ────────────────────────────────────────────────────────────────

function Configurateur() {
  const [selected, setSelected] = useState<string[]>([])

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <section
      style={{
        backgroundColor: '#060606',
        borderTop: '1px solid rgba(248,244,238,0.06)',
        padding: 'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 7vw, 6rem)',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-5 h-px bg-orange" />
          <span className="t-label text-orange tracking-[0.16em]">Configurateur</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.88,
            color: '#F8F4EE',
            marginBottom: '1.2rem',
          }}
        >
          Construire<br />votre projet.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'rgba(248,244,238,0.4)',
            lineHeight: 1.7,
            marginBottom: '3rem',
          }}
        >
          Sélectionnez les services qui correspondent à votre vision. On s'adapte à chaque projet, chaque univers.
        </p>

        {/* Service grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '3rem',
          }}
        >
          {SERVICES.map((service) => {
            const isActive = selected.includes(service.id)
            return (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                data-cursor="hover"
                style={{
                  padding: '1.1rem 1rem',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #FF6A3D' : '1px solid rgba(248,244,238,0.1)',
                  backgroundColor: isActive ? 'rgba(255,106,61,0.1)' : 'rgba(248,244,238,0.03)',
                  color: isActive ? '#FF6A3D' : 'rgba(248,244,238,0.5)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'none',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '1.1rem', opacity: 0.8 }}>{service.icon}</span>
                {service.label}
              </button>
            )
          })}
        </div>

        {/* CTA */}
        {selected.length > 0 ? (
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                color: 'rgba(248,244,238,0.3)',
                marginBottom: '1.2rem',
                letterSpacing: '0.04em',
              }}
            >
              {selected.length} service{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={OCTOVISUAL_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem 2rem',
                  backgroundColor: '#FF6A3D',
                  color: '#0c0c0c',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'none',
                }}
              >
                Contacter sur Instagram
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14L14 2M14 2H6M14 2V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button
                onClick={() => setSelected([])}
                data-cursor="hover"
                style={{
                  padding: '0.9rem 1.5rem',
                  border: '1px solid rgba(248,244,238,0.1)',
                  color: 'rgba(248,244,238,0.35)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'none',
                  backgroundColor: 'transparent',
                }}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        ) : (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              color: 'rgba(248,244,238,0.2)',
              letterSpacing: '0.06em',
              fontStyle: 'italic',
            }}
          >
            Sélectionnez au moins un service pour commencer.
          </p>
        )}
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const heroRef = useRef<HTMLElement>(null)
  const tunnelRef = useRef<HTMLElement>(null)
  const perspRef = useRef<HTMLDivElement>(null)
  const tunnelCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const bgRef = useRef<HTMLDivElement>(null)
  const tunnelSTRef = useRef<ScrollTrigger | null>(null)
  const lastTunnelIdxRef = useRef(-1)
  const [activePack, setActivePack] = useState<Pack | null>(null)
  const [activeTunnelIdx, setActiveTunnelIdx] = useState(0)

  const scrollToTunnelPack = useCallback((index: number) => {
    const section = tunnelRef.current
    const st = tunnelSTRef.current
    if (!section) return
    const denom = Math.max(1, PACKS.length - 1)
    const clamped = Math.max(0, Math.min(PACKS.length - 1, index))
    const progress = clamped / denom
    let y: number
    if (st && typeof st.start === 'number' && typeof st.end === 'number') {
      y = st.start + progress * (st.end - st.start)
    } else {
      const pinHeight = PACKS.length * window.innerHeight * 1.3
      y = section.offsetTop + progress * pinHeight
    }
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.35 })
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  /* ── Hero entrance ─────────────────────────────── */
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    const hero = heroRef.current
    if (!hero) return
    const headline = hero.querySelector('.hero-headline')
    const sub = hero.querySelector('.hero-sub')
    const hint = hero.querySelector('.hero-hint')
    gsap.set([headline, sub, hint], { opacity: 0, y: 50 })
    tl.to(headline, { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out' })
      .to(sub,      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.65')
      .to(hint,     { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
  }, [])

  /* ── Tunnel scroll ─────────────────────────────── */
  useEffect(() => {
    const section = tunnelRef.current
    if (!section) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const PIN_HEIGHT = PACKS.length * window.innerHeight * 1.3

      tunnelCardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          transformOrigin: '50% 50%',
          z: i === 0 ? 0 : -(i * 700),
          opacity: i === 0 ? 1 : 0,
          scale: 1,
          rotationY: 0,
        })
      })

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${PIN_HEIGHT}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.6,
        onUpdate: (self) => {
          const totalPacks = PACKS.length
          PACKS.forEach((_, i) => {
            const card = tunnelCardRefs.current[i]
            if (!card) return

            /* Progress quand ce pack est "à l'honneur" */
            const slot = self.progress * (totalPacks - 1)
            const dist = slot - i   /* -n..+n */

            let z: number, scale: number, opacity: number, blur: number, rotY: number

            if (dist < -1) {
              /* Très en fond */
              const t = Math.max(0, (dist + totalPacks) / totalPacks)
              z = gsap.utils.interpolate(-2800, -700, t)
              scale = gsap.utils.interpolate(0.08, 0.55, t)
              opacity = gsap.utils.interpolate(0, 0.15, t)
              blur = 28
              rotY = gsap.utils.interpolate(-18, -7, t)
            } else if (dist < 0) {
              /* Arrive */
              const t = dist + 1   /* 0→1 */
              z = gsap.utils.interpolate(-700, 0, t)
              scale = gsap.utils.interpolate(0.55, 1, t)
              opacity = gsap.utils.interpolate(0.15, 1, t)
              blur = gsap.utils.interpolate(16, 0, t)
              rotY = gsap.utils.interpolate(-7, 0, t)
            } else if (dist < 1) {
              /* Part en avant */
              const t = dist   /* 0→1 */
              z = gsap.utils.interpolate(0, 350, t)
              scale = gsap.utils.interpolate(1, 1.12, t)
              opacity = gsap.utils.interpolate(1, 0, t)
              blur = gsap.utils.interpolate(0, 18, t)
              rotY = gsap.utils.interpolate(0, 8, t)
            } else {
              z = 400; scale = 1.15; opacity = 0; blur = 22; rotY = 10
            }

            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              transformOrigin: '50% 50%',
              z,
              scale,
              opacity,
              filter: `blur(${blur}px)`,
              rotationY: rotY,
            })
          })

          const hi = Math.round(self.progress * (PACKS.length - 1))
          const idx = Math.min(Math.max(0, hi), PACKS.length - 1)
          if (idx !== lastTunnelIdxRef.current) {
            lastTunnelIdxRef.current = idx
            setActiveTunnelIdx(idx)
          }

          /* Background accent color transition */
          if (bgRef.current) {
            const pack = PACKS[idx]
            bgRef.current.style.background = `radial-gradient(ellipse at 50% 45%, ${pack.accent}12 0%, transparent 70%)`
          }
        },
      })

      tunnelSTRef.current = st

      return () => {
        tunnelSTRef.current = null
        st.kill()
        lastTunnelIdxRef.current = -1
        tunnelCardRefs.current.forEach((card) => {
          if (card) gsap.set(card, { clearProps: 'all' })
        })
      }
    })

    /* Mobile: fade-in par carte au scroll — refs séparées pour ne pas écraser le tunnel desktop */
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      mobileCardRefs.current.forEach((card) => {
        if (!card) return
        gsap.set(card, { opacity: 0, y: 60 })
        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          once: true,
          onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }),
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <div style={{ backgroundColor: '#060606', color: '#F8F4EE', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          height: '100vh',
          background: 'radial-gradient(ellipse at 50% 60%, #1a0902 0%, #060606 65%)',
        }}
      >
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "url('/grain.svg')", backgroundSize: '200px', opacity: 0.04, mixBlendMode: 'overlay' }}
        />

        {/* Ambient circle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            border: '1px solid rgba(255,106,61,0.06)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '1px solid rgba(255,106,61,0.1)',
            background: 'radial-gradient(circle, rgba(255,106,61,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center px-6">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-8 h-px bg-orange opacity-60" />
            <span className="t-label text-orange tracking-[0.22em] opacity-70">OctoVisual Studio</span>
            <span className="w-8 h-px bg-orange opacity-60" />
          </div>

          <h1
            className="hero-headline font-display font-bold"
            style={{
              fontSize: 'clamp(3.5rem, 10vw, 10rem)',
              letterSpacing: '-0.05em',
              lineHeight: 0.86,
              marginBottom: '2rem',
            }}
          >
            Show<br />
            <span style={{ color: '#FF6A3D' }}>room.</span>
          </h1>

          <p
            className="hero-sub"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.88rem, 1.6vw, 1.05rem)',
              color: 'rgba(248,244,238,0.45)',
              maxWidth: '420px',
              margin: '0 auto 3rem',
              lineHeight: 1.7,
            }}
          >
            Cinq packs créatifs. Un seul objectif : faire de votre univers nightlife une image inoubliable.
          </p>

          {/* Scroll hint */}
          <div className="hero-hint flex flex-col items-center gap-2" style={{ opacity: 0.4 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Faites défiler
            </p>
            <div
              style={{
                width: '1px',
                height: '40px',
                background: 'linear-gradient(to bottom, rgba(255,106,61,0.8), transparent)',
                animation: 'scrollLine 1.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Pack Tunnel ──────────────────────────────────── */}
      <section
        ref={tunnelRef}
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#060606',
        }}
        aria-label="Nos packs"
      >
        {/* Dynamic background glow */}
        <div
          ref={bgRef}
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,106,61,0.12) 0%, transparent 70%)' }}
        />

        {/* Perspective tunnel */}
        <div
          ref={perspRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}
        >

          {/* Desktop: absolute stacked tunnel cards */}
          <div
            className="hidden md:block relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {PACKS.map((pack, i) => (
              <PackCard
                key={pack.id}
                pack={pack}
                index={i}
                cardRef={(el) => { tunnelCardRefs.current[i] = el }}
                onOpen={setActivePack}
                allowInteraction={activeTunnelIdx === i}
              />
            ))}
          </div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden w-full h-full overflow-y-auto px-4 py-8 flex flex-col gap-6 items-center">
            {PACKS.map((pack, i) => (
              <div
                key={pack.id}
                ref={(el) => { mobileCardRefs.current[i] = el }}
                onClick={() => setActivePack(pack)}
                data-cursor="hover"
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  background: pack.bg,
                  borderRadius: '10px',
                  border: `1px solid ${pack.accent}22`,
                  boxShadow: `0 0 40px ${pack.accent}14`,
                  padding: '2rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.2em', color: `${pack.accent}99`, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {pack.number} — {pack.tag}
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, color: '#F8F4EE', marginBottom: '0.8rem' }}>
                  {pack.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(248,244,238,0.45)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {pack.description}
                </p>
                <div className="flex items-center gap-2" style={{ color: pack.accent, fontFamily: 'var(--font-body)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  <span style={{ width: '18px', height: '1px', backgroundColor: pack.accent, display: 'inline-block' }} />
                  {pack.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation packs desktop — profondeur + accès direct */}
        <div
          className="hidden md:flex absolute bottom-6 left-0 right-0 z-30 flex-col items-center gap-4 px-6 pointer-events-none"
        >
          <p
            className="pointer-events-none text-center uppercase tracking-[0.28em]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.48rem',
              color: 'rgba(248,244,238,0.35)',
            }}
          >
            Parcourez les packs · scroll ou clic
          </p>
          <div className="flex items-center gap-5 pointer-events-auto">
            <button
              type="button"
              data-cursor="hover"
              onClick={() => scrollToTunnelPack(activeTunnelIdx - 1)}
              disabled={activeTunnelIdx <= 0}
              aria-label="Pack précédent"
              className="disabled:opacity-20 disabled:pointer-events-none transition-opacity"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid rgba(248,244,238,0.12)',
                backgroundColor: 'rgba(248,244,238,0.04)',
                color: '#F8F4EE',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                cursor: 'none',
              }}
            >
              ←
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center max-w-[min(720px,90vw)]">
              {PACKS.map((pack, i) => {
                const active = i === activeTunnelIdx
                return (
                  <button
                    key={pack.id}
                    type="button"
                    data-cursor="hover"
                    onClick={() => scrollToTunnelPack(i)}
                    aria-label={`Pack ${pack.number} ${pack.title}`}
                    aria-current={active ? 'step' : undefined}
                    className="group flex flex-col items-center gap-1 transition-all duration-500"
                    style={{
                      cursor: 'none',
                      minWidth: '52px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.42rem',
                        letterSpacing: '0.14em',
                        color: active ? pack.accent : 'rgba(248,244,238,0.22)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {pack.number}
                    </span>
                    <span
                      style={{
                        height: active ? '4px' : '2px',
                        width: active ? '48px' : '22px',
                        borderRadius: '2px',
                        backgroundColor: active ? pack.accent : 'rgba(248,244,238,0.18)',
                        boxShadow: active ? `0 0 16px ${pack.accent}44` : 'none',
                        transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: active ? 'translateZ(0) scaleX(1)' : 'scaleX(1)',
                      }}
                    />
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              data-cursor="hover"
              onClick={() => scrollToTunnelPack(activeTunnelIdx + 1)}
              disabled={activeTunnelIdx >= PACKS.length - 1}
              aria-label="Pack suivant"
              className="disabled:opacity-20 disabled:pointer-events-none transition-opacity"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid rgba(248,244,238,0.12)',
                backgroundColor: 'rgba(248,244,238,0.04)',
                color: '#F8F4EE',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                cursor: 'none',
              }}
            >
              →
            </button>
          </div>

          <p
            className="pointer-events-none text-center max-w-md px-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#F8F4EE',
              opacity: 0.85,
            }}
          >
            {PACKS[activeTunnelIdx]?.title}
          </p>
        </div>
      </section>

      {/* ── Configurateur ──────────────────────────────── */}
      <Configurateur />

      {/* ── Final CTA ──────────────────────────────────── */}
      <section
        style={{
          backgroundColor: '#060606',
          borderTop: '1px solid rgba(248,244,238,0.06)',
          padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 7vw, 6rem)',
          textAlign: 'center',
        }}
      >
        <p
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', letterSpacing: '0.22em', color: '#FF6A3D', textTransform: 'uppercase', marginBottom: '1.5rem' }}
        >
          Prêt à commencer ?
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            lineHeight: 0.86,
            color: '#F8F4EE',
            marginBottom: '2rem',
          }}
        >
          Parlons de<br />votre projet.
        </h2>
        <Link
          href={OCTOVISUAL_INSTAGRAM}
          data-cursor="hover"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '1rem 2.5rem',
            backgroundColor: '#FF6A3D',
            color: '#0c0c0c',
            borderRadius: '6px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'none',
          }}
        >
          Nous contacter
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M2 14L14 2M14 2H6M14 2V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* ── Pack Detail Overlay ─────────────────────────── */}
      {activePack && (
        <PackDetail pack={activePack} onClose={() => setActivePack(null)} />
      )}

      {/* Scroll line animation */}
      <style>{`
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
