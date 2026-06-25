import type { Product, ProductType, ProductFilters } from '~/types'

export const useProductsStore = defineStore('products', () => {
  const productsByType = ref<Record<string, Product[]>>({})
  const productsByCategory = ref<Record<string, Product[]>>({})
  const productCache = ref<Record<string, Product>>({})
  const loading = ref(false)

  async function fetchProducts(filters?: ProductFilters) {
    loading.value = true
    try {
      const products = await $fetch<Product[]>('/api/products', {
        params: filters,
      })
      if (filters?.type) {
        productsByType.value[filters.type] = products
      }
      return products
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(slug: string) {
    if (productCache.value[slug]) {
      return productCache.value[slug]
    }
    loading.value = true
    try {
      const product = await $fetch<Product>(`/api/products/${slug}`)
      productCache.value[slug] = product
      return product
    } finally {
      loading.value = false
    }
  }

  async function fetchByCategory(category: string, type?: ProductType) {
    loading.value = true
    try {
      const products = await $fetch<Product[]>('/api/products', {
        params: { category, type },
      })
      productsByCategory.value[category] = products
      return products
    } finally {
      loading.value = false
    }
  }

  return { productsByType, productsByCategory, productCache, loading, fetchProducts, fetchProduct, fetchByCategory }
})
