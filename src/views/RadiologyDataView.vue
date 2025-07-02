<template>
  <div class="radiology-data-view">
    <RadiologyDataTree />
  </div>
</template>

<script setup lang="ts">
import RadiologyDataTree from '@/components/RadiologyDataTree.vue'
</script>

<style lang="scss" scoped>
.radiology-data-view {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}
</style>
