import rawData from './projects-data.json'

export interface CardData {
  slug: string
  name: string
  services: string
  category: string
  cardImage: string
  route: string
}

export interface PageData {
  slug: string
  pageTag: string
  pageBody: string
  pageSecondaryTag: string
  images: string[]
  credits?: string
  overlayImages?: string[]
  videos?: Record<string, string>
}

export const indexLines: string[] = rawData.indexLines
export const projectCards: CardData[] = rawData.projectCards as CardData[]
export const projectPages: Record<string, PageData> = rawData.projectPages as Record<string, PageData>
