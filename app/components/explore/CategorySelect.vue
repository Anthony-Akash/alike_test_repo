<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  SelectIcon,
} from 'reka-ui'
import { ChevronDown } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import type { VddCategory } from '~/types/directus'

interface Props {
  categories: VddCategory[]
  allLabel: string
}

defineProps<Props>()
const model = defineModel<string>({ default: 'all' })

const triggerWrapper = ref<HTMLElement | null>(null)
const triggerWidth = ref(0)

onMounted(() => {
  const el = triggerWrapper.value
  if (!el) return
  triggerWidth.value = el.offsetWidth
  const ro = new ResizeObserver(([entry]) => {
    if (!entry) return
    triggerWidth.value = entry.contentRect.width
  })
  ro.observe(el)
})
</script>

<template>
  <SelectRoot v-model="model">
    <div
      ref="triggerWrapper"
      class="w-full"
    >
      <SelectTrigger
        class="group flex h-12 w-full cursor-pointer items-center justify-between
          gap-3 rounded-full border border-border bg-white px-5
          text-body text-text-title transition-all outline-none
          hover:border-primary/50 hover:shadow-sm
          focus:ring-1 focus:ring-primary
          data-placeholder:text-on-surface-variant data-[state=open]:border-primary/50
          data-[state=open]:shadow-sm
          md:h-14 md:w-64 md:px-6 md:text-[18px]"
      >
        <SelectValue :placeholder="allLabel" />
        <SelectIcon as-child>
          <ChevronDown
            class="size-4 shrink-0 text-on-surface-variant/70 transition-transform
              duration-200 group-data-[state=open]:rotate-180 md:size-5"
          />
        </SelectIcon>
      </SelectTrigger>
    </div>
    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="8"
        :style="{ width: triggerWidth ? `${triggerWidth}px` : undefined }"
        class="z-50 overflow-hidden rounded-xl border border-border bg-white
          shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)]
          data-[side=bottom]:slide-in-from-top-2 data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          data-[state=open]:animate-in data-[state=open]:fade-in-0
          data-[state=open]:zoom-in-95"
      >
        <SelectViewport class="w-full p-2">
          <SelectItem
            value="all"
            class="relative flex w-full cursor-pointer items-center rounded-full
              px-5 py-2.5 text-[15px] text-text-title transition-colors duration-150
              outline-none select-none
              hover:bg-primary-variant/60 focus:bg-primary-variant/60
              data-[state=checked]:bg-primary-variant
              data-[state=checked]:font-medium
              data-[state=checked]:text-primary-vd
              md:text-base"
          >
            <SelectItemText>{{ allLabel }}</SelectItemText>
          </SelectItem>
          <SelectItem
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.deal_type"
            class="relative flex w-full cursor-pointer items-center rounded-full
              px-5 py-2.5 text-[15px] text-text-title transition-colors duration-150
              outline-none select-none
              hover:bg-primary-variant/60 focus:bg-primary-variant/60
              data-[state=checked]:bg-primary-variant
              data-[state=checked]:font-medium
              data-[state=checked]:text-primary-vd
              md:text-base"
          >
            <SelectItemText>{{ cat.translations?.[0]?.name }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
