<script setup lang="ts"></script>

<template>
  <div class="min-h-screen">
    <LayoutHeader />
    <div class="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside class="hidden w-64 shrink-0 lg:block">
        <nav class="space-y-2">
          <NuxtLink
            to="/account"
            class="block rounded-md px-3 py-2 hover:bg-muted"
          >
            {{ $t("account.dashboard") }}
          </NuxtLink>
          <NuxtLink
            to="/account/orders"
            class="block rounded-md px-3 py-2 hover:bg-muted"
          >
            {{ $t("account.orders") }}
          </NuxtLink>
          <NuxtLink
            to="/account/wishlist"
            class="block rounded-md px-3 py-2 hover:bg-muted"
          >
            {{ $t("account.wishlist") }}
          </NuxtLink>
        </nav>
      </aside>
      <main class="min-w-0 flex-1">
        <slot />
      </main>
    </div>
    <LayoutFooter />
  </div>
</template>
