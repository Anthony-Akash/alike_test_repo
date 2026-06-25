<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { VddCategory, VddNavItem, VddSection } from '~/types/directus'
import { useCommonStore } from '~/stores/index'
import Attraction from '~/components/icons/Attraction.vue'
import Dining from '~/components/icons/Dining.vue'
import Hotel from '~/components/icons/Hotel.vue'
import Pass from '~/components/icons/Pass.vue'
import Shopping from '~/components/icons/Shopping.vue'

interface Props {
  collectionName: string | null
  sections?: VddSection[]
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

const iconComponents: Record<string, typeof Attraction> = {
  Attraction,
  Dining,
  Hotel,
  Pass,
  Shopping,
}

const { locale } = useI18n()
const commonStore = useCommonStore()

const { data: categories } = useSectionData<VddCategory>(
  props.collectionName || 'vdd_categories',
  null,
  {
    fields: ['*', 'translations.*'],
    translationKeys: ['translations'],
    filter: { status: { _eq: 'published' } },
    sort: ['sort'],
  },
)

const items = computed<VddNavItem[]>(() => {
  if (!categories.value) return []
  return categories.value.reduce<VddNavItem[]>((acc, cat) => {
    const matchingSection = props.sections?.find((s) => s.deal_type_filter === cat.deal_type)
    if (!matchingSection?.section_id) return acc

    const translations = Array.isArray(cat.translations) ? cat.translations : []
    const translation = translations.find(
      (t) => typeof t === 'object' && t !== null && (t as VddCategory['translations'][number]).languages_id === locale.value,
    ) ?? translations[0] ?? null

    const label = (typeof translation === 'object' && translation !== null && (translation as VddCategory['translations'][number]).name)
      || cat.deal_type.charAt(0).toUpperCase() + cat.deal_type.slice(1)

    acc.push({
      section_id: matchingSection.section_id,
      value: cat.deal_type,
      label,
      icon_name: cat.icon_name || '',
    })
    return acc
  }, [])
})

const active = ref<string | null>(commonStore.selectedCategory)
const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const isScrollingOut = ref(false)

watch(items, (newItems) => {
  if (newItems.length) commonStore.setCategories(newItems)
}, { immediate: true })

watch(active, (val) => {
  commonStore.setSelectedCategory(val)
})

// section_id → DOM element; element → item.value (for single-observer reverse-lookup)
const sectionRefs = new Map<string, HTMLElement>()
const sectionValueMap = new Map<HTMLElement, string>()
// item pill refs for nav auto-scroll
const itemRefs = new Map<string, HTMLElement>()

// Which section values are currently inside the intersection zone
const intersectingSections = new Set<string>()

let sectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null

const SCROLL_STEP = 200

const updateScrollState = () => {
  const el = scrollContainer.value
  if (!el) return
  const isRtl = document.documentElement.dir === 'rtl'
  if (isRtl) {
    canScrollLeft.value = el.scrollLeft > -(el.scrollWidth - el.clientWidth) + 1
    canScrollRight.value = el.scrollLeft < 0
  } else {
    canScrollLeft.value = el.scrollLeft > 0
    canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
  }
}

function onScroll() {
  const el = document.getElementById('category-nav')
  if (!el) return
  const styleTop = parseFloat(getComputedStyle(el).top)
  if (isNaN(styleTop)) return
  isScrollingOut.value = el.getBoundingClientRect().top < styleTop - 0.5
}

const scrollList = (direction: 'left' | 'right') => {
  const el = scrollContainer.value
  if (!el) return
  el.scrollBy({
    left: direction === 'right' ? SCROLL_STEP : -SCROLL_STEP,
    behavior: 'smooth',
  })
}

const scrollActiveIntoView = (val: string | null) => {
  if (!val || !scrollContainer.value) return
  const itemEl = itemRefs.get(val)
  if (!itemEl) return
  itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

const setItemRef = (el: Element | ComponentPublicInstance | null, value: string) => {
  if (el instanceof HTMLElement) {
    itemRefs.set(value, el)
  } else if (el && '$el' in el && el.$el instanceof HTMLElement) {
    itemRefs.set(value, el.$el)
  }
}

const pickActiveFromIntersecting = () => {
  const first = items.value.find((item) => intersectingSections.has(item.value))
  if (first) active.value = first.value
}

const setupObserver = () => {
  sectionObserver?.disconnect()
  intersectingSections.clear()

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const value = sectionValueMap.get(entry.target as HTMLElement)
        if (!value) return
        if (entry.isIntersecting) {
          intersectingSections.add(value)
        } else {
          intersectingSections.delete(value)
        }
      })
      pickActiveFromIntersecting()
    },
    { rootMargin: '-400px 0px 0px 0px', threshold: 0 },
  )
}

const registerSection = (item: VddNavItem) => {
  if (sectionRefs.has(item.section_id)) return
  nextTick(() => {
    const el = document.getElementById(item.section_id)
    if (!el) return
    sectionRefs.set(item.section_id, el)
    sectionValueMap.set(el, item.value)
    sectionObserver?.observe(el)
  })
}

onMounted(() => {
  setupObserver()

  watch(items, (newItems) => {
    newItems.forEach(registerSection)
  }, { immediate: true })

  watch(active, scrollActiveIntoView)

  nextTick(() => {
    updateScrollState()
    if (scrollContainer.value) {
      resizeObserver = new ResizeObserver(updateScrollState)
      resizeObserver.observe(scrollContainer.value)
    }
  })

  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', onScroll)
})

const { trackCategoryNavClick } = useTracking()

const scrollToSection = (item: VddNavItem) => {
  trackCategoryNavClick(item.label)
  const el = sectionRefs.get(item.section_id)
  if (!el) return

  const yOffset = -150
  const y = el.getBoundingClientRect().top + window.scrollY + yOffset
  window.scrollTo({ top: y, behavior: 'smooth' })
}
</script>

<template>
  <div
    id="category-nav"
    class="sticky top-17.5 w-full bg-white md:top-22"
    :class="isScrollingOut ? 'z-30' : 'z-40'"
  >
    <!-- Width-constrained inner layout matching HeroBanner -->
    <div class="relative mx-auto container-app px-5 md:px-4">
      <!-- Left fade + scroll button -->
      <Transition name="fade-arrow">
        <div
          v-if="canScrollLeft"
          class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent"
        >
          <Button
            variant="outline-icon"
            size="icon-rounded"
            class="pointer-events-auto absolute top-1/2 left-1 size-7! -translate-y-1/2 border-none bg-primary-variant text-primary-vd shadow-xl shadow-surface backdrop-blur-2xl"
            aria-label="Scroll left"
            @click="scrollList('left')"
          >
            <Icon
              name="fluent:arrow-left-12-regular"
              class="size-4!"
            />
          </Button>
        </div>
      </Transition>

      <!-- Scrollable pill list -->
      <div
        ref="scrollContainer"
        class="no-scrollbar flex gap-2 overflow-x-auto py-4 md:py-5"
        @scroll.passive="updateScrollState"
      >
        <Button
          v-for="item in items"
          :key="item.value"
          :ref="(el) => setItemRef(el, item.value)"
          size="pill"
          :variant="active === item.value ? 'pill-active-category' : 'pill-inactive-category'"
          class="flex min-w-max flex-1 cursor-pointer transition-all duration-200"
          @click="scrollToSection(item)"
        >
          <component
            :is="iconComponents[item.icon_name]"
            v-if="item.icon_name && iconComponents[item.icon_name]"
            :fill="active === item.value ? 'var(--color-primary-vd)' : 'var(--color-on-surface)'"
            class="size-5! shrink-0"
          />
          <span class="text-body font-medium">{{ item.label }}</span>
        </Button>
      </div>

      <!-- Right fade + scroll button -->
      <Transition name="fade-arrow">
        <div
          v-if="canScrollRight"
          class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent"
        >
          <Button
            variant="outline-icon"
            size="icon-rounded"
            class="pointer-events-auto absolute top-1/2 right-1 size-7! -translate-y-1/2 border-none bg-primary-variant text-primary-vd shadow-xl shadow-surface backdrop-blur-2xl"
            aria-label="Scroll right"
            @click="scrollList('right')"
          >
            <Icon
              name="fluent:arrow-right-12-regular"
              class="size-4!"
            />
          </Button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-arrow-enter-active,
.fade-arrow-leave-active {
  transition: opacity 0.2s ease;
}
.fade-arrow-enter-from,
.fade-arrow-leave-to {
  opacity: 0;
}
</style>
