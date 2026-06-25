<script setup lang="ts">
definePageMeta({
  layout: 'checkout',
  middleware: 'auth',
})
</script>

<template>
  <div>
    <h1>{{ $t('checkout.failedTitle') }}</h1>
  </div>
</template>
