<script setup lang="ts">
import type { VddFaq } from '~/types/directus'
import { useCommonStore } from '~/stores/index'

/**
 * FaqSection — CMS-driven FAQ accordion
 * Rendered by PageSections when section.component = 'FaqSection'
 *
 * Fetches FAQ items from vdd_faqs and renders them in an accordion
 */

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

const commonStore = useCommonStore()

const active = computed(() => commonStore.searchCategory || null)

const { data: faqs, pending } = useSectionData<VddFaq>(
  props.collectionName || 'vdd_faqs',
  null,
  {
    fields: ['*', 'translations.*'],
    translationKeys: ['translations'],
    filter: { status: { _eq: 'published' } },
    sort: ['sort'],
  },
)

const { trackFaqAccordion } = useTracking()

const accordionValue = ref<string | undefined>(undefined)

watch(accordionValue, (newVal, oldVal) => {
  if (oldVal) {
    const closedFaq = displayedFaqs.value.find((f) => String(f.id) === oldVal)
    if (closedFaq) {
      trackFaqAccordion(closedFaq.translations?.[0]?.question || '', 'Collapse')
    }
  }
  if (newVal) {
    const openFaq = displayedFaqs.value.find((f) => String(f.id) === newVal)
    if (openFaq) {
      trackFaqAccordion(openFaq.translations?.[0]?.question || '', 'Expand')
    }
  }
})

const displayedFaqs = computed(() => {
  if (!faqs.value?.length) return []

  const activeType = active.value

  if (activeType) {
    const matched = faqs.value.filter((faq) => faq.faq_type === activeType)
    if (matched.length) return matched
  }

  const untyped = faqs.value.filter((faq) => !faq.faq_type)
  if (untyped.length) return untyped

  return faqs.value.slice(0, 4)
})
</script>

<template>
  <section
    class="flex w-full flex-col gap-6 pt-8 md:py-16"
    :class="theme === 'dark' ? 'bg-surface-dim' : 'bg-white'"
  >
    <div class="mx-auto container-main w-full px-6 lg:px-6 xl:px-6 2xl:px-6">
      <!-- Section header -->
      <div
        v-if="title"
        class="flex flex-col gap-2 pb-6"
      >
        <h2 class="text-[40px] leading-[48px] font-medium tracking-[-0.2px] text-text-title">
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="max-w-[780px] text-[20px] leading-[28px] font-normal text-on-surface-variant"
        >
          {{ description }}
        </p>
      </div>

      <!-- FAQ Accordion -->
      <Accordion
        v-if="!pending && displayedFaqs.length"
        v-model="accordionValue"
        type="single"
        collapsible
        class="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-6"
      >
        <AccordionItem
          v-for="faq in displayedFaqs"
          :key="faq.id"
          :value="String(faq.id)"
          class="w-full self-start border-b border-border"
        >
          <AccordionTrigger class="px-4 text-start hover:cursor-pointer md:px-6">
            {{ faq.translations?.[0]?.question }}
          </AccordionTrigger>
          <AccordionContent class="w-full px-0 leading-5.5 text-on-surface-variant md:px-2">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div
              class="prose prose-sm max-w-none prose-p:text-body prose-a:text-primary prose-a:underline prose-strong:font-semibold prose-em:italic prose-ol:my-2 prose-ol:list-decimal prose-ol:ps-5 prose-ul:my-2 prose-ul:list-disc prose-ul:ps-5 prose-li:my-0.5"
              v-html="faq.translations?.[0]?.answer"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <!-- Loading state -->
      <div
        v-else-if="pending"
        class="space-y-4"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="h-14 animate-pulse rounded-lg bg-surface-dim"
        />
      </div>
    </div>
  </section>
</template>
