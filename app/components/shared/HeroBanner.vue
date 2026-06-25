<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

interface Props {
  title?: string
  subtitle?: string
  description?: string
  ctaLabel?: string
  ctaUrl?: string
  imageSrc?: string
  imageMobileSrc?: string
  imageSrcAr?: string
  imageMobileSrcAr?: string
  imageAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Deals in Dubai',
  subtitle: "Enjoy exclusive deals and offers at Dubai's top hotels and resorts and enjoy your holiday in the city for less. Browse through amazing deals at Dubai's top attractions and book the perfect trip.",
  description: "Enjoy exclusive deals and offers at Dubai's top hotels and resorts and enjoy your holiday in the city for less. Browse through amazing deals at Dubai's top hotels and attractions and book the perfect trip.",
  ctaLabel: 'Explore deals',
  ctaUrl: 'explore-sec',
  imageSrc: '/images/hero-banner.jpg',
  imageMobileSrc: '/images/hero-banner.jpg',
  imageSrcAr: '',
  imageMobileSrcAr: '',
  imageAlt: 'Dubai skyline',
})

const { locale } = useI18n()
const { smoothScrollTo } = useScroll()
const { trackHeroBannerCta } = useTracking()

const resolvedImageSrc = computed(() => {
  if (locale.value === 'ar' && props.imageSrcAr) return props.imageSrcAr
  return props.imageSrc
})

const resolvedImageMobileSrc = computed(() => {
  if (locale.value === 'ar' && props.imageMobileSrcAr) return props.imageMobileSrcAr
  return props.imageMobileSrc || resolvedImageSrc.value
})

function handleCtaClick() {
  if (!props.ctaUrl) return
  trackHeroBannerCta(props.title, props.ctaLabel)
  const el = document.getElementById(props.ctaUrl)
  if (el) smoothScrollTo(el, 1000)
}
</script>

<template>
  <section
    class="relative flex w-full justify-center px-3 md:px-4"
    data-node-id="2065:32105"
  >
    <div
      class="relative container-app flex h-125 min-h-125 w-full items-center justify-center overflow-hidden rounded-3xl
             md:h-142.5 md:min-h-142.5 md:rounded-2xl"
    >
      <!-- Background image - mobile -->
      <div class="absolute inset-0 md:hidden">
        <NuxtImg
          :src="resolvedImageMobileSrc"
          :alt="imageAlt"
          class="size-full object-cover"
          quality="90"
        />
      </div>
      <!-- Background image - desktop -->
      <div class="absolute inset-0 hidden md:block">
        <NuxtImg
          :src="resolvedImageSrc"
          :alt="imageAlt"
          class="size-full object-cover"
          quality="90"
        />
      </div>

      <!-- Gradient overlay (dark left → transparent right, matches Figma shape mask) -->
      <div
        class="absolute inset-0 bg-linear-to-l from-black/0 to-black/60"
      >
        <div class="absolute inset-0 flex flex-col items-start p-8 md:hidden">
          <div class="flex w-full flex-1 flex-col items-start justify-between">
            <!-- Title + body text -->
            <div class="flex w-full flex-col gap-3">
              <h1
                class="w-full font-sans text-[48px] leading-14 font-normal
                     tracking-[-0.48px] text-white"
              >
                {{ title }}
              </h1>
              <p class="w-full font-sans text-[18px] leading-0 leading-h3 font-normal text-white">
                {{ description }}
              </p>
            </div>

            <!-- CTA + page indicators -->
            <div
              v-if="ctaUrl"
              class="flex w-full flex-col gap-4 pb-2"
            >
              <button
                type="button"
                class="group flex h-12 w-full cursor-pointer items-center justify-between rounded-full
                     bg-white py-2 pr-4 pl-6 transition-colors hover:bg-neutral-100"
                @click="handleCtaClick"
              >
                <span
                  class="font-sans text-body leading-[24px]
                       font-medium text-black"
                >
                  {{ ctaLabel }}
                </span>
                <Icon
                  name="material-symbols:chevron-right"
                  class="icon-chevron size-5! shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="absolute inset-0 hidden items-start p-16 md:flex">
          <div class="flex w-full max-w-195 min-w-130 flex-col gap-8">
            <!-- Title + subtitle block -->
            <div class="flex w-full flex-col gap-4">
              <h1
                class="w-full font-sans text-display leading-[80px] font-medium
                     tracking-[-0.68px] text-surface"
              >
                {{ title }}
              </h1>
              <p class="w-full max-w-136 font-sans text-h5 leading-[32px] font-normal text-surface">
                {{ description }}
              </p>
            </div>

            <!-- CTA button — w-fit, h-14 (56px), px-6 py-4, gap-2 -->
            <button
              v-if="ctaUrl"
              type="button"
              class="group inline-flex h-14 w-fit min-w-35.75! cursor-pointer items-center gap-2 rounded-full
                   bg-white px-6 py-4 font-sans text-h6 leading-[28px]
                   font-medium text-on-surface transition-colors hover:bg-neutral-100"
              @click="handleCtaClick"
            >
              {{ ctaLabel }}
              <Icon
                name="material-symbols:chevron-right"
                class="icon-chevron size-6! shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        <!-- Scroll mouse indicator — desktop only, centred, bottom-14 -->
        <div class="absolute bottom-14 left-1/2 hidden -translate-x-11/12 flex-col items-center gap-2 md:flex">
          <div class="relative h-6 w-[16.5px] opacity-70">
            <div class="absolute inset-0 rounded-[50px] border-2 border-white" />
            <div
              class="absolute top-[22%] left-1/2 h-[18%] w-[28%] rounded-full bg-white"
              style="animation: var(--animate-scroll-dot);"
            />
          </div>
        </div>
      </div>
      <!-- end banner -->
    </div>
  </section>
</template>
