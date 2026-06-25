<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

export interface DealTab {
  key: string
  label: string
  icon?: string
}

interface Props {
  tabs: DealTab[]
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const scrollContainer = ref<HTMLElement>()

function scrollLeft() {
  scrollContainer.value?.scrollBy({ left: -200, behavior: 'smooth' })
}

function scrollRight() {
  scrollContainer.value?.scrollBy({ left: 200, behavior: 'smooth' })
}
</script>

<template>
  <!-- Figma: M07_White — horizontal tabs row -->
  <div
    class="relative flex w-full items-center bg-white py-8"
    data-node-id="2065:32106"
  >
    <!-- Scroll left button (desktop) -->
    <Button
      variant="outline-icon"
      size="icon-rounded"
      class="absolute start-0 z-10 hidden shrink-0 lg:flex"
      aria-label="Scroll tabs left"
      @click="scrollLeft"
    >
      <ChevronLeft class="size-4" />
    </Button>

    <!-- Tabs scrollable row -->
    <div
      ref="scrollContainer"
      class="no-scrollbar flex h-12 w-full gap-2 overflow-x-auto px-6 lg:gap-2 lg:px-0"
    >
      <Button
        v-for="tab in tabs"
        :key="tab.key"
        size="tab"
        :variant="modelValue === tab.key ? 'tab-active' : 'tab-inactive'"
        class="shrink-0 transition-colors"
        @click="emit('update:modelValue', tab.key)"
      >
        <!-- Tab icon slot -->
        <span
          v-if="tab.icon"
          class="flex size-6 items-center justify-center text-body"
        >
          {{ tab.icon }}
        </span>
        {{ tab.label }}
      </Button>
    </div>

    <!-- Scroll right button (desktop) -->
    <Button
      variant="outline-icon"
      size="icon-rounded"
      class="absolute end-0 z-10 hidden shrink-0 lg:flex"
      aria-label="Scroll tabs right"
      @click="scrollRight"
    >
      <ChevronRight class="size-4" />
    </Button>
  </div>
</template>
