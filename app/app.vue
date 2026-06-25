<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const { locale, locales } = useI18n()

const dir = computed(() => {
  const current = locales.value.find(
    (l) => (typeof l === 'string' ? l : l.code) === locale.value,
  )
  return current && typeof current !== 'string' && current.dir === 'rtl' ? 'rtl' : 'ltr'
})

onMounted(() => {
  cartStore.hydrate()
})
</script>

<template>
  <Html
    :lang="locale"
    :dir="dir"
  >
    <ConfigProvider :dir="dir">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ConfigProvider>
  </Html>
</template>
