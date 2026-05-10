import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import '@/app/globals.scss'

const LenisProvider = dynamic(() => import('@/components/ui/LenisProvider'), {
  ssr: false,
  loading: () => null,
})

const Cursor = dynamic(() => import('@/components/cursor/Cursor'), {
  ssr: false,
  loading: () => null,
})

const IntroGate = dynamic(() => import('@/components/intro/IntroGate'), {
  ssr: false,
  loading: () => null,
})

const Navbar = dynamic(() => import('@/components/navbar/Navbar'), {
  ssr: false,
  loading: () => null,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OctoVisual — Nightlife Visual Studio',
  description:
    'OctoVisual est un studio créatif spécialisé dans l\'univers nightlife : affiches DJs, branding de clubs, directions artistiques d\'artistes et aftermovies premium.',
  keywords: ['DJ posters', 'nightlife branding', 'club visuals', 'artist DA', 'aftermovie', 'festival', 'visual studio'],
  openGraph: {
    title: 'OctoVisual — Nightlife Visual Studio',
    description: 'Les visuels des DJs, clubs et artistes qui dominent la scène nightlife.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-ink overflow-x-hidden">
        <div className="grain-overlay" aria-hidden="true" />

        <LenisProvider>
          <Cursor />
          <IntroGate>
            <Navbar />
            {children}
          </IntroGate>
        </LenisProvider>
      </body>
    </html>
  )
}
