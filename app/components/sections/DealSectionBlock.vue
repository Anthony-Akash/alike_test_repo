<script setup lang="ts">
import type { DealCardData } from '~/components/deals/DealCard.vue'
import type { VddDeal } from '~/types/directus'

/**
 * DealSectionBlock — CMS-driven deal cards section
 * Rendered by PageSections when section.component = 'DealSectionBlock'
 *
 * Fetches deals from vdd_deals filtered by deal_type_filter
 * Transforms them into DealCardData format for the existing DealSection/DealCard components
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
const { locale } = useI18n()

// Build filter for deals
const dealFilter = computed(() => {
  const filter: Record<string, unknown> = {
    _and: [
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
    ],
  }
  if (props.dealTypeFilter) {
    (filter._and as Record<string, unknown>[]).push({ type: { _eq: props.dealTypeFilter } })
  }
  return filter
})

// Fetch deals from Directus
const { data: deals, pending } = useSectionData<VddDeal>(
  props.collectionName || 'vdd_deals',
  null,
  {
    fields: [
      '*',
      'translations.*',
      'images.directus_files_id.id',
      'images.directus_files_id.filename_disk',
      'tags.vdd_tags_id.slug',
      'tags.vdd_tags_id.color',
      'tags.vdd_tags_id.translations.*',
    ],
    translationKeys: ['translations', 'tags.vdd_tags_id.translations'],
    filter: dealFilter.value,
    // `id` tiebreaker keeps ordering deterministic when `sort` is null/equal
    sort: ['sort', 'id'],
  },
)

/**
 * Transform VddDeal into DealCardData for existing card components
 * This is the normalisation/adapter layer referenced in project-information.md
 */
function transformDeal(deal: VddDeal): DealCardData {
  const translation = deal.translations?.[0]

  // Build image URLs from deal images or fallback to thumbnail
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

  // Extract tag labels (features/badges)
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
  return (deals.value as VddDeal[])
    .map(transformDeal)
    .slice(0, props.cardCount || 3)
})

// Pass ctaUrl as the section ID to scroll to on CTA click
const ctaSection = computed(() => props.ctaUrl || '')
</script>

<template>
  <DealSection
    :title="title || ''"
    :description="description || ''"
    :deals="cardData"
    :cta-section="ctaSection"
    :cta-label="ctaLabel || undefined"
    :card-count="cardCount"
    :loading="pending"
  />
</template>
