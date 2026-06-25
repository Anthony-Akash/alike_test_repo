<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const route = useRoute()
</script>

<template>
  <div>
    <h1>{{ $t('holidayPackages.detailTitle') }}</h1>
    <p>{{ route.params.slug }}</p>
    <!-- Lead form placeholder -->
  </div>
</template>
