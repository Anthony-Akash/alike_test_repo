import type { Product } from '~/types'

export const useWishlistStore = defineStore('wishlist', () => {
  const savedItems = ref<Product[]>([])

  function add(product: Product) {
    if (!savedItems.value.find((item) => item.id === product.id)) {
      savedItems.value.push(product)
      persist()
    }
  }

  function remove(productId: string) {
    savedItems.value = savedItems.value.filter((item) => item.id !== productId)
    persist()
  }

  function toggle(product: Product) {
    const exists = savedItems.value.find((item) => item.id === product.id)
    if (exists) {
      remove(product.id)
    } else {
      add(product)
    }
  }

  function isInWishlist(productId: string) {
    return savedItems.value.some((item) => item.id === productId)
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem('vd-wishlist', JSON.stringify(savedItems.value))
    }
  }

  function hydrate() {
    if (import.meta.client) {
      const saved = localStorage.getItem('vd-wishlist')
      if (saved) savedItems.value = JSON.parse(saved)
    }
  }

  return { savedItems, add, remove, toggle, isInWishlist, hydrate }
})
