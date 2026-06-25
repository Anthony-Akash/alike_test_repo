<script setup lang="ts">
import type { VddSection } from '~/types/directus'
import type { Component } from 'vue'
import CategoriesNav from '~/components/sections/CategoriesNav.vue'
import DealSectionBlock from '~/components/sections/DealSectionBlock.vue'
import ExploreSection from '~/components/sections/ExploreSection.vue'
import FaqSection from '~/components/sections/FaqSection.vue'
import HeroBannerSection from '~/components/sections/HeroBannerSection.vue'
import PassHighlightSection from '~/components/sections/PassHighlightSection.vue'

/**
 * PageSections — Renders an ordered list of CMS sections.
 *
 * Sections are fetched upstream (in [...slug].vue via usePageData) and passed
 * in as a prop, already sorted by their `sort` field. This component only maps
 * component names to imports and forwards section config as props.
 *
 * To add a new section type: import its component above and add it to the map.
 */

interface Props {
  sections: VddSection[]
}

const props = defineProps<Props>()

const sectionComponents: Record<string, Component> = {
  CategoriesNav,
  DealSectionBlock,
  ExploreSection,
  FaqSection,
  HeroBannerSection,
  PassHighlightSection,
}

function getSectionTranslation(section: VddSection) {
  return section.translations?.[0] ?? null
}

function resolveSection(componentName: string): Component | string {
  if (sectionComponents[componentName]) return sectionComponents[componentName]

  const normalized = componentName.replace(/\.vue$/, '')
  if (sectionComponents[normalized]) return sectionComponents[normalized]

  const withSuffix = normalized + 'Section'
  if (sectionComponents[withSuffix]) return sectionComponents[withSuffix]

  return componentName
}

function sectionProps(section: VddSection) {
  const t = getSectionTranslation(section)
  return {
    collectionName: section.collection_name,
    itemId: section.item_id,
    dealTypeFilter: section.deal_type_filter,
    cardCount: section.card_count,
    pageSlot: section.page_slot,
    theme: section.theme,
    title: t?.title,
    description: t?.description,
    ctaLabel: t?.cta_label,
    ctaUrl: t?.cta_url,
    sections: props.sections,
    sectionId: section.section_id,
  }
}

function isDealsZoneSection(section: VddSection): boolean {
  return section.component === 'CategoriesNav' || !!section.deal_type_filter
}

const dealsZoneRange = computed(() => {
  const start = props.sections.findIndex(isDealsZoneSection)
  let end = -1
  for (let i = props.sections.length - 1; i >= 0; i--) {
    if (isDealsZoneSection(props.sections[i]!)) {
      end = i
      break
    }
  }
  if (start === -1 || end === -1) return null
  return { start, end }
})

const beforeSections = computed(() => {
  const range = dealsZoneRange.value
  return range ? props.sections.slice(0, range.start) : props.sections
})

const dealsZoneSections = computed(() => {
  const range = dealsZoneRange.value
  return range ? props.sections.slice(range.start, range.end + 1) : []
})

const afterSections = computed(() => {
  const range = dealsZoneRange.value
  return range ? props.sections.slice(range.end + 1) : []
})
</script>

<template>
  <!-- Sections before the deals zone -->
  <section
    v-for="section in beforeSections"
    :id="section.section_id || undefined"
    :key="section.id"
  >
    <component
      :is="resolveSection(section.component)"
      v-bind="sectionProps(section)"
    />
  </section>

  <!-- Deals zone: CategoriesNav (sticky) + deal sections in one container -->
  <div v-if="dealsZoneSections.length">
    <template
      v-for="section in dealsZoneSections"
      :key="section.id"
    >
      <!-- CategoriesNav rendered without <section> wrapper so sticky works within this container -->
      <component
        :is="resolveSection(section.component)"
        v-if="section.component === 'CategoriesNav'"
        v-bind="sectionProps(section)"
      />
      <section
        v-else
        :id="section.section_id || undefined"
      >
        <component
          :is="resolveSection(section.component)"
          v-bind="sectionProps(section)"
        />
      </section>
    </template>
  </div>

  <!-- Sections after the deals zone -->
  <section
    v-for="section in afterSections"
    :id="section.section_id || undefined"
    :key="section.id"
  >
    <component
      :is="resolveSection(section.component)"
      v-bind="sectionProps(section)"
    />
  </section>
</template>
