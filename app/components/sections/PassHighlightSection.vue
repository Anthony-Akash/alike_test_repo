<script setup lang="ts">
import type { VddPassHighlight } from '~/types/directus'

/**
 * PassHighlightSection — CMS-driven pass promotional cards
 * Rendered by PageSections when section.component = 'PassHighlightSection'
 *
 * Fetches from vdd_pass_highlights — 3 promotional cards with icon + image + title
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

const { trackPassHighlightCta } = useTracking()

function handlePassCta() {
  const sectionName = ('dubai tourist pass').toLowerCase()
  const buttonName = (props.ctaLabel || 'get pass now').toLowerCase()
  trackPassHighlightCta(sectionName, buttonName)
}

const { data: highlights, pending } = useSectionData<VddPassHighlight>(
  props.collectionName || 'vdd_pass_highlights',
  null,
  {
    fields: ['*', 'translations.*', ...getMediaFields('image')],
    translationKeys: ['translations'],
    filter: { status: { _eq: 'published' } },
    sort: ['sort'],
    limit: props.cardCount || 3,
  },
)
</script>

<template>
  <section class="relative isolate w-full overflow-hidden bg-white">
    <div class="container-main flex flex-col gap-0 md:gap-10 lg:flex-row lg:items-center lg:justify-center">
      <!-- Left/Top: title + description + CTA -->
      <div class="relative z-3 flex flex-col gap-6 bg-white px-6 pt-8 pb-4 lg:flex-1 lg:gap-8 lg:overflow-clip lg:px-0 lg:ps-6 lg:pt-0 lg:pb-0">
        <div
          v-if="title || description"
          class="flex flex-col gap-2"
        >
          <h2
            v-if="title"
            class="text-h3 leading-h3 font-medium tracking-[-0.11px] whitespace-pre-line text-on-surface md:text-h2 md:leading-[48px] md:tracking-[-0.5%] md:text-text-title"
          >
            {{ title }}
          </h2>
          <p
            v-if="description"
            class="text-body leading-body font-normal! text-on-surface-variant md:text-h6 md:leading-h6"
          >
            {{ description }}
          </p>
        </div>
        <NuxtLink
          v-if="ctaLabel && ctaUrl"
          :to="ctaUrl"
          target="_blank"
          class="hidden h-12 w-fit items-center justify-center gap-2 rounded-full bg-primary-vd px-6 py-3 text-base font-medium text-white hover:bg-[#004B6F] active:scale-95 md:inline-flex"
          @click="handlePassCta"
        >
          {{ ctaLabel }}
        </NuxtLink>
      </div>

      <!-- Right/Bottom: purple band + cards -->
      <div class="absolute pb-5 lg:z-1 lg:h-117.5 lg:w-full lg:shrink-0 lg:overflow-hidden lg:bg-white lg:pb-0">
        <div class="absolute end-[-50%] top-0 h-115 w-[calc(100%-24px)] rounded-ss-[24px] rounded-es-[24px] bg-secondary lg:end-0 lg:top-1/2 lg:h-[470px] lg:w-[740px] lg:-translate-y-1/2" />
      </div>
      <div class="relative pb-4 lg:z-1 lg:h-117.5 lg:w-225.5 lg:shrink-0 lg:overflow-hidden lg:bg-white lg:pb-0">
        <!-- Purple background band -->
        <div class="absolute end-[-30%] top-0 h-115 w-[calc(100%-24px)] rounded-ss-[24px] rounded-es-[24px] bg-secondary lg:-end-5 lg:top-1/2 lg:h-[470px] lg:w-[740px] lg:-translate-y-1/2" />

        <!-- Cards — scrollable on mobile, static on desktop -->
        <div
          v-if="!pending && highlights?.length"
          class="relative flex gap-4 overflow-x-auto scroll-smooth px-6 pt-4 lg:absolute lg:start-10 lg:top-10 lg:gap-5 lg:overflow-visible lg:px-0 lg:pt-0 [&::-webkit-scrollbar]:hidden"
          style="-ms-overflow-style: none; scrollbar-width: none"
        >
          <div
            v-for="(highlight, index) in highlights"
            :key="highlight.id"
            class="relative flex h-105 w-71.5 shrink-0 flex-col items-start justify-end overflow-hidden rounded-sm bg-white px-6 py-8 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.04)] lg:h-97.25 lg:w-66.25 lg:rounded-md"
          >
            <!-- Background image -->
            <div
              v-if="highlight.image"
              class="pointer-events-none absolute inset-0"
            >
              <NuxtImg
                :src="getAssetPath(highlight.image)"
                alt=""
                class="size-full object-cover"
              />
            </div>
            <!-- Gradient overlay: transparent → #000000 at 80% -->
            <div
              class="absolute inset-0 opacity-80"
              style="background: linear-gradient(to bottom, transparent 45%, rgba(0,0,0,1) 100%)"
            />
            <!-- Content at bottom -->
            <div class="relative z-10 flex flex-col gap-3">
              <Icon
                v-if="highlight.icon"
                :name="highlight.icon"
                :class="['size-6! object-contain text-white md:size-7!', index === 1 && 'scale-x-[-1]']"
              />
              <p class="text-h6 leading-[28px] font-medium whitespace-pre-wrap text-white">
                {{ highlight.translations?.[0]?.title }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 flex w-full px-6 pt-4 md:hidden">
          <NuxtLink
            v-if="ctaLabel && ctaUrl"
            :to="ctaUrl"
            target="_blank"
            class="flex h-12 w-full items-center justify-center rounded-full bg-primary-vd px-6 py-3 text-base font-medium text-white"
            @click="handlePassCta"
          >
            {{ ctaLabel }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
