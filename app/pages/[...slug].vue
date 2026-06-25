<script setup lang="ts">
const route = useRoute()
const { t, locale } = useI18n()

const slug = route.params.slug as string[] | string | undefined
const path = computed(() => {
  if (!slug || (Array.isArray(slug) && slug.length === 0)) return '/'
  return '/' + (Array.isArray(slug) ? slug.join('/') : slug)
})

const { page, sections, pending, error } = usePageData(path)

const isNotFound = computed(() => !pending.value && !error.value && !page.value)

watchEffect(() => {
  if (import.meta.client && !pending.value) {
    if (error.value) {
      showError({ statusCode: 503, statusMessage: 'CMS Unavailable' })
    } else if (!page.value) {
      showError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
  }
})

definePageMeta({ layout: 'default' })

const runtimeConfig = useRuntimeConfig()
const translation = computed(() => page.value?.translations?.[0] ?? null)

function getOgImageUrl(file: string | { id: string, filename_disk?: string } | null): string | undefined {
  if (!file) return undefined
  const id = typeof file === 'string' ? file : file.id
  const ext = typeof file !== 'string' && file.filename_disk
    ? '.' + file.filename_disk.split('.').pop()
    : ''
  return `${runtimeConfig.public.directusAssetsUrl}/${id}${ext}`
}

const ogImageUrl = computed(() => getOgImageUrl(page.value?.og_image ?? null))

useSeoMeta({
  title: () => translation.value?.meta_title || page.value?.title || t('defaultTitle'),
  description: () => translation.value?.meta_description || t('defaultDescription'),
  ogTitle: () => translation.value?.meta_title || page.value?.title || t('defaultTitle'),
  ogDescription: () => translation.value?.meta_description || t('defaultDescription'),
  ogImage: () => ogImageUrl.value,
  twitterImage: () => ogImageUrl.value,
  twitterCard: 'summary_large_image',
})

if (import.meta.dev) {
  watchEffect(() => {
    if (page.value) {
      console.warn(`[OG Meta] locale=${locale.value}`, {
        title: translation.value?.meta_title || page.value?.title,
        description: translation.value?.meta_description,
        ogImage: ogImageUrl.value,
        twitterImage: ogImageUrl.value,
        ogImageRaw: page.value?.og_image,
      })
    }
  })
}

function goHome() {
  navigateTo('/')
}

function retry() {
  if (import.meta.client) {
    window.location.reload()
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="pending"
      class="flex min-h-[60vh] items-center justify-center"
    >
      <div class="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div
      v-else-if="error || isNotFound"
      class="flex min-h-[60vh] flex-col items-center justify-center gap-lg px-lg py-xl text-center sm:px-xl"
    >
      <p class="text-[clamp(3.5rem,12vw,6.25rem)] leading-none font-bold text-primary">
        {{ isNotFound ? '404' : '503' }}
      </p>
      <h1 class="text-h5 font-medium text-on-surface sm:text-h4">
        {{ isNotFound ? t('errors.notFound') : t('errors.serverError') }}
      </h1>
      <p class="max-w-sm text-body leading-body text-on-surface-variant">
        {{ isNotFound
          ? t('errors.notFoundDescription')
          : t('errors.serverErrorDescription')
        }}
      </p>
      <div class="mt-lg flex flex-col items-center gap-md sm:flex-row sm:gap-lg">
        <Button
          size="lg"
          class="w-full sm:w-auto"
          @click="goHome"
        >
          {{ t('nav.home') }}
        </Button>
        <Button
          v-if="!isNotFound"
          variant="outline"
          size="lg"
          class="w-full sm:w-auto"
          @click="retry"
        >
          {{ t('common.retry') }}
        </Button>
      </div>
    </div>

    <PageSections
      v-else-if="sections.length"
      :sections="sections"
    />
  </div>
</template>
