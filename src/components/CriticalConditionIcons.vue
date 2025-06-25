<template>
  <div class="critical-icons-container">
    <v-tooltip v-for="icon in displayedIcons" :key="icon.iconCode" bottom>
      <template v-slot:activator="{ props }">
        <v-icon
          v-if="icon.iconCode.startsWith('mdi-')"
          class="ml-1"
          :color="icon.color"
          :size="16"
          v-bind="props"
        >
          {{ icon.iconCode }}
        </v-icon>
        <v-img
          v-else-if="icon.iconCode.startsWith('http')"
          :key="icon.iconCode + icon.tooltip + icon.color"
          :src="icon.iconCode"
          :alt="icon.tooltip"
          width="16"
          height="16"
          :class="`problematic-${icon.color} ml-1`"
          v-bind="props"
        />
      </template>
      <span>{{ icon.tooltip }}</span>
    </v-tooltip>
    
    <v-tooltip v-if="remainingIconsCount > 0" bottom>
      <template v-slot:activator="{ props }">
        <v-chip
          x-small
          color="error"
          class="ml-1"
          v-bind="props"
        >
          +{{ remainingIconsCount }}
        </v-chip>
      </template>
      <span>{{ remainingIconsCount }} weitere kritische Bedingungen</span>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface InfoIcon {
  iconCode: string
  tooltip: string
  color: string
}

const props = defineProps<{
  problemIcons: InfoIcon[]
}>()

const maxVisibleIcons = 2

const displayedIcons = computed(() => {
  return props.problemIcons?.slice(0, maxVisibleIcons) || []
})

const remainingIconsCount = computed(() => {
  return props.problemIcons ? Math.max(0, props.problemIcons.length - maxVisibleIcons) : 0
})
</script>

<style scoped>
.critical-icons-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  margin-top: 2px;
}
.problematic-error {
  filter: sepia(100%) saturate(300%) brightness(70%) hue-rotate(300deg);
}
.problematic-warning {
  filter: sepia(100%) saturate(300%) brightness(70%) hue-rotate(0deg);
}
</style>
