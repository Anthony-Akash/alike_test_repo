# Visit Dubai — Deals & Offers

A server-side rendered e-commerce storefront for Dubai tourism products (deals, attractions, passes, holiday packages, hotels) built with **Nuxt 3**.

---

## Tech Stack

| Layer            | Technology                                                                    |
| ---------------- | ----------------------------------------------------------------------------- |
| Framework        | [Nuxt 3](https://nuxt.com) (Nuxt 4 compatibility mode)                        |
| Language         | TypeScript (strict mode)                                                      |
| Styling          | Tailwind CSS v4 (Vite plugin)                                                 |
| UI Components    | [shadcn-vue](https://www.shadcn-vue.com/) via [reka-ui](https://reka-ui.com/) |
| State Management | [Pinia](https://pinia.vuejs.org/)                                             |
| CMS / Backend    | [Directus](https://directus.io/) via `nuxt-directus`                          |
| i18n             | `@nuxtjs/i18n` — English (`en-AE`) & Arabic (`ar-AE`, RTL)                    |
| SEO              | `@nuxtjs/seo`                                                                 |
| Images           | `@nuxt/image` (WebP, quality 70)                                              |
| Fonts            | `@nuxt/fonts`                                                                 |
| Icons            | `@nuxt/icon` + `lucide-vue-next`                                              |
| Forms            | `vee-validate` + `zod`                                                        |
| Security         | `nuxt-security`                                                               |
| Package Manager  | [pnpm](https://pnpm.io/)                                                      |
| Deployment       | AWS Amplify (`NITRO_PRESET=aws-amplify`)                                      |

---

## Project Structure

```
.
├── app/
│   ├── assets/css/         # Tailwind CSS entry point
│   ├── components/         # Auto-imported Vue components (no path prefix)
│   │   ├── account/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── layout/         # LayoutHeader, LayoutFooter
│   │   ├── product/        # attractions, deals, holiday-packages, hotels, passes
│   │   ├── search/
│   │   ├── shared/
│   │   └── ui/             # shadcn-vue primitives (excluded from linting)
│   ├── composables/        # useAuth, useCart, useLeadForm, useProducts, useSearch, useTracking, …
│   ├── layouts/            # default, auth, account, checkout
│   ├── middleware/         # auth.ts route guard
│   ├── pages/              # File-based routing (see Routes below)
│   ├── stores/             # Pinia stores: auth, cart, checkout, products, search, ui, wishlist
│   ├── types/              # Shared TypeScript types
│   └── utils/
├── i18n/locales/           # en.json, ar.json
├── public/                 # Static assets (fonts, images, robots)
├── scripts/               # Utility scripts (e.g. check-unused-assets)
├── server/
│   └── api/                # Nitro API routes: auth, cart, checkout, cms, leads, orders, products
├── tests/
│   ├── components/         # Component tests
│   ├── e2e/                # Playwright end-to-end tests
│   └── unit/               # Vitest unit tests (composables, stores, utils)
├── amplify.yml             # AWS Amplify CI/CD build config
├── nuxt.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

### Routes

| Path                          | Rendering | Description                      |
| ----------------------------- | --------- | -------------------------------- |
| `/`                           | SWR (1h)  | Home page                        |
| `/attractions`                | SWR (1h)  | Attractions listing              |
| `/attractions/[slug]`         | SWR (1h)  | Attraction detail                |
| `/passes`                     | SWR (1h)  | Passes listing                   |
| `/passes/[slug]`              | SWR (1h)  | Passes detail                    |
| `/holiday-packages`           | SWR (1h)  | Holiday packages listing         |
| `/holiday-packages/[slug]`    | SWR (1h)  | Holiday packages detail          |
| `/hotels`                     | SWR (1h)  | Hotels listing                   |
| `/hotels/[slug]`              | SWR (1h)  | Hotel detail                     |
| `/[slug]`                     | SWR (1h)  | Catch-all (deals, categories)    |
| `/cart`                       | SSR       | Shopping cart                    |
| `/search`                     | SSR       | Search results                   |
| `/faq`                        | SSR       | FAQ                              |
| `/auth/*`                     | SSR       | Login, Register, Forgot password |
| `/account/**`                 | CSR       | User account, orders, wishlist   |
| `/checkout/**`                | CSR       | Checkout flow, success, failed   |

---

## Setup

Requires **Node.js 22** and **pnpm** (`packageManager: pnpm@10.27.0`).

```bash
pnpm install
```

### Environment Variables

The app uses environment-specific `.env.*` files. Copy the example and adjust per environment:

```bash
cp .env.example .env.dev      # Development
cp .env.example .env.uat      # UAT
cp .env.example .env.production  # Production
```

| Variable                        | Description                                        |
| ------------------------------- | -------------------------------------------------- |
| `NUXT_SECRET_NAME`              | AWS Secrets Manager secret name prefix             |
| `NUXT_ENV_NAME`                 | Environment name (`dev`, `uat`, `prod`)            |
| `NUXT_DIRECTUS_URL`             | URL of the Directus instance                       |
| `NUXT_PUBLIC_DIRECTUS_ASSETS_URL` | URL for Directus assets (images, etc.)          |
| `NUXT_PUBLIC_CDN_LINK`          | CDN base URL for optimized images                  |
| `NUXT_PUBLIC_GQL_HOST`          | GraphQL API endpoint URL                           |
| `NUXT_PUBLIC_TEALIUM_ENV`       | Tealium environment (`dev`, `uat`, `prod`)         |
| `NUXT_PUBLIC_SITE_CRAWL`        | Allow site crawling (`true` / `false`)             |

> Secrets (`NUXT_API_SECRET`, `NUXT_JWT_SECRET`, `NUXT_DIRECTUS_TOKEN`, etc.) are pulled from **AWS Secrets Manager** at build time (see `amplify.yml`). For local development you can set them directly in your `.env.*` file.

---

## Development

```bash
pnpm dev               # Uses .env.dev
pnpm dev:uat           # Uses .env.uat
pnpm dev:production    # Uses .env.production
```

Nuxt DevTools are enabled by default.

---

## Production Build

```bash
pnpm build               # Build for dev (.env.dev, Nitro preset=node)
pnpm build:uat           # Build for UAT (.env.uat)
pnpm build:production    # Build for production (.env.production)
pnpm preview             # Preview production build locally (.env.production)
```

### AWS Amplify Deployment

The `amplify.yml` build pulls secrets from **AWS Secrets Manager** and builds with `NITRO_PRESET=aws-amplify`:

1. Set `NUXT_SECRET_NAME` and `NUXT_ENV_NAME` as environment variables in the Amplify Console per branch.
2. Store all secrets in Secrets Manager under the key `{NUXT_SECRET_NAME}/{NUXT_ENV_NAME}` as a JSON key-value map.
3. Output artifacts are in `.amplify-hosting/`.

---

## Testing

```bash
pnpm test              # Vitest (watch mode)
pnpm test:run          # Vitest (single run)
pnpm test:coverage     # Vitest with v8 coverage (70% threshold)
pnpm test:e2e          # Playwright e2e (Chromium + iPhone 14)
pnpm test:e2e:ui       # Playwright with interactive UI

E2E tests run against `http://localhost:3000` (dev server auto-started via webServer).

---

## Code Quality

```bash
pnpm lint          # ESLint
pnpm lint:fix      # ESLint with auto-fix
pnpm typecheck     # Nuxt type-check (vue-tsc)
pnpm knip          # Find unused exports / dependencies
pnpm audit         # pnpm security audit
pnpm check:assets  # Find unused static assets
```

**ESLint** uses `@nuxt/eslint` + `@stylistic/eslint-plugin`. Rules enforce single quotes, no semicolons, 2-space indent, and `<script setup>` component API style.

**Git hooks** (Husky):

- `pre-commit` — runs `lint-staged` (ESLint fix on staged `.ts`/`.vue` files)
- `commit-msg` — enforces [Conventional Commits](https://www.conventionalcommits.org/) via commitlint

**Commit types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
