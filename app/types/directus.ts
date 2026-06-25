/**
 * Types for the Directus section-driven page architecture
 * Mirrors alike-website's section composition pattern
 */

/** Page record from vdd_pages collection */
export interface VddPage {
  id: number
  status: 'published' | 'draft'
  sort: number
  path: string
  title: string
  layout: 'default' | 'auth' | 'account' | 'checkout'
  og_image: string | import('~/utils/directus').DirectusFile | null
  translations: VddPageTranslation[]
  sections: VddSection[]
}

export interface VddPageTranslation {
  id: number
  vdd_pages_id: number
  languages_id: string
  meta_title: string
  meta_description: string | null
}

/** Section record from vdd_sections collection */
export interface VddSection {
  id: number | string
  status: 'published' | 'draft'
  sort: number
  vdd_pages_id: number | null
  page_slot: string | null
  component: string
  section_id: string | null
  collection_name: string | null
  item_id: string | null
  deal_type_filter: string | null
  card_count: number
  theme: 'light' | 'dark' | 'default' | null
  translations: VddSectionTranslation[]
}

export interface VddSectionTranslation {
  id: number
  vdd_sections_id: number
  languages_id: string
  title: string
  description: string | null
  cta_label: string | null
  cta_url: string | null
}

/** Deal record from vdd_deals collection */
export interface VddDeal {
  id: number
  status: 'published' | 'draft' | 'archived'
  sort: number
  slug: string
  type: 'dining' | 'shopping' | 'attraction' | 'pass' | 'holiday-package' | 'hotel'
  category: VddCategory | string
  is_featured: boolean
  price: string | number | null
  original_price: string | number | null
  discount_percentage: number | null
  sku: string | null
  external_url: string | null
  outclick_label: string | null
  thumbnail: string | null
  images: VddDealImage[]
  tags: VddDealTag[]
  translations: VddDealTranslation[]
  review_rating: number | null
  duration: string | null
  star_rating: string | number | null
  validity_days: number | null
}

export interface VddDealTranslation {
  id: number
  vdd_deals_id: number
  languages_id: string
  name: string
  outclick_label: string | null
  short_description: string | null
  description: string | null
  highlights: string[] | null
  inclusions: string[] | null
  exclusions: string[] | null
  terms_and_conditions: string | null
  meta_title: string | null
  meta_description: string | null
}

export interface VddDealImage {
  id: number
  vdd_deals_id: number
  directus_files_id: string | import('~/utils/directus').DirectusFile
  sort: number
  alt: string | null
}

export interface VddDealTag {
  id: number
  vdd_deals_id: number
  vdd_tags_id: VddTag | number
  sort: number
}

export interface VddNavItem {
  section_id: string
  value: string
  label: string
  icon_name: string
}

/** Category record from vdd_categories */
export interface VddCategory {
  id: string
  slug: string
  deal_type: string
  icon_name: string | null
  icon_image: string | null
  sort: number
  status: 'published' | 'draft'
  translations: VddCategoryTranslation[]
}

export interface VddCategoryTranslation {
  id: number
  vdd_categories_id: number
  languages_id: string
  name: string
  description: string | null
}

/** Tag record from vdd_tags */
export interface VddTag {
  id: number
  slug: string
  color: string | null
  icon: string | null
  translations: VddTagTranslation[]
}

export interface VddTagTranslation {
  id: number
  vdd_tags_id: number
  languages_id: string
  label: string
}

export interface Image {
  id: string
  width: number
  height: number
  title: string | null
  type: string
  filename_disk: string
}

/** Banner record from vdd_banners */
export interface VddBanner {
  id: number
  status: 'published' | 'draft'
  image: Image
  mobile_image: Image
  ar_image: Image | null
  ar_mobile_image: Image | null
  page_slot: string | null
  cta_url: string | null
  sort: number
  translations: VddBannerTranslation[]
}

export interface VddBannerTranslation {
  id: number
  vdd_banners_id: number
  languages_id: string
  title: string
  subtitle: string | null
  description: string | null
  cta_label: string | null
}

/** FAQ record from vdd_faqs */
export interface VddFaq {
  id: number | string
  status: 'published' | 'draft'
  sort: number
  translations: VddFaqTranslation[]
  faq_type: 'dining' | 'shopping' | 'attraction' | 'pass' | 'holiday-package' | 'hotel' | null
}

export interface VddFaqTranslation {
  id: number
  vdd_faqs_id: number
  languages_id: string
  question: string
  answer: string
}

/** Pass highlight record from vdd_pass_highlights */
export interface VddPassHighlight {
  id: number
  status: 'published' | 'draft'
  sort: number
  icon: string | null
  image: string | null
  translations: VddPassHighlightTranslation[]
}

export interface VddPassHighlightTranslation {
  id: number
  vdd_pass_highlights_id: number
  languages_id: string
  title: string
  subtitle: string | null
}

/** Deal modal from vdd_deal_modals */
export interface VddDealModal {
  id: number
  vdd_deals_id: number
  video_url: string | null
  gallery: VddDealModalGallery[]
  specs: VddDealModalSpec[]
  translations: VddDealModalTranslation[]
}

export interface VddDealModalTranslation {
  id: number
  vdd_deal_modals_id: number
  languages_id: string
  title: string
  body: string | null
  cta_label: string | null
  cta_url: string | null
}

export interface VddDealModalGallery {
  id: number
  vdd_deal_modals_id: number
  directus_files_id: string
  sort: number
  alt: string | null
}

export interface VddDealModalSpec {
  id: number
  vdd_deal_modals_id: number
  sort: number
  icon: string
  translations: VddDealModalSpecTranslation[]
}

export interface VddDealModalSpecTranslation {
  id: number
  vdd_deal_modals_specs_id: number
  languages_id: string
  label: string
  value: string
}

/** Settings singleton from vdd_settings */
export interface VddSettings {
  id: number
  site_name: string
  logo: string | null
  logo_dark: string | null
  favicon: string | null
  translations: VddSettingsTranslation[]
}

export interface VddSettingsTranslation {
  id: number
  languages_id: string
  [key: string]: unknown
}
