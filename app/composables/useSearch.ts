export function useSearch() {
  const query = ref('')
  const results = ref<unknown[]>([])
  const loading = ref(false)
  const filters = ref<Record<string, string | string[]>>({})

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function setFilter(key: string, value: string | string[]) {
    filters.value = { ...filters.value, [key]: value }
    performSearch()
  }

  function removeFilter(key: string) {
    const { [key]: _, ...rest } = filters.value
    filters.value = rest
    performSearch()
  }

  function clearFilters() {
    filters.value = {}
    performSearch()
  }

  async function performSearch() {
    loading.value = true
    try {
      const data = await $fetch('/api/search', {
        params: {
          q: query.value,
          ...filters.value,
        },
      })
      results.value = data as unknown[]
    } catch {
      results.value = []
    } finally {
      loading.value = false
    }
  }

  function search(term: string) {
    query.value = term

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      performSearch()
    }, 300)
  }

  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return { query, results, loading, filters, search, setFilter, removeFilter, clearFilters }
}
