import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: { nuxt: { domEnvironment: 'happy-dom' } },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/composables/**', 'app/stores/**', 'app/utils/**'],
      thresholds: { statements: 70, branches: 70, functions: 70, lines: 70 },
    },
    include: ['tests/**/*.test.ts'],
  },
})
