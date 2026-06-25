<script setup lang="ts">
defineProps<{
  fill?: string
  width?: number | string
  height?: number | string
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width ?? 20"
    :height="height ?? 20"
    viewBox="0 0 20 20"
  >
    <defs>
      <filter
        width="142.9%"
        height="142.9%"
        x="-21.4%"
        y="-21.4%"
        filterUnits="objectBoundingBox"
      >
        <feOffset
          dy="2"
          in="SourceAlpha"
          result="shadowOffsetOuter1"
        />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation="2"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      :fill="fill ?? 'currentColor'"
      fill-rule="nonzero"
      d="M12.288 4a2.137 2.137 0 0 0 .285 2.925l2.436 2.116H1v1.916h14.009l-2.436 2.117A2.137 2.137 0 0 0 12.288 16L19 10l-6.712-6z"
    />
  </svg>
</template>
