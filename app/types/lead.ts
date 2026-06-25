export interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  packageId: string
  travelDates: {
    from: string
    to: string
  }
  guests: number
  message?: string
  preferredLanguage: 'en' | 'ar'
  marketingConsent: boolean
}

export interface LeadSubmitResult {
  success: boolean
  referenceNumber?: string
  message: string
}
