<script setup lang="ts">
import type { DealCardData } from './DealCard.vue'
import { useCommonStore } from '~/stores/index'

const props = withDefaults(defineProps<Props>(), {
  description: '',
  ctaSection: '',
  ctaLabel: '',
  cardCount: 3,
  loading: false,
})

/**
 * DealSection — Figma node "M07_Regular" (node 2065:32115)
 *
 * Desktop: 3-col card grid, max-w-[1280px] centered, pb-16
 * Mobile:  horizontal scroll carousel with dot indicators + CTA button below
 *
 * Props:
 *  - title:       Section heading  e.g. "Attraction Deals"
 *  - description: Section subtext
 *  - deals:       Array of DealCardData
 *  - ctaSection:  ID of a page section to smooth-scroll to on CTA click
 *  - ctaLabel:    CTA button label (falls back to i18n common.see_all)
 *  - loading:     Show skeletons
 */
interface Props {
  title: string
  description?: string
  deals: DealCardData[]
  ctaSection?: string
  ctaLabel?: string
  cardCount?: number
  loading?: boolean
}

const { smoothScrollTo } = useScroll()
const commonStore = useCommonStore()
const { trackDealsSectionDiscoverMore } = useTracking()

function handleCtaClick() {
  const buttonName = (props.ctaLabel || 'discover more').toLowerCase()
  trackDealsSectionDiscoverMore(props.title, buttonName)
  const searchType = props?.deals[0]?.type || null
  if (searchType) {
    commonStore.setSearchCategory(searchType)
  }
  if (!props.ctaSection) return
  const el = document.getElementById(props.ctaSection)
  if (el) smoothScrollTo(el, 1000)
}

// Mobile carousel state
const activeSlide = ref(0)
const carouselEl = ref<HTMLElement>()
const CARD_WIDTH = 327
const CARD_GAP = 8

function onCarouselScroll() {
  if (!carouselEl.value) return
  const isRtl = document.documentElement.dir === 'rtl'
  const scrollDistance = isRtl
    ? Math.abs(carouselEl.value.scrollLeft)
    : carouselEl.value.scrollLeft
  activeSlide.value = Math.round(scrollDistance / (CARD_WIDTH + CARD_GAP))
}

function goToSlide(idx: number) {
  if (!carouselEl.value) return
  const isRtl = document.documentElement.dir === 'rtl'
  carouselEl.value.scrollTo({
    left: isRtl
      ? -(idx * (CARD_WIDTH + CARD_GAP))
      : idx * (CARD_WIDTH + CARD_GAP),
    behavior: 'smooth',
  })
}

const visibleCount = computed(() => Math.min(props.deals.length, props.cardCount))
const skeletonCount = computed(() => +props.cardCount)

const gridColsClass = computed(() => {
  const cols = Math.min(props.cardCount, 3)
  if (cols === 1) return 'lg:grid-cols-1'
  if (cols === 2) return 'lg:grid-cols-2'
  return 'lg:grid-cols-3'
})

const sectionType = computed(() => props?.deals[0]?.type)
</script>

<template>
  <!--
    Figma: "M07_Regular" — node 2065:32115
    Desktop: white bg, flex-col, gap-24px, pb-64px
    Content max-width 1280px, centered
  -->
  <section
    class="flex w-full flex-col gap-4 bg-white py-4 md:gap-6 md:py-8"
    data-node-id="2065:32115"
  >
    <div class="mx-auto container-main w-full px-6 lg:px-6 xl:px-6 2xl:px-6">
      <!-- Section header — node 2065:32116/32117 -->
      <div class="flex items-start justify-between">
        <div class="flex flex-col gap-2">
          <!-- Title: H2/Medium — 40px/48px, text-title, tracking -0.2px -->
          <h2
            class="text-h3 leading-h3 font-medium tracking-[-0.2px] text-text-title md:text-h2"
            data-node-id="I2065:32117;14802:14476;14706:46232"
          >
            {{ title }}
          </h2>
          <!-- Description: H6/Regular — 20px/28px, on-surface-variant -->
          <p
            v-if="description"
            class="text-body leading-body font-normal! text-on-surface-variant md:text-h6 md:leading-h6"
            data-node-id="I2065:32117;14802:14477;14715:4526"
          >
            {{ description }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Desktop: 3-column grid ─────────────────────────── -->
    <div
      class="mx-auto container-main hidden w-full gap-5 lg:grid lg:px-6 xl:px-6 2xl:px-6"
      :class="gridColsClass"
      data-node-id="2065:32119"
    >
      <!-- Skeleton state -->
      <template v-if="loading">
        <DealCardSkeleton
          v-for="n in skeletonCount"
          :key="`skel-${n}`"
          variant="desktop"
        />
      </template>

      <!-- Loaded cards (respect cardCount from CMS) -->
      <template v-else>
        <DealCard
          v-for="deal in deals.slice(0, cardCount)"
          :key="deal.id"
          :deal="deal"
          variant="desktop"
        />
      </template>
    </div>

    <!-- ── Mobile: horizontal scroll carousel ─────────────── -->
    <div class="flex flex-col gap-4 px-6 lg:hidden">
      <!-- Scrollable track -->
      <div
        ref="carouselEl"
        class="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-0"
        @scroll="onCarouselScroll"
      >
        <!-- Skeleton state -->
        <template v-if="loading">
          <DealCardSkeleton
            v-for="n in skeletonCount"
            :key="`skel-m-${n}`"
            variant="responsive"
            class="snap-start"
          />
        </template>

        <!-- Cards -->
        <template v-else>
          <DealCard
            v-for="deal in deals.slice(0, cardCount)"
            :key="deal.id"
            :deal="deal"
            variant="responsive"
            class="snap-start"
          />
        </template>
      </div>

      <!-- Dot indicators — Figma: "Frame 1326" / "Option" nodes -->
      <div
        v-if="!loading && deals.length > 1"
        class="flex h-3 items-center justify-center gap-2"
        data-node-id="2066:34790"
      >
        <button
          v-for="(_, idx) in deals.slice(0, cardCount)"
          :key="idx"
          class="flex rounded-full transition-all"
          :class="
            activeSlide === idx
              ? 'size-3 bg-black'
              : 'size-2 bg-gray-400'
          "
          :aria-label="`Go to slide ${idx + 1}`"
          @click="goToSlide(idx)"
        />
      </div>
    </div>

    <div class="mx-auto container-main w-full px-6 lg:px-6 xl:px-6 2xl:px-6">
      <div
        v-if="ctaSection"
      >
        <button
          type="button"
          class="group flex h-12 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary-variant px-4 text-body leading-[20px] font-medium text-primary-vd shadow-surface-dim transition-colors duration-300 hover:bg-primary-variant-hover active:scale-95 active:bg-primary-variant-focused active:ease-in md:max-w-43.75"
          data-node-id="2067:37181"
          @click="handleCtaClick"
        >
          {{ ctaLabel || $t('common.see_all', 'See All') }}
          <Icon
            name="material-symbols:chevron-right"
            class="icon-chevron size-6! font-bold text-primary-vd! transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
