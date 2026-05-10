import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Showroom — OctoVisual',
  description: 'Découvrez les offres et packs créatifs OctoVisual — affiches, branding, vidéo, direction artistique nightlife.',
}

const ProductPage = dynamic(() => import('@/components/product/ProductPage'), {
  ssr: false,
  loading: () => null,
})

export default function Product() {
  return <ProductPage />
}
