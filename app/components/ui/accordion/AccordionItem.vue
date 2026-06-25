<script setup lang="ts">
import type { AccordionItemProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { AccordionItem, useForwardProps } from "reka-ui"
import { cn } from '~/lib/utils'

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <AccordionItem
    v-bind="forwardedProps"
    :class="cn(
      'flex flex-col border border-outline transition-all duration-200 hover:cursor-pointer',
      'rounded-3xl',
      'md:data-[state=closed]:rounded-2xl',
      'data-[state=closed]:bg-surface-dim',
      'data-[state=open]:bg-white',
      props.class
    )"
  >
    <slot />
  </AccordionItem>
</template>
