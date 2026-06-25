import { defineStore } from 'pinia'
import type { VddNavItem } from '~/types/directus'

export const useCommonStore = defineStore('commonStore', () => {
  const allCategories = ref<VddNavItem[] | null>(null)
  const selectedCategory = ref<string | null>(null)
  const searchCategory = ref<string | null>(null)

  function setCategories(categories: VddNavItem[]) {
    allCategories.value = categories
  }

  function setSelectedCategory(category: string | null) {
    selectedCategory.value = category
  }

  function setSearchCategory(category: string | null) {
    searchCategory.value = category
  }

  return { allCategories, selectedCategory, searchCategory, setCategories, setSelectedCategory, setSearchCategory }
})
