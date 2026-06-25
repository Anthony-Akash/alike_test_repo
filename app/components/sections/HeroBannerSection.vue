<script setup lang="ts">
import type { VddBanner } from '~/types/directus'

/**
 * HeroBannerSection — CMS-driven hero banner
 * Rendered by PageSections when section.component = 'HeroBannerSection'
 *
 * Fetches banner data from vdd_banners collection
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

// Fetch banner data from Directus
const { data: banners, pending } = useSectionData<VddBanner>(
  props.collectionName || 'vdd_banners',
  null,
  {
    fields: [
      '*',
      'translations.*',
      ...getMediaFields('image'),
      ...getMediaFields('mobile_image'),
      ...getMediaFields('ar_image'),
      ...getMediaFields('ar_mobile_image'),
    ],
    translationKeys: ['translations'],
    filter: {
      status: { _eq: 'published' },
      ...(props.pageSlot ? { page_slot: { _eq: props.pageSlot } } : {}),
    },
    sort: ['sort'],
    limit: props.cardCount || 1,
  },
)

const banner = computed(() => banners.value?.[0] ?? null)

const { locale } = useI18n()

const translation = computed(() => {
  const translations = banner.value?.translations
  if (!Array.isArray(translations) || translations.length === 0) return null
  // Prefer matching locale; fall back to first entry if deep filter didn't apply
  return (
    translations.find((t) => typeof t === 'object' && t.languages_id === locale.value)
    ?? (typeof translations[0] === 'object' ? translations[0] : null)
  )
})

const bannerTitle = computed(() => translation.value?.title || props.title || '')
const bannerSubtitle = computed(() => translation.value?.subtitle || props.description || '')
const bannerCtaLabel = computed(() => translation.value?.cta_label || props.ctaLabel || '')
const bannerCtaUrl = computed(() => banner.value?.cta_url || props.ctaUrl || '')
const bannerDescription = computed(() => translation.value?.description || props.description || '')
const desktopImage = computed(() => getAssetPath(banner.value?.image?.filename_disk))
const mobileImage = computed(() => getAssetPath(banner.value?.mobile_image?.filename_disk))
const desktopImageAr = computed(() => getAssetPath(banner.value?.ar_image?.filename_disk))
const mobileImageAr = computed(() => getAssetPath(banner.value?.ar_mobile_image?.filename_disk))
</script>

<template>
  <HeroBanner
    v-if="!pending && banner"
    :title="bannerTitle"
    :subtitle="bannerSubtitle"
    :description="bannerDescription"
    :cta-label="bannerCtaLabel"
    :cta-url="bannerCtaUrl"
    :image-src="desktopImage"
    :image-mobile-src="mobileImage"
    :image-src-ar="desktopImageAr"
    :image-mobile-src-ar="mobileImageAr"
    image-alt="Dubai deals banner"
  />
</template>
