<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const statusCode = computed(() => props.error.statusCode || 0)

const isNotFound = computed(() => statusCode.value === 404)
const isUnavailable = computed(() => [502, 503, 504].includes(statusCode.value))
const isNetwork = computed(() => statusCode.value === 0 || !props.error.statusCode)

const title = computed(() => {
  if (isNotFound.value) return t('errors.notFound')
  if (isNetwork.value) return t('errors.network')
  if (isUnavailable.value) return t('errors.serverError')
  return t('common.error')
})

const description = computed(() => {
  if (isNotFound.value) return t('errors.notFoundDescription')
  if (isNetwork.value) return t('errors.networkDescription')
  if (isUnavailable.value) return t('errors.serverErrorDescription')
  return t('errors.generic')
})

const showRetry = computed(() => !isNotFound.value)

useHead(computed(() => ({
  title: `${statusCode.value || 'Error'} — ${title.value}`,
})))

function goHome() {
  clearError({ redirect: '/' })
}

function retry() {
  clearError()
  if (import.meta.client) {
    window.location.reload()
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="relative flex min-h-[calc(100dvh-200px)] flex-col items-center justify-center overflow-hidden bg-surface-dim px-5 py-10 sm:px-8 sm:py-16 md:px-12 lg:px-16">
      <div
        class="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          v-for="n in 5"
          :key="n"
          class="floating-circle"
        />
      </div>

      <div class="error-card relative z-10 mx-auto flex w-full max-w-[540px] flex-col items-center rounded-lg bg-background px-6 py-10 text-center shadow-elevation-3 sm:max-w-[600px] sm:px-10 sm:py-14 md:max-w-[680px] md:rounded-xl md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div class="relative flex size-20 items-center justify-center sm:size-24 md:size-28 lg:size-32">
          <div class="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
          <Icon
            name="nrk:media-404-notfound"
            class="size-20! text-primary-vd"
          />
        </div>

        <h1 class="error-fade-in mt-5 text-[clamp(3.5rem,16vw,7.5rem)] leading-none font-bold tracking-tight text-primary select-none sm:mt-7 md:mt-8">
          <span class="relative">
            {{ statusCode || '—' }}
            <span
              class="error-glow-pulse absolute inset-0 opacity-20 blur-[40px] sm:blur-[56px] md:blur-[64px]"
              aria-hidden="true"
            >{{ statusCode || '—' }}</span>
          </span>
        </h1>

        <h2 class="mt-3 text-h6 font-medium text-text-title sm:mt-5 sm:text-h5 md:mt-6 md:text-h4 lg:text-h2">
          {{ title }}
        </h2>

        <p class="mx-auto mt-2 w-full max-w-[460px] text-caption leading-relaxed text-on-surface-variant sm:mt-3 sm:text-body sm:leading-relaxed md:mt-4 md:text-h6 md:leading-relaxed">
          {{ description }}
        </p>

        <div class="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-4 md:mt-10">
          <Button
            variant="primary-vd"
            size="lg"
            class="h-11 w-full rounded-md px-6 text-body text-white sm:h-12 sm:w-auto sm:px-8"
            @click="goHome"
          >
            <svg
              class="size-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12L12 3l9 9" />
              <path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" />
            </svg>
            {{ t('nav.home') }}
          </Button>
          <Button
            v-if="showRetry"
            variant="outline"
            size="lg"
            class="h-11 w-full rounded-md px-6 text-body sm:h-12 sm:w-auto sm:px-8"
            @click="retry"
          >
            <svg
              class="size-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            {{ t('common.retry') }}
          </Button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error-card {
  animation: card-enter 0.5s ease-out both;
}

.floating-circle {
  position: absolute;
  border-radius: 9999px;
  opacity: 0.15;
  animation: float linear infinite;
  width: var(--size);
  height: var(--size);
  left: var(--left);
  animation-delay: var(--delay);
  animation-duration: var(--duration);
  background: var(--circle-color);
}

.floating-circle:nth-child(1) {
  --size: min(120px, 25vw);
  --left: 5%;
  --delay: 0s;
  --duration: 25s;
  --circle-color: var(--primary);
  top: 15%;
}

.floating-circle:nth-child(2) {
  --size: min(80px, 18vw);
  --left: 85%;
  --delay: 2s;
  --duration: 20s;
  --circle-color: var(--primary-vd);
  top: 25%;
}

.floating-circle:nth-child(3) {
  --size: min(60px, 14vw);
  --left: 20%;
  --delay: 4s;
  --duration: 30s;
  --circle-color: var(--primary);
  top: 70%;
}

.floating-circle:nth-child(4) {
  --size: min(100px, 22vw);
  --left: 75%;
  --delay: 1s;
  --duration: 22s;
  --circle-color: var(--primary-vd);
  top: 60%;
}

.floating-circle:nth-child(5) {
  --size: min(50px, 12vw);
  --left: 50%;
  --delay: 3s;
  --duration: 18s;
  --circle-color: var(--icon-orange);
  top: 85%;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0.12;
  }
  50% {
    transform: translateY(-40px) rotate(180deg) scale(1.08);
    opacity: 0.2;
  }
  100% {
    transform: translateY(0) rotate(360deg) scale(1);
    opacity: 0.12;
  }
}

.error-fade-in {
  animation: code-fade-in 0.6s ease-out both;
}

.error-glow-pulse {
  animation: code-glow-pulse 3s ease-in-out infinite;
}

@keyframes code-fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes code-glow-pulse {
  0%, 100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(1.05);
  }
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-circle,
  .error-fade-in,
  .error-glow-pulse,
  .error-card {
    animation: none;
  }
}
</style>
