export const useUiStore = defineStore('ui', () => {
  const cartDrawerOpen = ref(false)
  const searchOpen = ref(false)
  const activeModal = ref<string | null>(null)

  function openCart() {
    cartDrawerOpen.value = true
  }

  function closeCart() {
    cartDrawerOpen.value = false
  }

  function openModal(modalId: string) {
    activeModal.value = modalId
  }

  function closeModal() {
    activeModal.value = null
  }

  function toggleSearch() {
    searchOpen.value = !searchOpen.value
  }

  return { cartDrawerOpen, searchOpen, activeModal, openCart, closeCart, openModal, closeModal, toggleSearch }
})
