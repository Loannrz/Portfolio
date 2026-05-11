import type { VideoItem } from './types'

export const videos: VideoItem[] = [
  {
    id: 'v01',
    title: 'AFTERMOVIE SOLSTICE',
    subtitle: 'Aftermovie festival — 2024',
    category: 'Aftermovie',
    year: '2024',
    client: 'Solstice Festival',
    duration: '3:45',
    description:
      'Aftermovie officiel du festival Solstice. Captation immersive, montage cinématique et sound design premium.',
    thumbnail: 'https://picsum.photos/seed/vid01/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/sam%20.mp4',
    accent: '#FF6A3D',
    featured: true,
  },
  {
    id: 'v02',
    title: 'MIRA — SET TEASER',
    subtitle: 'Teaser artistique — DJ Mira',
    category: 'Teaser',
    year: '2024',
    client: 'Mira (DJ)',
    duration: '0:45',
    description:
      'Teaser visuel pour le set de la DJ Mira au Shelter Berlin. Direction artistique et montage premium.',
    thumbnail: 'https://picsum.photos/seed/vid02/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/devv1%2003.27.38.mp4',
    accent: '#2D4BFF',
    featured: true,
  },
  {
    id: 'v03',
    title: 'VELVET OPENING',
    subtitle: 'Film d\'ouverture — Club Velvet',
    category: 'Brand Film',
    year: '2024',
    client: 'Velvet Paris',
    duration: '2:10',
    description:
      'Film d\'ouverture du club Velvet Paris. Ambiance, atmosphère et direction artistique premium pour le lancement.',
    thumbnail: 'https://picsum.photos/seed/vid03/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/devv2%2003.27.38.mp4',
    accent: '#E7C9A9',
    featured: false,
  },
  {
    id: 'v04',
    title: 'UNDERGROUND RECAP',
    subtitle: 'Récap soirée — Shelter Berlin',
    category: 'Recap',
    year: '2023',
    client: 'Shelter Berlin',
    duration: '1:30',
    description:
      'Récap vidéo premium de la soirée Underground. Montage dynamique et sound design sur mesure.',
    thumbnail: 'https://picsum.photos/seed/vid04/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/esphar.mp4',
    accent: '#FF6A3D',
    featured: true,
  },
  {
    id: 'v05',
    title: 'AXIOM — VISUAL EP',
    subtitle: 'Visual EP — Artiste Axiom',
    category: 'Visual EP',
    year: '2024',
    client: 'Axiom',
    duration: '4:20',
    description:
      'Visual EP complet pour la sortie du producteur Axiom. Un voyage visuel cinématique en 6 chapitres.',
    thumbnail: 'https://picsum.photos/seed/vid05/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/miaterra.mp4',
    accent: '#2B2B2B',
    featured: true,
  },
  {
    id: 'v06',
    title: 'CERCLE SESSIONS',
    subtitle: 'Live session — Cercle Festival',
    category: 'Live Session',
    year: '2024',
    client: 'Cercle Festival',
    duration: '1:05',
    description:
      'Teaser de session live filmée dans un lieu exceptionnel. Ambiance unique, cinématographie premium.',
    thumbnail: 'https://picsum.photos/seed/vid06/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/miaterra2.mp4',
    accent: '#FF6A3D',
    featured: true,
  },
]

export const featuredVideos = videos.filter((v) => v.featured)
