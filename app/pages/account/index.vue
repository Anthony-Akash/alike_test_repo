<script setup lang="ts">
definePageMeta({
  layout: 'account',
  middleware: 'auth',
})
</script>

<template>
  <div>
    <h1>{{ $t('account.dashboardTitle') }}</h1>
  </div>
</template>
