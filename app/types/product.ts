export type ProductType
  = | 'deal'
    | 'attraction'
    | 'pass'
    | 'holiday-package'
    | 'hotel'

export type DealCategory = 'attractions' | 'dining' | 'hotels' | 'shopping'

export interface ProductImage {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

export interface ProductTranslation {
  language: 'en' | 'ar'
  name: string
  shortDescription: string
  description: string
  highlights: string[]
  inclusions?: string[]
  exclusions?: string[]
  termsAndConditions?: string
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  originalPrice?: number
  currency: string
  available: boolean
  maxQuantity: number
  metadata?: Record<string, string>
}

export interface ProductReview {
  rating: number
  count: number
}

export interface Product {
  id: string
  slug: string
  type: ProductType
  category: string
  translations: ProductTranslation[]
  images: ProductImage[]
  variants: ProductVariant[]
  price: number
  originalPrice?: number
  currency: string
  discountPercentage?: number
  review?: ProductReview
  badges: string[]
  isActive: boolean
  isFeatured: boolean
  externalUrl?: string
  location?: {
    latitude: number
    longitude: number
    address: string
    area: string
  }
  operatingHours?: {
    open: string
    close: string
    days: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface Deal extends Product {
  type: 'deal'
  dealCategory: DealCategory
  externalUrl: string
  outclickLabel: string
}

export interface Attraction extends Product {
  type: 'attraction'
  duration?: string
  ageRestriction?: string
  cancellationPolicy: string
}

export interface Pass extends Product {
  type: 'pass'
  validityDays: number
  includedAttractions: string[]
  passType: 'single' | 'multi' | 'flexi'
}

export interface HolidayPackage extends Product {
  type: 'holiday-package'
  duration: string
  nights: number
  includedFlights: boolean
  includedTransfers: boolean
  includedHotel: string
  itinerary: {
    day: number
    title: string
    description: string
  }[]
}

export interface Hotel extends Product {
  type: 'hotel'
  starRating: number
  amenities: string[]
  rooms: HotelRoom[]
  checkInTime: string
  checkOutTime: string
}

export interface HotelRoom {
  id: string
  name: string
  description: string
  maxGuests: number
  bedType: string
  size: string
  price: number
  originalPrice?: number
  currency: string
  available: boolean
  images: ProductImage[]
  amenities: string[]
}

export interface ProductFilters {
  type?: ProductType
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating'
  q?: string
  page?: number
  limit?: number
}
