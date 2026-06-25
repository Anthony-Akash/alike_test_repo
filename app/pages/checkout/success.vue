<script setup lang="ts">
definePageMeta({
  layout: 'checkout',
  middleware: 'auth',
})
</script>

<template>
  <div>
    <h1>{{ $t('checkout.successTitle') }}</h1>
  </div>
</template>
