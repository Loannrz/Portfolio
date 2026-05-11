import type { VideoItem } from './types'

export const videos: VideoItem[] = [
  {
    id: 'v01',
    title: 'STORY',
    subtitle: 'STORY LA DUNE - _SAM_ZER_',
    category: 'Story',
    year: '2026',
    client: '_SAM_ZER_ (DJ) & LA DUNE',
    duration: '0:15',
    description:
      'Une story de 15 secondes au compte de myeventoo, _sam_zer_ & la Dune Club',
    thumbnail: 'https://picsum.photos/seed/vid01/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/sam%20.mp4',
    accent: '#FF6A3D',
    featured: true,
  },
  {
    id: 'v02',
    title: 'AFTERMOVIE DEVV & LA DUNE',
    subtitle: 'AFTERMOVIE LA DUNE - DEVV',
    category: 'Aftermovie',
    year: '2026',
    client: 'DEVV (DJ)',
    duration: '0:20',
    description:
      'Petit aftermovie de la Dune Club avec DJ DEVV',
    thumbnail: 'https://picsum.photos/seed/vid02/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/devv1%2003.27.38.mp4',
    accent: '#2D4BFF',
    featured: true,
  },
  {
    id: 'v03',
    title: 'STORY CLUB LA DUNE OPENNING',
    subtitle: 'STORY LA DUNE OPENNING - DEVV',
    category: 'Story',
    year: '2026',
    client: 'LA DUNE (CLUB) & DEVV (DJ)',
    duration: '0:15',
    description:
      'Une story de 15 secondes au compte de myeventoo, LA DUNE (CLUB) & DEVV (DJ)',
    thumbnail: 'https://picsum.photos/seed/vid03/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/devv2%2003.27.38.mp4',
    accent: '#E7C9A9',
    featured: false,
  },
  {
    id: 'v04',
    title: 'STORY',
    subtitle: 'STORY À LA DUNE - ESPHAR',
    category: 'Story',
    year: '2026',
    client: 'ESPHAR (DJ)',
    duration: '0:15',
    description:
      'Une story de 15 secondes au compte de myeventoo, ESPHAR (DJ) & LA DUNE',
    thumbnail: 'https://picsum.photos/seed/vid04/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/esphar.mp4',
    accent: '#FF6A3D',
    featured: true,
  },
  {
    id: 'v05',
    title: 'MIATERRA LIVE SESSION',
    subtitle: 'MIATERRA LIVE SESSION - CASSAMATA (DJ)',
    category: 'Live Session',
    year: '2026',
    client: 'MIATERRA (DJ) & CASSAMATA (DJ)',
    duration: '0:35',
    description:
      'Une live session de 35 secondes au compte de myeventoo, MIATERRA (DJ) & CASSAMATA (DJ)',
    thumbnail: 'https://picsum.photos/seed/vid05/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/miaterra.mp4',
    accent: '#2B2B2B',
    featured: true,
  },
  {
    id: 'v06',
    title: 'STORY GIRLS AMBIANCE',
    subtitle: 'STORY GIRLS AMBIANCE - MIATERRA',
    category: 'Story',
    year: '2026',
    client: 'MIATERRA',
    duration: '0:25',
    description:
      'Story de 25 secondes au compte de myeventoo et de l\'évènement MIATERRA',
    thumbnail: 'https://picsum.photos/seed/vid06/1920/1080',
    videoUrl:
      'https://op8pkcomddhps9bw.public.blob.vercel-storage.com/octovisuals/miaterra2.mp4',
    accent: '#FF6A3D',
    featured: true,
  },
]

export const featuredVideos = videos.filter((v) => v.featured)
