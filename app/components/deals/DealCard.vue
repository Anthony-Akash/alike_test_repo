<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { DialogClose } from 'reka-ui'
import type { UnwrapRefCarouselApi as CarouselApi } from '~/components/ui/carousel/interface'

export interface DealCardData {
  id: string
  title: string
  description?: string
  short_description?: string
  images: string[]
  features: string[]
  priceOriginal?: number
  price: number
  externalUrl?: string
  type: 'dining' | 'shopping' | 'attraction' | 'pass' | 'holiday-package' | 'hotel'
  badge?: string
  ctaLabel?: string
}

interface Props {
  deal: DealCardData
  /** Desktop variant (used in 3-col grid) or responsive (used in horizontal scroll on mobile) */
  variant?: 'desktop' | 'responsive'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'desktop',
})

const modalOpen = ref(false)

const activeImage = ref(0)
const carouselApi = ref<CarouselApi>()

const { trackDealCardCta } = useTracking()

function onCarouselInit(api: CarouselApi) {
  carouselApi.value = api
  if (!api) return

  activeImage.value = api.selectedScrollSnap()

  api.on('select', () => {
    activeImage.value = api.selectedScrollSnap()
  })
}

function handlePrimaryAction() {
  const buttonName = (props.deal.ctaLabel ?? (props.deal.externalUrl ? 'visit website' : 'book now')).toLowerCase()
  trackDealCardCta(props.deal.title, buttonName)
  if (props.deal.externalUrl) {
    window.open(props.deal.externalUrl, '_blank', 'noopener,noreferrer')
  }
}

const savedPrice = computed(() => {
  if (!props.deal.priceOriginal || props.deal.priceOriginal <= props.deal.price) return null
  return Math.round((props.deal.priceOriginal - props.deal.price))
})

const handleModalOpen = (triggerLearnMoreEvent = true) => {
  if (triggerLearnMoreEvent) {
    trackDealCardCta(props.deal.title, 'learn more')
  }
  modalOpen.value = true
}

const pointerStart = ref<{ x: number, y: number } | null>(null)

function onPointerDown(e: PointerEvent) {
  pointerStart.value = { x: e.clientX, y: e.clientY }
}

function onPointerUp(e: PointerEvent) {
  if (!pointerStart.value) return
  const dx = Math.abs(e.clientX - pointerStart.value.x)
  const dy = Math.abs(e.clientY - pointerStart.value.y)
  pointerStart.value = null
  if (dx < 5 && dy < 5) {
    trackDealCardCta(props.deal.title, 'image click')
    handleModalOpen(false)
  }
}
</script>

<template>
  <!--
    Figma: "Deals - Desktop - Card" / "Deals - Responsive - Card"
    node-id: I2065:32120;22361:11195
    Border: 1px outline, radius-xl (32px)
    Background: surface (#fff)
  -->
  <article
    class="flex flex-col overflow-clip rounded-[32px] border border-outline bg-white shadow-xsm transition-shadow hover:shadow-elevation-3"
    :class="[
      variant === 'desktop' ? 'w-full' : 'w-[327px] shrink-0',
    ]"
    data-node-id="2065:32120"
  >
    <!-- Image section -->
    <div
      class="relative w-full cursor-pointer overflow-hidden rounded-[32px] bg-surface-bright"
      style="aspect-ratio: 340/240;"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
    >
      <Carousel
        class="group/carousel"
        :opts="{ loop: false, duration: 25 }"
        @init-api="onCarouselInit"
      >
        <CarouselContent class="-ml-0">
          <CarouselItem
            v-for="(img, idx) in deal.images"
            :key="idx"
            class="pl-0"
          >
            <div
              class="relative w-full"
              :class="deal.images.length <= 1 && 'flex items-center'"
              style="aspect-ratio: 340/240;"
            >
              <NuxtImg
                :src="img"
                :alt="deal.title"
                class="size-full overflow-hidden object-cover"
              />
            </div>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious
          v-if="deal.images.length > 1"
          class="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer border-0! bg-white! text-primary opacity-0 shadow-sm! backdrop-blur-sm transition-all duration-300 group-hover/carousel:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 group-hover/carousel:disabled:opacity-50"
          @pointerdown.stop
        />
        <CarouselNext
          v-if="deal.images.length > 1"
          class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-0! bg-white! text-primary opacity-0 shadow-sm! backdrop-blur-sm transition-all duration-300 group-hover/carousel:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 group-hover/carousel:disabled:opacity-50"
          @pointerdown.stop
        />
      </Carousel>

      <!-- Bottom gradient + page indicators -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 flex h-[59px] items-center justify-center px-5 py-2.5"
        style="background: linear-gradient(to bottom, rgba(0,0,0,0) 8.8%, rgba(0,0,0,0.8) 100%);"
      >
        <div
          v-if="deal.images?.length > 1"
          class="pointer-events-auto flex items-center gap-2"
        >
          <button
            v-for="(_, idx) in deal.images.slice(0, 4)"
            :key="idx"
            class="size-2 rounded-full transition-colors"
            :class="activeImage === idx ? 'bg-white' : 'bg-white/50'"
            :aria-label="$t('deals.imageNumber', { index: idx + 1 })"
            @click="carouselApi?.scrollTo(idx)"
            @pointerdown.stop
          />
        </div>
      </div>

      <!-- Deal badge (top-left) -->
      <div
        v-if="deal.badge"
        class="absolute inset-s-4 top-4 rounded-full bg-secondary px-3 py-1 text-small font-medium text-white"
      >
        {{ deal.badge }}
      </div>
    </div>

    <!-- Card body (surface-bright, bottom-radius) -->
    <div
      class="flex flex-1 flex-col gap-3 rounded-b-[32px] border-b border-outline bg-surface-bright px-6 pt-4 pb-6"
      data-node-id="I2065:32120;22361:11230"
    >
      <!-- Title -->
      <h3
        class="cursor-pointer text-h5 leading-[32px] font-medium text-on-surface"
        role="button"
        @click="handleModalOpen()"
      >
        {{ deal.title }}
      </h3>

      <div
        v-if="!deal.features?.length"
        class="text-body text-[#40484F]"
        v-html="deal?.short_description"
      />
      <!-- Feature list -->
      <div class="flex flex-col">
        <div
          v-for="(feature, idx) in deal.features.slice(0, 2)"
          :key="idx"
          class="flex items-center gap-2.5"
        >
          <Icon
            name="material-symbols:check-circle-outline-rounded"
            class="size-5 shrink-0 text-secondary"
          />
          <p class="text-body leading-[24px] text-on-surface-variant">
            {{ feature }}
          </p>
        </div>
      </div>
    </div>

    <!-- Card footer: price + CTA -->
    <div class="mt-auto flex flex-col justify-between gap-3 bg-white px-6 pt-3 pb-6">
      <div
        v-if="deal.priceOriginal"
        class="flex w-full justify-between"
      >
        <!-- Price -->
        <div class="flex w-full flex-col items-start">
          <!-- Original price (strikethrough) -->
          <div
            v-if="deal.priceOriginal"
            class="flex items-center gap-0.5"
          >
            <span class="text-caption leading-[20px] tracking-[0.14px] text-on-surface-variant line-through">
              {{ deal.priceOriginal }}
            </span>
          </div>
          <!-- Current price -->
          <div class="flex items-center gap-1">
            <span class="text-body leading-[24px] text-on-surface-variant">{{ $t('common.from') }}</span>
            <span class="text-[18px] leading-[24px] font-medium text-on-surface">
              {{ deal.price }}
            </span>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="flex justify-between gap-3">
        <Dialog v-model:open="modalOpen">
          <DialogTrigger as-child>
            <Button
              variant="pill-inactive"
              size="pill-lg"
              class="w-full cursor-pointer text-body! font-medium text-primary-vd"
              @click="handleModalOpen()"
            >
              {{ $t('deals.learnMore') }}
            </Button>
          </DialogTrigger>
          <DealDialogContent
            class="flex h-dvh w-full max-w-full flex-col gap-0 overflow-hidden rounded-none p-0 md:h-auto md:max-w-273 md:overflow-hidden md:rounded-lg"
            :class="deal.images.length <= 1 ? 'md:max-h-140' : 'md:max-h-160'"
          >
            <DialogHeader class="shrink-0 border-b border-gray-300 px-6 pt-lg pb-4 md:px-6 md:pt-7 md:pb-4">
              <div class="flex items-center justify-between">
                <DialogTitle class="text-h6 md:text-3xl">
                  {{ $t('deals.moreInfo') }}
                </DialogTitle>
                <DialogClose class="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#D5EBFF] text-[#004B6F] transition-opacity hover:opacity-80">
                  <X class="size-4" />
                  <span class="sr-only">{{ $t('common.close') }}</span>
                </DialogClose>
              </div>
            </DialogHeader>
            <div class="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-3 md:grid md:grid-cols-2 md:gap-6 md:overflow-hidden md:px-6 md:py-4">
              <div class="flex w-full flex-col self-start md:min-h-0">
                <div
                  class="relative w-full overflow-hidden rounded-[32px] bg-surface-bright"
                  style="aspect-ratio: 526/350;"
                >
                  <Carousel
                    class="group/carousel"
                    :opts="{ loop: false, duration: 25 }"
                    @init-api="onCarouselInit"
                  >
                    <CarouselContent class="-ml-0">
                      <CarouselItem
                        v-for="(img, idx) in deal.images"
                        :key="idx"
                        class="pl-0"
                      >
                        <div
                          class="relative w-full"
                          style="aspect-ratio: 526/350;"
                        >
                          <NuxtImg
                            :src="img"
                            :alt="deal.title"
                            class="size-full object-cover"
                          />
                          <div class="absolute inset-0 rounded-[32px] bg-black/10" />
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious
                      v-if="deal.images.length > 1"
                      class="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer border-0! bg-white! text-primary opacity-0 shadow-sm! backdrop-blur-sm transition-all duration-300 group-hover/carousel:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 group-hover/carousel:disabled:opacity-50 md:hidden"
                    />
                    <CarouselNext
                      v-if="deal.images.length > 1"
                      class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-0! bg-white! text-primary opacity-0 shadow-sm! backdrop-blur-sm transition-all duration-300 group-hover/carousel:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 group-hover/carousel:disabled:opacity-50 md:hidden"
                    />
                  </Carousel>
                  <div
                    v-if="deal.images?.length > 1"
                    class="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 md:hidden"
                  >
                    <button
                      v-for="(_, idx) in deal.images.slice(0, 4)"
                      :key="idx"
                      class="pointer-events-auto size-2 cursor-pointer rounded-full transition-colors"
                      :class="activeImage === idx ? 'bg-white' : 'bg-white/50'"
                      :aria-label="$t('deals.imageNumber', { index: idx + 1 })"
                      @click="carouselApi?.scrollTo(idx)"
                    />
                  </div>
                </div>
                <div
                  v-if="deal.images.length > 1"
                  class="no-scrollbar mt-3 hidden gap-sm overflow-x-auto md:flex"
                >
                  <button
                    v-for="(img, idx) in deal.images"
                    :key="idx"
                    type="button"
                    class="relative h-[82.66px] w-[125px] shrink-0 cursor-pointer overflow-hidden rounded-[12px] transition-opacity"
                    :class="idx === activeImage ? 'opacity-100' : 'opacity-70 hover:opacity-100'"
                    @click="carouselApi?.scrollTo(idx)"
                  >
                    <NuxtImg
                      :src="img"
                      :alt="`${deal.title} ${idx + 1}`"
                      class="size-full object-cover"
                    />
                  </button>
                </div>
              </div>
              <div class="flex w-full flex-col gap-4 md:min-h-0 md:overflow-y-auto md:pe-1">
                <h4 class="text-h5 md:text-h4">
                  {{ deal.title }}
                </h4>
                <div
                  class="prose prose-sm max-w-none text-body text-[#40484F] prose-p:my-2 prose-strong:font-semibold prose-ul:my-2 prose-ul:list-disc prose-ul:ps-5 prose-li:my-0.5"
                  v-html="deal?.description"
                />
              </div>
            </div>
            <DialogFooter class="shrink-0 border-t border-gray-100 px-6 pt-4 pb-4 md:justify-end">
              <Button
                variant="primary-vd"
                size="pill-lg"
                class="cursor-pointer text-body! font-medium text-white"
                @click="handlePrimaryAction"
              >
                {{ deal.ctaLabel ?? (deal.externalUrl ? $t('deals.visitWebsite') : $t('deals.bookNow')) }}
              </Button>
            </DialogFooter>
          </DealDialogContent>
        </Dialog>
        <Button
          variant="primary-vd"
          size="pill-lg"
          class="w-full cursor-pointer text-body! font-medium text-white"
          @click="handlePrimaryAction"
        >
          {{ deal.ctaLabel ?? (deal.externalUrl ? $t('deals.visitWebsite') : $t('deals.bookNow')) }}
        </Button>
      </div>
    </div>
  </article>
</template>
