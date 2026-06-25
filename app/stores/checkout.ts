import type {
  CheckoutState,
  CheckoutStep,
  OrderContact,
  Address,
} from '~/types'
import { useCartStore } from '~/stores/cart'

export const useCheckoutStore = defineStore('checkout', () => {
  const step = ref<CheckoutStep>('contact')
  const contactInfo = ref<OrderContact | null>(null)
  const billingAddress = ref<Address | null>(null)
  const paymentMethod = ref<string | null>(null)
  const promoCode = ref<string | null>(null)
  const agreeToTerms = ref(false)
  const isGuest = ref(false)
  const guestEmail = ref<string | undefined>(undefined)
  const loading = ref(false)

  const steps: CheckoutStep[] = ['contact', 'payment', 'review']

  const state = computed<CheckoutState>(() => ({
    currentStep: step.value,
    contact: contactInfo.value,
    billingAddress: billingAddress.value,
    paymentMethod: paymentMethod.value,
    promoCode: promoCode.value,
    agreeToTerms: agreeToTerms.value,
    isGuest: isGuest.value,
    guestEmail: guestEmail.value,
  }))

  function nextStep() {
    const currentIndex = steps.indexOf(step.value)
    if (currentIndex < steps.length - 1) {
      step.value = steps[currentIndex + 1] as CheckoutStep
    }
  }

  function prevStep() {
    const currentIndex = steps.indexOf(step.value)
    if (currentIndex > 0) {
      step.value = steps[currentIndex - 1] as CheckoutStep
    }
  }

  async function submitOrder() {
    loading.value = true
    try {
      const cartStore = useCartStore()
      const result = await $fetch('/api/checkout/create-order', {
        method: 'POST',
        body: {
          items: cartStore.items,
          contact: contactInfo.value,
          billingAddress: billingAddress.value,
          paymentMethod: paymentMethod.value,
          promoCode: promoCode.value,
          isGuest: isGuest.value,
          guestEmail: guestEmail.value,
        },
      })
      cartStore.clear()
      reset()
      return result
    } finally {
      loading.value = false
    }
  }

  function reset() {
    step.value = 'contact'
    contactInfo.value = null
    billingAddress.value = null
    paymentMethod.value = null
    promoCode.value = null
    agreeToTerms.value = false
    isGuest.value = false
    guestEmail.value = undefined
  }

  return {
    step,
    contactInfo,
    billingAddress,
    paymentMethod,
    promoCode,
    agreeToTerms,
    isGuest,
    guestEmail,
    loading,
    state,
    nextStep,
    prevStep,
    submitOrder,
    reset,
  }
})
