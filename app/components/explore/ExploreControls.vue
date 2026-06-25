<script setup lang="ts">
interface Props {
  title?: string | null
  description?: string | null
}

defineProps<Props>()
</script>

<template>
  <div>
    <div class="px-6 md:px-16">
      <h2
        v-if="title"
        class="text-h3 font-medium text-text-title md:text-h2"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-2 text-on-surface-variant md:text-xl"
      >
        {{ description }}
      </p>
    </div>
    <!-- style="background: linear-gradient(180deg, #fff 0%, hsl(211 100% 97%) 100%)" -->
    <div
      class="mt-3 flex flex-col items-start justify-start gap-3 rounded-lg bg-gradient-to-b from-surface to-surface-variant px-6 pt-4 pb-8 md:px-16 lg:flex-row"
    >
      <div class="flex w-full flex-col items-start gap-4">
        <slot name="search-input" />
        <slot name="search-suggestions" />
      </div>
      <div class="flex w-full flex-col items-start gap-3 md:w-fit md:flex-row">
        <slot name="category-select" />
        <slot name="search-cta" />
      </div>
    </div>
  </div>
</template>
