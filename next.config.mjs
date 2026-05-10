/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Only optimize packages that are actually used
    optimizePackageImports: ['gsap', 'lenis'],
  },
  sassOptions: {
    api: 'modern-compiler',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
    ],
  },
}

export default nextConfig
