import dynamic from 'next/dynamic'
import Footer from '@/components/ui/Footer'

const Hero = dynamic(() => import('@/components/hero/Hero'), {
  ssr: false,
  loading: () => null,
})

const HorizontalScroll = dynamic(
  () => import('@/components/horizontal/HorizontalScroll'),
  {
    ssr: false,
    loading: () => null,
  }
)

const Gallery = dynamic(() => import('@/components/gallery/Gallery'), {
  ssr: false,
  loading: () => null,
})

const VideoSection = dynamic(
  () => import('@/components/videos/VideoSection'),
  {
    ssr: false,
    loading: () => null,
  }
)

const About = dynamic(() => import('@/components/about/About'), {
  ssr: false,
  loading: () => null,
})

const Contact = dynamic(() => import('@/components/contact/Contact'), {
  ssr: false,
  loading: () => null,
})

export default function Home() {
  return (
    <main>
      <Hero />
      <HorizontalScroll />
      <Gallery />
      <VideoSection />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
