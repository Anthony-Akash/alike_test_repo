<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const route = useRoute()
</script>

<template>
  <div>
    <h1>{{ $t('passes.detailTitle') }}</h1>
    <p>{{ route.params.slug }}</p>
  </div>
</template>
