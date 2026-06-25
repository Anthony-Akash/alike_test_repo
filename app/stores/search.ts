import type { Product, ProductFilters } from '~/types'

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const filters = ref<ProductFilters>({})
  const results = ref<Product[]>([])
  const history = ref<string[]>([])
  const loading = ref(false)

  async function search(searchQuery: string) {
    query.value = searchQuery
    loading.value = true
    try {
      results.value = await $fetch<Product[]>('/api/products', {
        params: { q: searchQuery, ...filters.value },
      })
      if (searchQuery && !history.value.includes(searchQuery)) {
        history.value.unshift(searchQuery)
        history.value = history.value.slice(0, 10)
        persistHistory()
      }
    } finally {
      loading.value = false
    }
  }

  function applyFilter(newFilters: Partial<ProductFilters>) {
    filters.value = { ...filters.value, ...newFilters }
    if (query.value) {
      search(query.value)
    }
  }

  function clearFilters() {
    filters.value = {}
    if (query.value) {
      search(query.value)
    }
  }

  function persistHistory() {
    if (import.meta.client) {
      localStorage.setItem('vd-search-history', JSON.stringify(history.value))
    }
  }

  function hydrateHistory() {
    if (import.meta.client) {
      const saved = localStorage.getItem('vd-search-history')
      if (saved) history.value = JSON.parse(saved)
    }
  }

  return { query, filters, results, history, loading, search, applyFilter, clearFilters, hydrateHistory }
})
