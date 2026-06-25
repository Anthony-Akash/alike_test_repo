<script setup lang="ts">
/**
 * DirectusSection — Wrapper component that fetches data for a section
 *
 * Mirrors alike-website's DirectusSection pattern:
 * - Receives collectionName + optional filters
 * - Fetches data via useSectionData
 * - Exposes data to child via scoped slot
 */

interface Props {
  /** Directus collection to fetch from */
  collectionName: string
  /** Optional item ID for single-item fetch */
  itemId?: string | number
  /** Fields to request from Directus */
  fields?: string[]
  /** Translation relation paths to locale-filter */
  translationKeys?: string[]
  /** Additional Directus filter */
  filter?: Record<string, unknown>
  /** Sort order */
  sort?: string[]
  /** Limit results */
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemId: undefined,
  fields: () => ['*', 'translations.*'],
  translationKeys: () => ['translations'],
  filter: () => ({}),
  sort: () => ['sort'],
  limit: -1,
})

const { data, pending, error } = props.itemId
  ? useSectionData(
    props.collectionName,
    props.itemId,
    {
      fields: props.fields,
      translationKeys: props.translationKeys,
      filter: props.filter,
      sort: props.sort,
      limit: props.limit,
    },
  )
  : useSectionData(
    props.collectionName,
    null,
    {
      fields: props.fields,
      translationKeys: props.translationKeys,
      filter: props.filter,
      sort: props.sort,
      limit: props.limit,
    },
  )
</script>

<template>
  <slot
    :data="data"
    :pending="pending"
    :error="error"
  />
</template>
