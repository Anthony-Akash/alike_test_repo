<script setup lang="ts">
import type { DealCardData } from '~/components/deals/DealCard.vue'
import type { VddDeal, VddCategory } from '~/types/directus'
import { useCommonStore } from '~/stores/index'

interface Props {
  collectionName: string | null
  dealTypeFilter?: string | null
  cardCount?: number
  pageSlot?: string | null
  theme?: 'light' | 'dark' | null
  title?: string | null
  description?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}

const props = defineProps<Props>()

const { getItems } = useDirectusItems()
const { locale, t, tm, rt } = useI18n()
const { trackExploreSearch } = useTracking()

const PAGE_SIZE = 9

const searchInput = ref('')
const deals = ref<VddDeal[]>([])
const totalCount = ref(0)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const offset = ref(0)
let fetchToken = 0

const pageQuery = computed(() => useRoute().query as Record<string, string>)
const { smoothScrollTo } = useScroll()
const sectionId = ref('explore-sec')

const suggestions = computed(() => (tm('explore.suggestions') as unknown[]).map((s) => rt(s as Parameters<typeof rt>[0])))

const hasMore = computed(() => deals.value.length < totalCount.value)

const commonStore = useCommonStore()

const active = computed({
  get: () => commonStore.searchCategory || null,
  set: (val: string | null) => {
    commonStore.searchCategory = val
  },
})

const { data: categories } = useSectionData<VddCategory>(
  'vdd_categories',
  null,
  {
    fields: ['*', 'translations.*'],
    translationKeys: ['translations'],
    filter: { status: { _eq: 'published' }, deal_type: { _ncontains: 'pass' } },
    sort: ['sort'],
  },
)

let isInternalCategoryUpdate = false

const selectedCategory = computed({
  get: () => active.value ?? 'all',
  set: (val: string) => {
    isInternalCategoryUpdate = true
    active.value = val === 'all' ? null : val
    offset.value = 0
    fetchDeals(false)
  },
})

const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId)
  if (el) smoothScrollTo(el, 1000)
}

watch(active, () => {
  if (isInternalCategoryUpdate) {
    isInternalCategoryUpdate = false
    return
  }
  offset.value = 0
  fetchDeals(false)
})

const shouldScrollAfterLoad = ref(false)

watch(pageQuery, (newVal) => {
  if (newVal?.type && active.value !== newVal.type) {
    active.value = newVal.type
    if (import.meta.client) {
      shouldScrollAfterLoad.value = true
    }
  }
}, { immediate: true })

watch(isLoading, (val) => {
  if (!val && shouldScrollAfterLoad.value) {
    shouldScrollAfterLoad.value = false
    nextTick(() => scrollToSection(sectionId.value))
  }
})

onMounted(() => {
  if (pageQuery.value?.type) {
    if (!isLoading.value) {
      setTimeout(() => {
        scrollToSection(sectionId.value)
      }, 500)
    } else {
      shouldScrollAfterLoad.value = true
    }
  }
})

const searchCategoryLabel = computed(() => {
  if (!active.value || active.value === 'all') return 'all categories'
  const cat = categories.value?.find((c) => c.deal_type === active.value)
  if (!cat) return active.value
  const translation = cat.translations?.find((t) => t.languages_id === locale.value)
  return translation?.name || active.value
})

function buildFilter() {
  const filters: Record<string, unknown>[] = [
    { status: { _eq: 'published' } },
    {
      translations: {
        _and: [
          { languages_id: { code: { _eq: locale.value } } },
          {
            _or: [
              { name: { _nempty: true } },
              { description: { _nempty: true } },
              { short_description: { _nempty: true } },
            ],
          },
        ],
      },
    },
  ]

  if (props.dealTypeFilter) {
    filters.push({ type: { _eq: props.dealTypeFilter } })
  }

  if (active.value) {
    filters.push({ type: { _eq: active.value } })
  }

  if (searchInput.value.trim()) {
    filters.push({
      _or: [
        { translations: { name: { _contains: searchInput.value.trim() } } },
        { translations: { description: { _contains: searchInput.value.trim() } } },
      ],
    })
  }

  return { _and: filters }
}

async function fetchDeals(append = false) {
  const token = ++fetchToken

  if (append) {
    isLoadingMore.value = true
  } else {
    isLoading.value = true
    offset.value = 0
    deals.value = []
  }

  try {
    const result = await getItems({
      collection: props.collectionName || 'vdd_deals',
      params: {
        fields: [
          '*',
          'translations.*',
          'images.directus_files_id.id',
          'images.directus_files_id.filename_disk',
          'tags.vdd_tags_id.translations.*',
        ],
        filter: buildFilter(),
        // `id` is a deterministic tiebreaker — without it, deals that share
        // the same (often null) `sort` value get an unstable DB order, so
        // limit/offset pages overlap (duplicates) and skip rows (missing
        // deals that never appear on any page). See sort note below.
        sort: ['sort', 'id'],
        limit: PAGE_SIZE,
        offset: offset.value,
        meta: 'filter_count',
        deep: getDeepLocaleFilter(
          ['translations', 'tags.vdd_tags_id.translations'],
          locale.value,
        ),
      },
    })

    if (token !== fetchToken) return

    const raw = result as unknown
    const items = Array.isArray(raw)
      ? (raw as VddDeal[])
      : ((raw as Record<string, unknown>).data as VddDeal[]) ?? []
    const count = Array.isArray(raw)
      ? undefined
      : ((raw as Record<string, unknown>).meta as Record<string, number>)?.filter_count

    if (count !== undefined) {
      totalCount.value = count
    }

    if (token !== fetchToken) return

    if (append) {
      const merged = new Map<string, VddDeal>()
      for (const d of deals.value) merged.set(String(d.id), d)
      for (const d of items) merged.set(String(d.id), d)
      deals.value = [...merged.values()]
    } else {
      deals.value = items
    }

    offset.value += items.length
  } catch (err) {
    console.error('Error fetching deals:', err)
  } finally {
    if (token === fetchToken) {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }
}

function executeSearch() {
  // if (searchInput.value.trim()) {
  trackExploreSearch(searchCategoryLabel.value, searchInput.value.trim() ? searchInput.value.trim() : 'null')
  // }
  offset.value = 0
  fetchDeals(false)
}

function clearSearch() {
  searchInput.value = ''
  fetchDeals(false)
}

function applySuggestion(term: string) {
  searchInput.value = term
  trackExploreSearch(searchCategoryLabel.value, term)
  offset.value = 0
  fetchDeals(false)
}

function loadMore() {
  if (deals.value.length < totalCount.value) {
    fetchDeals(true)
  }
}

function transformDeal(deal: VddDeal): DealCardData {
  const translation = deal.translations?.[0]
  const images: string[] = []
  if (deal.images?.length) {
    deal.images
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
      .forEach((img) => {
        images.push(getAssetPath(img.directus_files_id))
      })
  } else if (deal.thumbnail) {
    images.push(getAssetPath(deal.thumbnail))
  }

  const features: string[] = []
  if (deal.tags?.length) {
    deal.tags.forEach((tagJunction) => {
      const tag = tagJunction.vdd_tags_id
      if (typeof tag === 'object' && tag.translations?.[0]) {
        features.push(tag.translations[0].label)
      }
    })
  } else if (translation?.highlights?.length) {
    features.push(...translation.highlights)
  }

  return {
    id: String(deal.id),
    title: translation?.name || '',
    description: translation?.description || '',
    short_description: translation?.short_description || '',
    images: images.length ? images : ['/images/deals/placeholder-1.jpg'],
    features,
    price: Number(deal.price) || 0,
    priceOriginal: deal.original_price ? Number(deal.original_price) : undefined,
    externalUrl: deal.external_url || undefined,
    type: deal.type,
    ctaLabel: translation?.outclick_label || deal.outclick_label || undefined,
  }
}

const cardData = computed<DealCardData[]>(() => {
  if (!deals.value) return []
  return deals.value.map(transformDeal)
})

onMounted(() => {
  if (!deals.value.length && !isLoading.value) {
    fetchDeals(false)
  }
})
</script>

<template>
  <section
    id="explore-sec"
    class="mt-8 w-full md:mt-16"
  >
    <div class="mx-auto container-app w-full">
      <ExploreControls
        :title="title"
        :description="description"
      >
        <template #search-input>
          <div
            class="flex h-12 w-full items-center justify-center gap-2
              rounded-full border border-border bg-white ps-4 pe-2
              md:h-14 md:ps-6"
          >
            <Icon
              name="lucide:search"
              class="icon-chevron size-5 shrink-0 text-on-surface-variant"
            />
            <input
              v-model="searchInput"
              type="text"
              :disabled="isLoading"
              :placeholder="t('explore.searchPlaceholder')"
              class="w-full text-[18px] leading-5 text-text-title outline-none"
              @keyup.enter="executeSearch"
            >
            <Button
              v-if="searchInput"
              size="icon"
              variant="default"
              class="flex max-h-8 cursor-pointer rounded-full! bg-primary-variant px-0 text-primary-variant hover:bg-primary-variant/80 md:max-h-10 md:px-3"
              @click="clearSearch"
            >
              <Icon
                name="lucide:x"
                class="size-4! text-primary-vd"
              />
            </Button>
          </div>
        </template>

        <template #search-suggestions>
          <div class="flex w-full items-center gap-2">
            <p class="text-sm whitespace-nowrap text-on-surface-variant">
              {{ t('explore.suggestionsLabel') }}
            </p>
            <div class="no-scrollbar flex w-full gap-2 overflow-x-auto">
              <button
                v-for="(item, i) in suggestions"
                :key="i"
                class="flex h-6 shrink-0 cursor-pointer
                  items-center justify-center rounded-full
                  border border-primary-vd px-4 text-xs
                  text-primary-vd capitalize transition-colors
                  hover:bg-primary-variant hover:shadow-sm"
                :disabled="isLoading"
                @click="applySuggestion(item)"
              >
                {{ item }}
              </button>
            </div>
          </div>
        </template>

        <template #category-select>
          <CategorySelect
            v-model="selectedCategory"
            :categories="categories ?? []"
            :all-label="t('explore.allCategories')"
          />
        </template>

        <template #search-cta>
          <button
            class="flex h-12 w-full cursor-pointer
              items-center justify-center rounded-full
              bg-primary-vd px-8 font-medium
              text-primary-foreground md:h-14 md:w-fit"
            :disabled="isLoading"
            @click="executeSearch"
          >
            {{ t('explore.searchButton') }}
          </button>
        </template>
      </ExploreControls>

      <!-- Animated Content Area -->
      <Transition
        name="content-fade"
        mode="out-in"
      >
        <!-- Results -->
        <div
          v-if="cardData.length > 0 && !isLoading"
          key="results"
          class="px-6 lg:px-6 xl:px-6 2xl:px-0"
        >
          <p class="mt-6 mb-4 text-lg font-medium md:text-2xl">
            {{ t('explore.resultsCount', { count: totalCount }) }}
          </p>

          <TransitionGroup
            name="card-list"
            tag="div"
            class="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3"
          >
            <DealCard
              v-for="(deal, index) in cardData"
              :key="deal.id"
              :style="{ '--card-i': index % PAGE_SIZE }"
              :deal="deal"
            />
          </TransitionGroup>

          <!-- Load More Shimmer -->
          <Transition name="shimmer-fade">
            <div
              v-if="isLoadingMore"
              class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3"
            >
              <DealCardSkeleton
                v-for="i in 3"
                :key="i"
              />
            </div>
          </Transition>

          <!-- Load More Button -->
          <Transition name="fade">
            <div
              v-if="hasMore && !isLoadingMore"
              class="mt-4 flex w-full items-center justify-center md:mt-6"
            >
              <button
                :disabled="isLoading || isLoadingMore"
                class="flex h-12 w-full cursor-pointer items-center
                  justify-center rounded-full
                  bg-primary-variant px-6 font-medium
                  text-primary md:w-fit"
                @click="loadMore"
              >
                {{ t('explore.loadMore') }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Loading Shimmer -->
        <div
          v-else-if="isLoading"
          key="loading"
          class="mt-6 grid grid-cols-1 gap-3 px-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:px-6 xl:px-6 2xl:px-0"
        >
          <DealCardSkeleton
            v-for="i in 6"
            :key="i"
          />
        </div>

        <!-- Empty State -->
        <NoResult
          v-else
          key="empty"
          class="mt-4"
        />
      </Transition>
    </div>
  </section>
</template>

<style scoped>
/* ── State cross-fade (results ↔ loading ↔ empty) ── */
.content-fade-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  transition-delay: 200ms;
}
.content-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.content-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.content-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Card list: staggered slide-up entrance ── */
.card-list-enter-active {
  transition:
    opacity 0.9s ease-in,
    transform 0.5s ease;
  transition-delay: calc(var(--card-i, 0) * 175ms);
}
.card-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* ── Load-more shimmer fade ── */
.shimmer-fade-enter-active,
.shimmer-fade-leave-active {
  transition: opacity 0.9s ease;
}
.shimmer-fade-enter-from,
.shimmer-fade-leave-to {
  opacity: 0;
}

/* ── Load-more button fade ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
