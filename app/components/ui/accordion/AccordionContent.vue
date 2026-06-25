<script setup lang="ts">
import type { AccordionContentProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { AccordionContent } from "reka-ui"
import { cn } from '~/lib/utils'

const props = defineProps<AccordionContentProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <AccordionContent
    v-bind="delegatedProps"
    class="overflow-hidden text-body font-normal leading-6 transition-all pb-4 px-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
  >
    <div :class="cn('pb-0 pt-0', props.class)">
      <slot />
    </div>
  </AccordionContent>
</template>
