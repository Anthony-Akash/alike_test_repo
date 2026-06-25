import { TRACKING_EVENT_NAME, EventCategory, EventAction, type TrackingPayload } from '~/utils/tracking/events'

export interface Social {
  label: string
  href: string
  icon: 'instagram' | 'facebook' | 'tripadvisor' | 'x' | 'youtube'
}

/**
 * Composable that exposes named, typed event-tracking helpers wrapping
 * `window.utag.link`. All calls are SSG/SSR-safe – they no-op on the server.
 *
 * ─ How to add a new tracking event ───────────────────────────────────────
 * 1. Ensure the correct EventCategory / EventAction value exists in
 *    utils/tracking/events.ts (add one if not).
 * 2. Add a new function below following the same pattern.
 * 3. Export it in the return object.
 * ──────────────────────────────────────────────────────────────────────────
 */
export function useTracking() {
  /**
   * Internal dispatcher. Guards against SSR and a missing utag library.
   * All public helpers call this.\
   */
  function fire(payload: TrackingPayload): void {
    if (!import.meta.client) return
    window.utag?.link(payload)
  }

  // ── FAQ ─────────────────────────────────────────────────────────────────

  /**
   * Fired when a FAQ accordion item is expanded or collapsed.
   * @param questionLabel - The visible question text.
   * @param action        - 'Expand' or 'Collapse'.
   */
  function trackFaqAccordion(questionLabel: string, action: 'Expand' | 'Collapse'): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.AccordionClick,
      event_lab: `${questionLabel} : ${action}`,
    })
  }

  /**
   * Fired when the "Offer Terms" button / dialog trigger is clicked.
   */
  function trackFaqOfferTerms(): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.FaqButtonClick,
      event_lab: 'Offer Terms',
    })
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  /**
   * Fired when the DTCM / Visit Dubai logo in the header is clicked.
   * @param label - Human-readable label (e.g. 'DTCM Logo') or destination path.
   */
  function trackDtcmLogoClick(label: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Navigations,
      event_act: EventAction.TopNavigation,
      event_lab: label,
    })
  }

  // ── Hero ────────────────────────────────────────────────────────────────

  /**
   * Fired when the primary CTA button in the hero section is clicked.
   * @param sectionTitle - Page / section title (e.g. "The Great Online Sale 2026").
   * @param ctaLabel     - Button label text (e.g. "Register Now").
   */
  function trackHeroCta(sectionTitle: string, ctaLabel: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.HeroPrimary,
      event_lab: `${sectionTitle} : ${ctaLabel}`,
    })
  }

  // ── Social ──────────────────────────────────────────────────────────────

  /** Maps internal icon keys → analytics-friendly platform names. */
  const SOCIAL_LABELS: Record<Social['icon'], string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    x: 'Twitter',
    tripadvisor: 'Tripadvisor',
  }

  /**
   * Fired when a social-media icon in the footer is clicked.
   * @param icon - The icon key from the Social type.
   */
  function trackSocialFollow(icon: Social['icon']): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Social,
      event_act: EventAction.FollowUs,
      event_lab: SOCIAL_LABELS[icon],
    })
  }

  // ── Sign-up Form ────────────────────────────────────────────────────────

  /** Maps form field names → human-readable analytics labels. */
  const FORM_FIELD_LABELS: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    terms1: 'Consent',
    terms2: 'Consent',
  }

  const trackedFields = new Set<string>()
  /**
   * Fired when a user focuses / selects a sign-up form field.
   * @param fieldName - The reactive state key for the field.
   */
  function trackFormFieldFocus(fieldName: string): void {
    const label = FORM_FIELD_LABELS[fieldName]
    if (!label) return
    if (trackedFields.has(fieldName)) return

    trackedFields.add(fieldName)
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.FormSignUp,
      event_lab: `Form Field Selection : ${label}`,
    })
  }

  /**
   * Fired when the sign-up form submit button is clicked.
   */
  function trackFormSubmit(): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.FormSignUp,
      event_lab: 'Submit Form : Get Code and Enter to Win',
    })
  }

  function trackCardClick(action: string, offerTitle: string, categoryTitle: string, isSearch: boolean = false): void {
    const stripHTML = (str: string) => str.replace(/<[^>]+>/g, '')
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: !isSearch ? `${EventAction.ShoppingExperience} : ${stripHTML(categoryTitle)}` : EventAction.SearchItems,
      event_lab: `${action} : ${stripHTML(offerTitle)}`,
    })
  }

  function trackBookNowModalClick(offerTitle: string): void {
    const stripHTML = (str: string) => str.replace(/<[^>]+>/g, '')
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.OfferDetail,
      event_lab: `Book Now : ${stripHTML(offerTitle)}`,
    })
  }

  function trackCategoryClick(categoryTitle: string): void {
    const stripHTML = (str: string) => str.replace(/<[^>]+>/g, '')
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: `${EventAction.TabsHorizontal} : ${stripHTML(categoryTitle)}`,
      event_lab: `${stripHTML(categoryTitle)}`,
    })
  }

  function trackWheelCtaClick(categoryTitle: string): void {
    const stripHTML = (str: string) => str.replace(/<[^>]+>/g, '')
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.SpinTheWheel,
      event_lab: `${stripHTML(categoryTitle)}`,
    })
  }

  function trackMasterSearch(searchTerm: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: 'The best online shopping experience : Explore deals in Dubai',
      event_lab: `Search : ${searchTerm}`,
    })
  }

  function trackMasterSearchCategory(category: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: 'The best online shopping experience : Explore deals in Dubai',
      event_lab: `Sale Type : ${category}`,
    })
  }

  function trackMasterSearchSuggestion(searchTerm: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: 'The best online shopping experience : Explore deals in Dubai',
      event_lab: `Suggested Search : ${searchTerm}`,
    })
  }

  function trackHeaderSelect(label: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Navigations,
      event_act: EventAction.TopNavigation,
      event_lab: label.toLowerCase(),
    })
  }

  function trackHeaderNestedLink(topNavName: string, buttonName: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Navigations,
      event_act: EventAction.SubNavigation,
      event_lab: `${topNavName.toLowerCase()}: ${buttonName.toLowerCase()}`,
    })
  }

  function trackHeroBannerCta(bannerName: string, buttonName: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.CtaClick,
      event_lab: `${bannerName.toLowerCase()} : ${buttonName.toLowerCase()}`,
    })
  }

  function trackCategoryNavClick(buttonName: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.CategorySelection,
      event_lab: buttonName.toLowerCase(),
    })
  }

  function trackDealCardCta(dealCardName: string, buttonName: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.CtaClick,
      event_lab: `${dealCardName.toLowerCase()} : ${buttonName.toLowerCase()}`,
    })
  }

  function trackDealsSectionDiscoverMore(sectionName: string, buttonName: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.CtaClick,
      event_lab: `${sectionName.toLowerCase()} : ${buttonName.toLowerCase()}`,
    })
  }

  function trackPassHighlightCta(sectionName: string, buttonName: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.CtaClick,
      event_lab: `${sectionName.toLowerCase()} : ${buttonName.toLowerCase()}`,
    })
  }

  function trackExploreSearch(searchCategory: string, searchTerm: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Modules,
      event_act: EventAction.SearchCtaClick,
      event_lab: `${searchCategory.toLowerCase()} : ${searchTerm.toLowerCase()}`,
    })
  }

  function trackFooterLinksClick(footerSection: string, buttonName: string): void {
    fire({
      event_name: TRACKING_EVENT_NAME,
      event_cat: EventCategory.Navigations,
      event_act: EventAction.FooterNavigation,
      event_lab: `${footerSection.toLowerCase()} : ${buttonName.toLowerCase()}`,
    })
  }

  return {
    trackFaqAccordion,
    trackFaqOfferTerms,
    trackDtcmLogoClick,
    trackHeroCta,
    trackSocialFollow,
    trackFormFieldFocus,
    trackFormSubmit,
    trackCardClick,
    trackBookNowModalClick,
    trackCategoryClick,
    trackWheelCtaClick,
    trackMasterSearch,
    trackMasterSearchCategory,
    trackMasterSearchSuggestion,
    trackHeaderSelect,
    trackHeaderNestedLink,
    trackHeroBannerCta,
    trackCategoryNavClick,
    trackDealCardCta,
    trackDealsSectionDiscoverMore,
    trackPassHighlightCta,
    trackExploreSearch,
    trackFooterLinksClick,
  }
}
