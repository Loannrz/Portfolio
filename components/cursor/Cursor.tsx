'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from '@/lib/gsap'

type CursorState = 'default' | 'hover' | 'link' | 'play' | 'drag'

const CURSOR_CONFIG: Record<
  CursorState,
  { label: string; size: number; borderColor: string; bgColor: string; labelColor: string }
> = {
  default: {
    label: '',
    size: 18,
    borderColor: 'rgba(18,18,18,0.5)',
    bgColor: 'transparent',
    labelColor: '#FF6A3D',
  },
  hover: {
    label: 'VOIR',
    size: 76,
    borderColor: '#FF6A3D',
    bgColor: 'rgba(255,106,61,0.08)',
    labelColor: '#FF6A3D',
  },
  link: {
    label: 'OUVRIR',
    size: 68,
    borderColor: '#121212',
    bgColor: 'rgba(18,18,18,0.06)',
    labelColor: '#121212',
  },
  play: {
    label: '▶ PLAY',
    size: 88,
    borderColor: '#FF6A3D',
    bgColor: 'rgba(255,106,61,0.1)',
    labelColor: '#FF6A3D',
  },
  drag: {
    label: 'DRAG',
    size: 72,
    borderColor: '#2D4BFF',
    bgColor: 'rgba(45,75,255,0.07)',
    labelColor: '#2D4BFF',
  },
}

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<CursorState>('default')
  const [visible, setVisible] = useState(false)
  const currentState = useRef<CursorState>('default')
  const magnetTarget = useRef<Element | null>(null)
  const rafId = useRef<number>(0)
  const mouse = useRef({ x: -200, y: -200 })
  const ringPos = useRef({ x: -200, y: -200 })

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const updateCursorState = useCallback((newState: CursorState) => {
    if (newState === currentState.current) return
    currentState.current = newState
    setState(newState)

    const cfg = CURSOR_CONFIG[newState]
    const ring = ringRef.current
    if (!ring) return

    gsap.to(ring, {
      width: cfg.size,
      height: cfg.size,
      borderColor: cfg.borderColor,
      backgroundColor: cfg.bgColor,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) return

    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    // RAF loop for smooth ring follow
    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.12)
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.12)

      ring.style.transform = `translate(${ringPos.current.x - CURSOR_CONFIG[currentState.current].size / 2}px, ${ringPos.current.y - CURSOR_CONFIG[currentState.current].size / 2}px)`
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      setVisible(true)

      gsap.to(dot, {
        x: e.clientX - 3,
        y: e.clientY - 3,
        duration: 0.08,
        ease: 'none',
      })

      // Magnetic effect
      const mag = magnetTarget.current
      if (mag) {
        const rect = mag.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        gsap.to(mag, {
          x: dx * 0.3,
          y: dy * 0.3,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    }

    const onLeave = () => setVisible(false)

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const magEl = target.closest('[data-magnetic]')
      if (magEl !== magnetTarget.current) {
        if (magnetTarget.current) {
          gsap.to(magnetTarget.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' })
        }
        magnetTarget.current = magEl
      }

      if (target.closest('[data-cursor="play"]')) {
        updateCursorState('play')
      } else if (target.closest('[data-cursor="drag"]')) {
        updateCursorState('drag')
      } else if (target.closest('[data-cursor="hover"]')) {
        updateCursorState('hover')
      } else if (target.closest('a, button, [role="button"]')) {
        updateCursorState('link')
      } else {
        updateCursorState('default')
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver)

    return () => {
      cancelAnimationFrame(rafId.current)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
    }
  }, [updateCursorState])

  // Label transition
  useEffect(() => {
    const label = labelRef.current
    if (!label) return
    const cfg = CURSOR_CONFIG[state]

    gsap.fromTo(
      label,
      { opacity: 0, scale: 0.8 },
      { opacity: cfg.label ? 1 : 0, scale: 1, duration: 0.25, ease: 'power2.out' }
    )
    label.style.color = cfg.labelColor
  }, [state])

  return (
    <>
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: CURSOR_CONFIG.default.size,
          height: CURSOR_CONFIG.default.size,
          borderRadius: '50%',
          border: `1.5px solid ${CURSOR_CONFIG.default.borderColor}`,
          pointerEvents: 'none',
          zIndex: 99998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
          mixBlendMode: 'multiply',
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            color: '#FF6A3D',
            opacity: 0,
          }}
        >
          {CURSOR_CONFIG[state].label}
        </span>
      </div>

      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#FF6A3D',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}
