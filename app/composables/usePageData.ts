import type { Ref } from 'vue'
import type { VddPage, VddSection } from '~/types/directus'
import { getMediaFields } from '~/utils/directus'

/**
 * usePageData — Fetch a CMS page from vdd_pages by its URL path.
 *
 * The page record contains its ordered sections via O2M (vdd_sections.vdd_pages_id).
 * Sections are sorted by their `sort` field and locale-filtered.
 *
 * Usage in [...slug].vue:
 *   const path = computed(() => '/' + (route.params.slug as string[])?.join('/') || '/')
 *   const { page, sections, pending, error } = usePageData(path)
 */
export function usePageData(pagePath: string | Ref<string>) {
  const { getItems } = useDirectusItems()
  const { locale } = useI18n()

  const path = isRef(pagePath) ? pagePath : ref(pagePath)

  const cacheKey = computed(() => `page-${path.value}-${locale.value}`)

  const { data: pages, pending, error } = useAsyncData<VddPage[]>(
    () => cacheKey.value,
    () => getItems<VddPage>({
      collection: 'vdd_pages',
      params: {
        fields: [
          'id',
          'path',
          'title',
          'layout',
          ...getMediaFields('og_image'),
          'translations.*',
          'sections.*',
          'sections.translations.*',
        ],
        filter: {
          path: { _eq: path.value },
          status: { _eq: 'published' },
        },
        limit: 1,
        deep: {
          translations: {
            _filter: { languages_id: { code: { _eq: locale.value } } },
          },
          sections: {
            _filter: { status: { _eq: 'published' } },
            _sort: ['sort'],
            translations: {
              _filter: { languages_id: { code: { _eq: locale.value } } },
            },
          },
        },
      },
    }),
    { watch: [path, locale] },
  )

  const page = computed(() => pages.value?.[0] ?? null)

  const sections = computed<VddSection[]>(() => {
    if (!page.value?.sections?.length) return []
    return [...page.value.sections].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  })

  return { page, sections, pending, error }
}
