/**
 * useSectionData — Central composable for fetching section data from Directus
 *
 * Mirrors alike-website's useSectionData pattern:
 * - SSR-cached via useAsyncData
 * - Locale-aware deep filtering
 * - Supports fetching single item or collection list
 */

interface SectionDataOptions {
  /** Directus fields to request */
  fields?: string[]
  /** Translation relation paths to locale-filter via deep */
  translationKeys?: string[]
  /** Additional Directus filter object */
  filter?: Record<string, unknown>
  /** Sort order */
  sort?: string[]
  /** Limit results (for collection queries) */
  limit?: number
  /** Skip SSR cache (for real-time data) */
  preventCache?: boolean
}

/**
 * Fetch a list of items from a Directus collection
 */
export function useSectionData<T = unknown>(
  collectionName: string,
  itemId?: null,
  options?: SectionDataOptions,
): { data: Ref<T[] | null>, pending: Ref<boolean>, error: Ref<Error | null> }

/**
 * Fetch a single item by ID from a Directus collection
 */
export function useSectionData<T = unknown>(
  collectionName: string,
  itemId: string | number,
  options?: SectionDataOptions,
): { data: Ref<T | null>, pending: Ref<boolean>, error: Ref<Error | null> }

export function useSectionData<T = unknown>(
  collectionName: string,
  itemId?: string | number | null,
  options: SectionDataOptions = {},
) {
  const { getItems, getItemById } = useDirectusItems()
  const { locale } = useI18n()

  const {
    fields = ['*'],
    translationKeys = ['translations'],
    filter = {},
    sort = ['sort'],
    limit = -1,
    preventCache = false,
  } = options

  // Build deep locale filter - simplified to match working usePageData pattern
  const deep = computed(() => {
    const deepFilter: Record<string, unknown> = {}

    for (const key of translationKeys) {
      deepFilter[key] = {
        _filter: { languages_id: { code: { _eq: locale.value } } },
      }
    }

    return deepFilter
  })

  // Unique cache key
  const cacheKey = computed(() => {
    const base = `section-${collectionName}-${itemId || 'list'}-${locale.value}`
    const filterHash = JSON.stringify(filter)
    return `${base}-${filterHash}`
  })

  // eslint-disable-next-line eqeqeq
  if (itemId != null) {
    // Single item fetch (by ID)
    if (preventCache) {
      const data = ref<T | null>(null) as Ref<T | null>
      const pending = ref(true)
      const error = ref<Error | null>(null)

      getItemById<T>({
        collection: collectionName,
        id: String(itemId),
        params: {
          fields,
          deep: deep.value,
        },
      }).then((result) => {
        data.value = result
      }).catch((e) => {
        error.value = e
      }).finally(() => {
        pending.value = false
      })

      return { data, pending, error }
    }

    const { data, pending, error } = useAsyncData<T>(
      () => cacheKey.value,
      () => getItemById<T>({
        collection: collectionName,
        id: String(itemId),
        params: {
          fields,
          deep: deep.value,
        },
      }),
      { watch: [locale] },
    )

    return { data, pending, error }
  }

  // Collection list fetch
  const params = computed(() => ({
    fields,
    filter,
    sort,
    limit,
    deep: deep.value,
  }))

  if (preventCache) {
    const data = ref<T[] | null>(null) as Ref<T[] | null>
    const pending = ref(true)
    const error = ref<Error | null>(null)

    getItems<T>({
      collection: collectionName,
      params: params.value,
    }).then((result) => {
      data.value = result as T[]
    }).catch((e) => {
      error.value = e
    }).finally(() => {
      pending.value = false
    })

    return { data, pending, error }
  }

  const { data, pending, error } = useAsyncData<T[]>(
    () => cacheKey.value,
    () => getItems<T>({
      collection: collectionName,
      params: params.value,
    }) as Promise<T[]>,
    { watch: [locale] },
  )

  return { data, pending, error }
}
