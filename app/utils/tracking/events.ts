/**
 * Central event-tracking definitions.
 *
 * ─ How to add a new event ─────────────────────────────────────────────────
 * 1. Add a new key + value to EventCategory and/or EventAction as needed.
 * 2. Add a new typed helper function to useTracking.ts.
 * 3. Call the helper in the relevant component.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const TRACKING_EVENT_NAME = 'eventTracker' as const

export const EventCategory = {
  Modules: 'Modules',
  Navigations: 'Navigations',
  Social: 'Social',
} as const

export type EventCategoryValue = (typeof EventCategory)[keyof typeof EventCategory]

export const EventAction = {
  TopNavigation: 'Top Navigation',
  SubNavigation: 'Sub Navigation',
  CtaClick: 'CTA Click',
  CategorySelection: 'Category Selection',
  SearchCtaClick: 'Search : CTA Click',
  AccordionClick: 'Accordion Click',
  FollowUs: 'Follow Us',
  FooterNavigation: 'Footer Navigation',
  // Below are legacy or other tracking ones that might still be used, but keeping just the ones specified in the plan that map directly.
  // Actually, wait, some existing methods use the old ones. I should keep the old ones if I'm not updating ALL of them at once, but since I am re-wiring them, I will provide the new list and legacy ones.
  FaqAccordion: 'FAQ Accordion : Frequently asked questions',
  FaqButtonClick: 'FAQ Button Click : Frequently asked questions',
  HeroPrimary: 'Hero Primary : Generic global header',
  FormSignUp: 'Form : Sign Up to Win and Save',
  OfferDetail: 'Offers and Deals : More Info',
  ShoppingExperience: 'The best online shopping experience',
  TabsHorizontal: 'TabsHorizontal',
  SpinTheWheel: 'Spin : Spin to Win Instant Prizes',
  SearchItems: 'Search Results',
} as const

export type EventActionValue = (typeof EventAction)[keyof typeof EventAction]

/** Shape of every utag.link call made in this application. */
export interface TrackingPayload {
  event_name: typeof TRACKING_EVENT_NAME
  event_cat: EventCategoryValue
  event_act: EventActionValue | string
  event_lab: string
  [key: string]: unknown
}
