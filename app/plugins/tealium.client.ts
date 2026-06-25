/**
 * Tealium tag manager – client-only plugin.
 * Loads the utag.js library according to the environment configured in
 * runtimeConfig.public.tealiumEnv ('dev' | 'prod').
 *
 * To add a new environment mapping just extend the UTAG_URLS map below.
 */

const UTAG_BASE = 'https://tags.tiqcdn.com/utag/dtcm/vd.com'

const UTAG_URLS: Record<string, string> = {
  dev: `${UTAG_BASE}/dev/utag.js`,
  uat: `${UTAG_BASE}/uat/utag.js`,
  prod: `${UTAG_BASE}/prod/utag.js`,
}

export default defineNuxtPlugin(() => {
  const { public: publicConfig } = useRuntimeConfig()
  const env = (publicConfig.tealiumEnv as string) || 'dev'
  const src = UTAG_URLS[env] ?? UTAG_URLS.dev!

  const script = document.createElement('script')
  script.src = src
  script.type = 'text/javascript'
  script.async = true

  const firstScript = document.getElementsByTagName('script')[0]
  firstScript?.parentNode?.insertBefore(script, firstScript)
})
