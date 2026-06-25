/**
 * Directus utility helpers
 * Mirrors alike-website's utils for asset URLs and deep locale filtering
 */
import { BUNNY_CDN_QUALITY, BUNNY_CDN_FORMAT } from '~/utils/cdn'

export interface DirectusFile {
  id: string
  filename_disk: string
  width?: number
  height?: number
  type?: string
  title?: string
}

/**
 * Build a CDN-relative path from a Directus file UUID or file object.
 * Returns e.g. '/uuid.jpg' — for use with NuxtImg's bunny provider,
 * which prepends the CDN baseURL automatically.
 */
export function getAssetPath(file: string | DirectusFile | null | undefined): string {
  if (!file) return ''
  const id = typeof file === 'string' ? file : file.id
  const ext = typeof file !== 'string' && file.filename_disk
    ? '.' + file.filename_disk.split('.').pop()
    : ''
  return `/${id}${ext}`
}

/**
 * Build a full asset URL from a Directus file UUID or file object.
 * Use this for non-NuxtImg contexts (meta tags, window.open, etc.).
 * For NuxtImg, prefer getAssetPath() with the bunny provider.
 */
export function getAssetUrl(file: string | DirectusFile | null | undefined, transforms?: { width?: number, height?: number, quality?: number, format?: string }): string {
  if (!file) return ''
  const { public: config } = useRuntimeConfig()
  const base = config.cdnLink
  const id = typeof file === 'string' ? file : file.id
  const ext = typeof file !== 'string' && file.filename_disk
    ? '.' + file.filename_disk.split('.').pop()
    : ''

  const url = `${base.replace(/\/$/, '')}/${id}${ext}`

  const params: string[] = []
  if (transforms?.width) params.push(`width=${transforms.width}`)
  if (transforms?.height) params.push(`height=${transforms.height}`)
  params.push(`quality=${transforms?.quality ?? BUNNY_CDN_QUALITY}`)
  params.push(`format=${transforms?.format ?? BUNNY_CDN_FORMAT}`)

  return params.length ? `${url}?${params.join('&')}` : url
}

/**
 * Build Directus `deep` filter for locale-filtered translations
 *
 * Alike pattern: each translatable relation needs a deep filter like:
 * { translations: { _filter: { languages_id: { _eq: locale } } } }
 *
 * @param keys - Array of translation relation paths to filter
 *   e.g. ['translations'] or ['translations', 'tags.translations']
 * @param locale - Language code ('en' | 'ar')
 */
export function getDeepLocaleFilter(keys: string[], locale: string): Record<string, unknown> {
  const deep: Record<string, unknown> = {}

  for (const key of keys) {
    const parts = key.split('.')
    let current = deep

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!
      if (i === parts.length - 1) {
        // Leaf node — apply the locale filter
        current[part] = {
          _filter: { languages_id: { code: { _eq: locale } } },
        }
      } else {
        // Intermediate node — nest deeper
        if (!current[part]) current[part] = {}
        current = current[part] as Record<string, unknown>
      }
    }
  }

  return deep
}

/**
 * Standard Directus image fields to request
 */
export function getMediaFields(relationKey: string = 'directus_files_id') {
  return [
    `${relationKey}.id`,
    `${relationKey}.width`,
    `${relationKey}.height`,
    `${relationKey}.title`,
    `${relationKey}.type`,
    `${relationKey}.filename_disk`,
  ]
}
