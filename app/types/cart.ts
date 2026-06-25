import type { ProductType, ProductImage } from './product'

export interface CartItem {
  id: string
  productId: string
  productType: ProductType
  name: string
  image: ProductImage
  variant?: string
  variantName?: string
  price: number
  originalPrice?: number
  currency: string
  quantity: number
  maxQuantity: number
  date?: string
  metadata?: Record<string, string>
}

export interface CartTotals {
  subtotal: number
  discount: number
  tax: number
  total: number
  currency: string
  itemCount: number
}

export interface CartState {
  items: CartItem[]
  promoCode?: string
  promoDiscount?: number
}
