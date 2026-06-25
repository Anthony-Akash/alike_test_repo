/**
 * Global BunnyCDN configuration
 *
 * All `cdn.alike.sh` and `cdn.alike.io` URLs are served through BunnyCDN.
 * These constants define the project-wide image optimisation defaults applied
 * by both the `getAssetUrl()` helper (Directus images) and the `@nuxt/image`
 * BunnyCDN provider (<NuxtImg> / <NuxtPicture>).
 *
 * Change these values here to update optimisation settings everywhere.
 */

/** Default lossy quality (0–100) for all CDN-served raster images */
export const BUNNY_CDN_QUALITY = 70

/** Default output format for all CDN-served raster images */
export const BUNNY_CDN_FORMAT = 'webp' as const

/**
 * Convenience object — spread into transform calls or pass to helpers.
 *
 * @example
 * import { bunnyCdnDefaults } from '~/utils/cdn'
 * const url = getAssetUrl(file, { ...bunnyCdnDefaults, width: 800 })
 */
export const bunnyCdnDefaults = {
  quality: BUNNY_CDN_QUALITY,
  format: BUNNY_CDN_FORMAT,
} as const
