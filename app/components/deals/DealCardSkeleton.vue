<script setup lang="ts">
/**
 * DealCardSkeleton — loading placeholder matching DealCard dimensions exactly.
 * Figma node: I2065:32120;22361:11195 (same layout as DealCard)
 */
defineProps<{
  variant?: 'desktop' | 'responsive'
}>()
</script>

<template>
  <div
    class="flex animate-pulse flex-col overflow-clip rounded-[32px] border border-outline bg-white"
    :class="variant === 'responsive' ? 'w-[327px] shrink-0' : 'w-full'"
  >
    <!-- Image skeleton -->
    <div
      class="w-full bg-neutral-lowest"
      style="aspect-ratio: 340/240;"
    />

    <!-- Body skeleton (surface-bright) -->
    <div class="flex flex-col gap-3 rounded-b-[32px] bg-surface-bright px-6 pt-4 pb-6">
      <!-- Title -->
      <div class="h-7 w-4/5 rounded-lg bg-surface-variant" />
      <div class="h-5 w-3/5 rounded-lg bg-surface-variant" />

      <!-- Features -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2.5">
          <div class="size-5 shrink-0 rounded-full bg-surface-variant" />
          <div class="h-4 flex-1 rounded bg-surface-variant" />
        </div>
        <div class="flex items-center gap-2.5">
          <div class="size-5 shrink-0 rounded-full bg-surface-variant" />
          <div class="h-4 w-3/4 rounded bg-surface-variant" />
        </div>
      </div>

      <!-- Accordion button -->
      <div class="h-12 w-full rounded-[40px] bg-surface-variant" />
    </div>

    <!-- Footer skeleton -->
    <div class="flex items-center justify-between bg-white px-6 pt-3 pb-4">
      <div class="flex flex-col gap-1">
        <div class="h-4 w-16 rounded bg-neutral-lowest" />
        <div class="h-6 w-24 rounded bg-neutral-lowest" />
      </div>
      <div class="h-12 w-[142px] rounded-full bg-neutral-lowest" />
    </div>
  </div>
</template>
