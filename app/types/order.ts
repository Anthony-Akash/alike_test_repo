import type { CartItem, CartTotals } from './cart'

export type OrderStatus
  = | 'pending'
    | 'confirmed'
    | 'processing'
    | 'completed'
    | 'cancelled'
    | 'refunded'

export type PaymentStatus
  = | 'pending'
    | 'authorized'
    | 'captured'
    | 'failed'
    | 'refunded'

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  items: CartItem[]
  totals: CartTotals
  contact: OrderContact
  billingAddress?: Address
  paymentMethod: string
  createdAt: string
  updatedAt: string
  confirmationEmail: string
}

export interface OrderContact {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
}

export interface OrderListItem {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  currency: string
  itemCount: number
  createdAt: string
  firstItemImage: string
  firstItemName: string
}
