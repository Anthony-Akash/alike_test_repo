<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const route = useRoute()
</script>

<template>
  <div>
    <h1>{{ $t('hotels.detailTitle') }}</h1>
    <p>{{ route.params.slug }}</p>
    <!-- Room selection placeholder -->
  </div>
</template>
