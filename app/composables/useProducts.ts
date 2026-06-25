import type { Product } from '~/types'

export function useProducts(params?: { category?: string, featured?: boolean }) {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { data: products, pending, refresh } = useFetch<Product[]>('/api/products', {
    params,
    lazy: true,
    default: () => [],
  })

  loading.value = pending.value

  watch(pending, (val) => {
    loading.value = val
  })

  async function fetchProducts(filters?: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      const result = await $fetch<Product[]>('/api/products', { params: filters })
      products.value = result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, refresh, fetchProducts }
}
