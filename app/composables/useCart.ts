import type { CartItem } from '~/types'
import { useCartStore } from '~/stores/cart'

export function useCart() {
  const cartStore = useCartStore()
  // const { trackEvent } = useTracking()

  function addToCart(item: CartItem) {
    cartStore.addItem(item)
    // trackEvent({
    //   event_name: 'add_to_cart',
    //   event_cat: 'Cart',
    //   event_act: 'Add Item',
    //   event_lab: item.name,
    //   product_id: item.productId,
    //   quantity: item.quantity,
    // })
  }

  function removeFromCart(productId: string, variant?: string) {
    cartStore.removeItem(productId, variant)
    // trackEvent({
    //   event_name: 'remove_from_cart',
    //   event_cat: 'Cart',
    //   event_act: 'Remove Item',
    //   product_id: productId,
    // })
  }

  function updateQuantity(
    productId: string,
    quantity: number,
    variant?: string,
  ) {
    cartStore.updateQuantity(productId, quantity, variant)
  }

  function clearCart() {
    cartStore.clear()
  }

  const items = computed(() => cartStore.items)
  const itemCount = computed(() => cartStore.itemCount)
  const total = computed(() => cartStore.total)

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    items,
    itemCount,
    total,
  }
}
