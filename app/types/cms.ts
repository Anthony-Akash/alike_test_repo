export interface CmsPage {
  id: string
  slug: string
  title: string
  content: string
  metaTitle: string
  metaDescription: string
  ogImage?: string
  translations: {
    language: 'en' | 'ar'
    title: string
    content: string
    metaTitle: string
    metaDescription: string
  }[]
}

export interface CmsBanner {
  id: string
  title: string
  subtitle?: string
  image: {
    desktop: string
    mobile: string
  }
  cta?: {
    label: string
    url: string
  }
  translations: {
    language: 'en' | 'ar'
    title: string
    subtitle?: string
    ctaLabel?: string
  }[]
}

export interface CmsCategory {
  id: string
  slug: string
  name: string
  icon: string
  order: number
  translations: {
    language: 'en' | 'ar'
    name: string
  }[]
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  order: number
  translations: {
    language: 'en' | 'ar'
    question: string
    answer: string
  }[]
}
