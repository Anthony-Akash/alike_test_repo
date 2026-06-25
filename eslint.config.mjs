// @ts-check
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'
// @ts-ignore
import tailwindcss from 'eslint-plugin-tailwindcss'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default withNuxt(
  {
    ignores: [
      '.amplify-hosting/**',
      '.output/**',
      'node_modules/**',
      'app/components/ui/**',
    ],
  },

  // Tailwind CSS linting — class ordering, no contradictions, etc.
  ...tailwindcss.configs['flat/recommended'],

  {
    settings: {
      tailwindcss: {
        // Absolute path required for worker thread resolution in Tailwind v4
        config: resolve(__dirname, 'app/assets/css/tailwind.css'),
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // ── Stylistic / formatting ──
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/max-len': [
        'warn',
        { code: 120, ignoreUrls: true, ignoreStrings: true },
      ],

      // ── Tailwind-specific rules ──
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',

      // ── TypeScript ──
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',

      // ── Vue best practices ──
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/define-macros-order': [
        'error',
        { order: ['defineProps', 'defineEmits'] },
      ],
      'vue/no-v-html': 'warn',
      'vue/no-unused-refs': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/prefer-true-attribute-shorthand': 'warn',

      // ── General quality ──
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'link-checker/valid-route': 'off',
      'link-checker/valid-sitemap-link': 'off',
    },
  },
)
