import { videos } from '@/data/videos'

/** Origines des médias du tunnel (Blob, CDN) pour <link rel="preconnect"> côté layout */
export function mediaPreconnectOrigins(): string[] {
  const o = new Set<string>()
  for (const v of videos) {
    try {
      o.add(new URL(v.videoUrl).origin)
    } catch {
      /* ignore */
    }
    try {
      if (v.thumbnail?.startsWith('http')) {
        o.add(new URL(v.thumbnail).origin)
      }
    } catch {
      /* ignore */
    }
  }
  return Array.from(o)
}
