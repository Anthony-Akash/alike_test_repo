<script setup lang="ts">
definePageMeta({
  layout: 'account',
  middleware: 'auth',
})

const route = useRoute()
</script>

<template>
  <div>
    <h1>{{ $t('account.orderDetailTitle') }}</h1>
    <p>{{ route.params.id }}</p>
  </div>
</template>
