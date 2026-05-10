export type ProjectCategory =
  | 'AFFICHES ARTISTE'
  | 'AFFICHES CLUB'
  | 'DIRECTION ARTISTIQUE'
  | 'LOGO'
  | 'TROPHÉES'

export type GalleryCategory = ProjectCategory | 'TOUS'

export interface Project {
  id: string
  title: string
  subtitle: string
  category: ProjectCategory
  year: string
  client: string
  description: string
  tags: string[]
  image: string
  imageAlt: string
  aspectRatio: '4/3' | '3/4' | '1/1' | '16/9' | '9/16'
  accent: string
  featured: boolean
}
