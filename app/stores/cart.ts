import type { CartItem } from '~/types/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  function addItem(product: CartItem) {
    const existing = items.value.find(
      (i) => i.productId === product.productId && i.variant === product.variant,
    )
    if (existing) {
      existing.quantity += product.quantity
    } else {
      items.value.push(product)
    }
    persist()
  }

  function removeItem(productId: string, variant?: string) {
    items.value = items.value.filter(
      (i) => !(i.productId === productId && i.variant === variant),
    )
    persist()
  }

  function updateQuantity(productId: string, quantity: number, variant?: string) {
    const item = items.value.find(
      (i) => i.productId === productId && i.variant === variant,
    )
    if (item) item.quantity = Math.max(1, quantity)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem('vd-cart', JSON.stringify(items.value))
    }
  }

  function hydrate() {
    if (import.meta.client) {
      const saved = localStorage.getItem('vd-cart')
      if (saved) items.value = JSON.parse(saved)
    }
  }

  return { items, itemCount, total, addItem, removeItem, updateQuantity, clear, hydrate }
})
