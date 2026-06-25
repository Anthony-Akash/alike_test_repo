<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Social } from '~/composables/useTracking'

const { t, locale } = useI18n()
const { trackSocialFollow, trackFooterLinksClick } = useTracking()

const SOCIAL_ICON_MAP: Record<string, Social['icon']> = {
  Facebook: 'facebook',
  Instagram: 'instagram',
  Tripadvisor: 'tripadvisor',
  X: 'x',
  YouTube: 'youtube',
}

function handleSocialClick(label: string) {
  const icon = SOCIAL_ICON_MAP[label]
  if (icon) trackSocialFollow(icon)
}

function handleFooterLinkClick(sectionHeading: string, linkLabel: string) {
  trackFooterLinksClick(sectionHeading, linkLabel)
}

const VD_BASE = 'https://www.visitdubai.com'

const lastUpdated = useState('footer-last-updated', () => {
  const today = new Date()
  return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
})

const openAccordion = ref<number | null>(null)

const SCROLL_THRESHOLD_MOBILE = 400
const SCROLL_THRESHOLD_DESKTOP = 600

const showScrollTop = ref(false)
const bottomBarRef = ref<HTMLElement | null>(null)
const linksContainerRef = ref<HTMLElement | null>(null)
const scrollTopButtonRef = ref<HTMLElement | null>(null)

let isScrolling = false

function updateButtonBottom() {
  const isLg = window.innerWidth >= 1024
  const targetRef = isLg ? bottomBarRef.value : (linksContainerRef.value || bottomBarRef.value)
  if (!targetRef) {
    if (scrollTopButtonRef.value) scrollTopButtonRef.value.style.bottom = ''
    return
  }
  const rect = targetRef.getBoundingClientRect()
  const defaultBottom = isLg ? 88 : 80 // lg:bottom-22 = 88px, bottom-20 = 80px
  const required = window.innerHeight - rect.top + 8

  if (scrollTopButtonRef.value) {
    scrollTopButtonRef.value.style.bottom = required > defaultBottom ? `${required}px` : ''
  }
}

function onScroll() {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      const threshold = window.innerWidth >= 1024 ? SCROLL_THRESHOLD_DESKTOP : SCROLL_THRESHOLD_MOBILE
      showScrollTop.value = window.scrollY > threshold
      updateButtonBottom()
      isScrolling = false
    })
    isScrolling = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function toggleAccordion(index: number) {
  openAccordion.value = openAccordion.value === index ? null : index
}

function scrollToTop() {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function showCookiePreferences() {
  if (import.meta.client) {
    const w = window as unknown as { showConsentPreferencesPopup?: () => void }
    if (typeof w.showConsentPreferencesPopup === 'function') {
      w.showConsentPreferencesPopup()
    }
  }
}

function externalUrl(path: string): string {
  return `${VD_BASE}/${locale.value}${path}`
}

function linkHref(to: string): string {
  if (to.startsWith('http')) {
    return to.replace('{locale}', locale.value)
  }
  return externalUrl(to)
}

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com/visitdubai/', icon: 'typcn:social-facebook' },
  { label: 'Instagram', href: 'https://www.instagram.com/visit.dubai', icon: 'lucide:instagram' },
  {
    label: 'Tripadvisor',
    href: 'https://www.tripadvisor.com/Tourism-g295424-Dubai_Emirate_of_Dubai-Vacations.html',
    icon: 'streamline-ultimate:tripadvisor-logo',
  },
  { label: 'X', href: 'https://x.com/visitdubai', icon: 'ri:twitter-x-fill' },
  { label: 'YouTube', href: 'https://www.youtube.com/visitdubai', icon: 'mdi:youtube' },
]

const linkGroups = [
  {
    headingKey: 'footer.popularLinks',
    links: [
      { labelKey: 'footer.exploreDubai', to: '/explore-dubai' },
      { labelKey: 'footer.thingsToDo', to: '/things-to-do' },
      { labelKey: 'footer.whatsOn', to: '/festivals-and-events' },
      { labelKey: 'footer.articles', to: '/articles' },
      { labelKey: 'footer.placesToVisit', to: '/places-to-visit' },
    ],
  },
  {
    headingKey: 'footer.helpfulInformation',
    links: [
      { labelKey: 'footer.planYourTrip', to: '/plan-your-trip' },
      { labelKey: 'footer.visaGuide', to: '/plan-your-trip/visa-information' },
      { labelKey: 'footer.contactUs', to: '/contact-us' },
      { labelKey: 'footer.faq', to: '/faqs' },
      { labelKey: 'footer.travelAdvisory', to: '/travel-advisory' },
    ],
  },
  {
    headingKey: 'footer.relatedSites',
    links: [
      { labelKey: 'footer.investInDubai', to: 'https://www.investindubai.gov.ae/{locale}/' },
      { labelKey: 'footer.dubaiDET', to: 'https://www.dubaidet.gov.ae/{locale}/' },
      { labelKey: 'footer.consumerRights', to: 'https://consumerrights.gov.ae/{locale}/' },
      { labelKey: 'footer.dubaiFoundersHQ', to: 'https://www.dubaifoundershq.com/{locale}/' },
      { labelKey: 'footer.travelTrade', to: 'https://vd.visitdubai.com/{locale}/travel-trade' },
      { labelKey: 'footer.retireInDubai', to: '/retire-in-dubai' },
      { labelKey: 'footer.studyDubai', to: '/study-dubai' },
      { labelKey: 'footer.mice', to: '/mice' },
    ],
  },
]

const bottomLinks = [
  { labelKey: 'footer.termsOfUse', to: '/terms-of-use' },
  { labelKey: 'footer.privacyNotice', to: '/privacy-notice' },
  { labelKey: 'footer.cookieNotice', to: '/cookie-policy' },
  { labelKey: 'footer.cookiePreferenceCentre', action: 'cookiePreferences' },
  { labelKey: 'footer.sitemap', to: '/sitemap' },
]
</script>

<template>
  <footer class="relative bg-surface">
    <!-- ── Main footer body ── -->
    <div class="w-full border-t border-outline bg-surface">
      <div class="container-main px-6 pt-10 pb-12 lg:px-6 xl:px-6 2xl:px-6">
        <!-- ═══════════════════════════════════════════════
             TOP SECTION: logo + social + links
        ════════════════════════════════════════════════ -->
        <div class="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-16 xl:gap-40">
          <!-- Left: logo + description + social -->
          <div class="flex shrink-0 flex-col gap-8 lg:w-110 xl:w-120">
            <div class="flex items-center gap-3 md:gap-4">
              <!-- Visit Dubai logo -->
              <a
                :href="`${VD_BASE}/${locale}/`"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('header.visitDubai')"
                class="border-r border-outline pr-3 md:pr-4"
              >
                <img
                  src="/icons/dubai.svg"
                  :alt="t('header.visitDubai')"
                  class="h-11 w-auto max-w-20"
                  width="80"
                  height="44"
                >
              </a>
              <div class="flex flex-col items-start">
                <p class="text-[13px] text-text-title uppercase">
                  {{ $t("footer.poweredBy") }}
                </p>
                <a
                  href="https://alike.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/icons/alike.svg"
                    alt="Alike"
                    class="h-4 w-auto"
                    width="60"
                    height="16"
                  >
                  <div ref="linksContainerRef" />
                </a>
              </div>
            </div>

            <!-- Description (desktop only) -->
            <p class="hidden text-body leading-body text-on-surface-variant lg:block">
              {{ t('footer.description') }}
            </p>

            <!-- Social icons -->
            <div class="flex w-full items-center justify-between lg:justify-start lg:gap-6">
              <a
                v-for="s in socials"
                :key="s.label"
                :href="s.href"
                :aria-label="t('footer.socialFollowAriaLabel', { platform: s.label })"
                target="_blank"
                rel="noopener noreferrer"
                class="flex size-6 shrink-0 items-center justify-center text-on-surface-variant transition-colors hover:text-on-surface lg:size-7"
                @click="handleSocialClick(s.label)"
              >
                <Icon
                  :name="s.icon"
                  class="size-7!"
                />
              </a>
            </div>
          </div>

          <!-- Right: link columns (desktop) / accordions (mobile) -->
          <div class="flex flex-1 flex-col justify-end lg:ml-22 lg:flex-row lg:gap-18">
            <div
              v-for="(group, i) in linkGroups"
              :key="i"
              class="flex flex-col"
            >
              <!-- Desktop column -->
              <div
                class="hidden flex-col gap-6 lg:flex lg:max-w-48"
                :class="i === 1 ? 'lg:ml-8' : ''"
              >
                <p class="text-body leading-body font-medium text-on-surface">
                  {{ t(group.headingKey) }}
                </p>
                <div class="flex flex-col gap-3">
                  <a
                    v-for="link in group.links"
                    :key="link.labelKey"
                    :href="linkHref(link.to)"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`${t(link.labelKey)} | ${t('footer.opensInNewWindow')}`"
                    class="text-body leading-body text-on-surface-variant transition-colors hover:text-on-surface"
                    @click="handleFooterLinkClick(t(group.headingKey), t(link.labelKey))"
                  >
                    {{ t(link.labelKey) }}
                  </a>
                </div>
              </div>

              <!-- Mobile accordion -->
              <div class="border-b border-outline lg:hidden">
                <button
                  class="flex w-full items-center justify-between py-4 text-body leading-body font-medium! text-on-surface"
                  @click="toggleAccordion(i)"
                >
                  {{ t(group.headingKey) }}
                  <Icon
                    name="mdi:chevron-down"
                    class="size-6! shrink-0 text-on-surface-variant transition-transform duration-200"
                    :class="{ 'rotate-180': openAccordion === i }"
                  />
                </button>

                <div
                  v-show="openAccordion === i"
                  class="grid grid-cols-2 gap-3 pb-4"
                >
                  <a
                    v-for="link in group.links"
                    :key="link.labelKey"
                    :href="linkHref(link.to)"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="`${t(link.labelKey)} | ${t('footer.opensInNewWindow')}`"
                    class="text-body leading-body text-on-surface-variant"
                    @click="handleFooterLinkClick(t(group.headingKey), t(link.labelKey))"
                  >
                    {{ t(link.labelKey) }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════════════════
             BOTTOM BAR: legal links + copyright
        ════════════════════════════════════════════════ -->
        <div
          ref="bottomBarRef"
          class="mt-0 flex flex-col gap-6 border-t border-outline pt-4 lg:mt-12 lg:flex-row lg:items-end lg:justify-between lg:pt-6"
        >
          <!-- ── Scroll-to-top floating button ── -->
          <Transition name="scroll-top">
            <button
              v-show="showScrollTop"
              ref="scrollTopButtonRef"
              class="group fixed end-5 bottom-20 z-50 flex size-12 items-center justify-center rounded-full bg-surface text-primary-vd shadow-elevation-3 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary-vd hover:text-white lg:inset-e-20 lg:bottom-20 lg:size-14"
              :aria-label="t('footer.backToTop')"
              @click="scrollToTop"
            >
              <ArrowIcon
                class="-rotate-90"
              />
            </button>
          </Transition>
          <!-- Left: links + copyright -->
          <div class="flex flex-col gap-4">
            <!-- Desktop: single horizontal row -->
            <div class="hidden flex-wrap items-center gap-8 lg:flex">
              <template
                v-for="link in bottomLinks"
                :key="link.labelKey"
              >
                <button
                  v-if="link.action"
                  class="text-caption leading-caption whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface"
                  @click="handleFooterLinkClick('legal links', t(link.labelKey)); showCookiePreferences()"
                >
                  {{ t(link.labelKey) }}
                </button>
                <a
                  v-else-if="link.to"
                  :href="linkHref(link.to)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-caption leading-caption whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface"
                  @click="handleFooterLinkClick('legal links', t(link.labelKey))"
                >
                  {{ t(link.labelKey) }}
                </a>
              </template>
            </div>

            <!-- Mobile: 2-column grid -->
            <div class="grid grid-cols-2 gap-x-4 gap-y-4 lg:hidden">
              <template
                v-for="link in bottomLinks"
                :key="link.labelKey"
              >
                <button
                  v-if="link.action"
                  class="text-start leading-caption text-on-surface-variant"
                  @click="handleFooterLinkClick('legal links', t(link.labelKey)); showCookiePreferences()"
                >
                  {{ t(link.labelKey) }}
                </button>
                <a
                  v-else-if="link.to"
                  :href="linkHref(link.to)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="leading-caption text-on-surface-variant"
                  @click="handleFooterLinkClick('legal links', t(link.labelKey))"
                >
                  {{ t(link.labelKey) }}
                </a>
              </template>
            </div>

            <!-- Copyright -->
            <p class="text-caption leading-caption text-on-surface-variant">
              {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
            </p>
          </div>

          <!-- Right: site last updated -->
          <p class="text-caption leading-caption text-on-surface-variant lg:shrink-0">
            {{ t('footer.siteLastUpdated') }} [{{ lastUpdated }}]
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
