import type { OrderContact, Address } from './order'

export type CheckoutStep = 'contact' | 'payment' | 'review'

export interface CheckoutState {
  currentStep: CheckoutStep
  contact: OrderContact | null
  billingAddress: Address | null
  paymentMethod: string | null
  promoCode: string | null
  agreeToTerms: boolean
  isGuest: boolean
  guestEmail?: string
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: 'requires_payment' | 'processing' | 'succeeded' | 'failed'
}

export interface PaymentResult {
  success: boolean
  orderId?: string
  orderNumber?: string
  error?: string
  requiresAction?: boolean
  actionUrl?: string
}
