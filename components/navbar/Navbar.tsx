'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { WaveShape, LineShape } from '@/components/shapes'

const NAV_LINKS = [
  { label: 'Accueil', href: 'https://octovisuals.fr/', num: '01' },
  { label: 'Showroom', href: '/product', num: '02' },
  { label: 'Travaux', href: '#gallery', num: '03' },
  { label: 'Vidéo', href: '#videos', num: '04' },
  { label: 'Studio', href: '#about', num: '05' },
  { label: 'Contact', href: '#contact', num: '06' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/octo.visuals/' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBgRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLLIElement[]>([])
  const lineRefs = useRef<HTMLSpanElement[]>([])
  const metaRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const menu = menuRef.current
    const bg = menuBgRef.current
    if (!menu || !bg) return

    if (open) {
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      gsap.set(menu, { display: 'flex' })

      const tl = gsap.timeline()

      // Background reveal
      tl.fromTo(
        bg,
        { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.75,
          ease: 'power4.inOut',
        }
      )

      // Nav items stagger
      tl.fromTo(
        menuItemsRef.current,
        { y: 100, opacity: 0, skewY: 6 },
        {
          y: 0,
          opacity: 1,
          skewY: 0,
          stagger: 0.09,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.4'
      )

      // Decorative lines
      tl.fromTo(
        lineRefs.current,
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )

      // Meta
      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
    } else {
      document.body.style.overflow = ''

      gsap.to(menuItemsRef.current, {
        y: -40,
        opacity: 0,
        stagger: 0.04,
        duration: 0.4,
        ease: 'power3.in',
      })
      gsap.to(bg, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        duration: 0.55,
        delay: 0.15,
        ease: 'power4.inOut',
        onComplete: () => gsap.set(menu, { display: 'none' }),
      })
    }
  }, [open])

  const handleLinkClick = () => setOpen(false)

  return (
    <>
      {/* Navbar */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-7 md:px-12 h-[3.75rem] transition-all duration-500 ${
          scrolled
            ? 'bg-cream/85 backdrop-blur-sm border-b border-sand/25'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <a
          href="/"
          className="font-display font-semibold text-[0.92rem] tracking-[-0.02em] text-ink select-none"
          data-cursor="link"
          data-magnetic
        >
          OctoVisual
        </a>

        {/* Center label (hidden on mobile) */}
        <span className="hidden md:block t-label text-ink/30 tracking-[0.15em]">
          Nightlife Visual Studio
        </span>

        {/* Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="relative z-[1001] flex flex-col gap-[5px] w-7 h-5 justify-center"
          data-cursor="link"
          data-magnetic
        >
          <span
            className="block h-px bg-ink transition-all duration-500 origin-center will-change-transform"
            style={{
              transform: open ? 'rotate(45deg) translateY(6px)' : 'none',
              width: '100%',
            }}
          />
          <span
            className="block h-px bg-ink transition-all duration-500"
            style={{
              opacity: open ? 0 : 1,
              transform: open ? 'scaleX(0)' : 'scaleX(1)',
              width: '75%',
            }}
          />
          <span
            className="block h-px bg-ink transition-all duration-500 origin-center will-change-transform"
            style={{
              transform: open ? 'rotate(-45deg) translateY(-6px)' : 'none',
              width: open ? '100%' : '50%',
            }}
          />
        </button>
      </nav>

      {/* Full-screen menu container */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[998] hidden flex-col overflow-hidden"
        aria-hidden={!open}
      >
        {/* Menu background */}
        <div
          ref={menuBgRef}
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(150deg, #FF6A3D 0%, #F3EEE6 45%, #E7C9A9 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          }}
        />

        {/* Decorative SVG elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[18%] right-[6%] opacity-20">
            <WaveShape color="#121212" size={360} rotation={-10} strokeWidth={0.8} />
          </div>
          <div className="absolute bottom-[12%] left-[4%] opacity-10">
            <LineShape color="#121212" size={200} rotation={30} />
          </div>
        </div>

        {/* Navigation list */}
        <ul className="relative z-10 flex flex-col justify-center flex-1 px-10 md:px-16 pt-20 gap-0">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              ref={(el) => {
                if (el) menuItemsRef.current[i] = el
              }}
              className="relative"
            >
              <a
                href={link.href}
                onClick={handleLinkClick}
                className="group flex items-baseline gap-5 py-5 md:py-6"
                data-cursor="hover"
              >
                <span className="t-label text-ink/30 tabular-nums shrink-0 pt-1">
                  {link.num}
                </span>
                <span
                  className="block font-display font-semibold text-ink tracking-[-0.03em] leading-[0.93] transition-transform duration-500 ease-[var(--ease-cinema)] group-hover:translate-x-4"
                  style={{ fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)' }}
                >
                  {link.label}
                </span>
                {/* Arrow */}
                <span className="ml-auto text-ink/40 text-2xl font-light transition-all duration-400 group-hover:translate-x-2 group-hover:text-ink">
                  →
                </span>
              </a>
              {/* Separator line */}
              <span
                ref={(el) => {
                  if (el) lineRefs.current[i] = el
                }}
                className="block h-px bg-ink/12 origin-left will-change-transform"
              />
            </li>
          ))}
        </ul>

        {/* Footer meta */}
        <div
          ref={metaRef}
          className="relative z-10 px-10 md:px-16 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <p className="t-label text-ink/40 tracking-[0.12em]">
            Studio Créatif Indépendant © 2024
          </p>
          <div className="flex gap-7">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="t-label text-ink/50 hover:text-ink transition-colors duration-300 tracking-[0.1em]"
                data-cursor="link"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
