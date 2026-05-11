'use client'

import { useEffect } from 'react'
import { videos } from '@/data/videos'

/**
 * Pendant l’intro / le premier idle TCP, précharge les métadonnées (et amorce le cache)
 * des URLs vidéo du tunnel pour limiter les saccades en scroll rapide dans la section.
 */
export default function TunnelVideoWarmup() {
  useEffect(() => {
    const urls = [...new Set(videos.map((v) => v.videoUrl).filter(Boolean))]

    const warmOne = (url: string) =>
      new Promise<void>((resolve) => {
        const el = document.createElement('video')
        el.preload = 'metadata'
        el.muted = true
        el.src = url
        const done = () => {
          el.removeAttribute('src')
          el.load()
          resolve()
        }
        el.addEventListener('loadedmetadata', done, { once: true })
        el.addEventListener('error', done, { once: true })
        el.load()
      })

    const run = () => {
      void Promise.all(urls.map(warmOne))
    }

    const ric =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback
        : (cb: IdleRequestCallback) =>
            window.setTimeout(() => {
              cb({
                didTimeout: true,
                timeRemaining: () => 0,
              })
            }, 900)

    const idleId = ric(
      () => {
        void run()
      },
      { timeout: 5000 },
    )

    return () => {
      if (typeof window.cancelIdleCallback === 'function') {
        cancelIdleCallback(idleId as number)
      }
    }
  }, [])

  return null
}
