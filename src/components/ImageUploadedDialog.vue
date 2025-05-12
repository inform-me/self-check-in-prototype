<script setup lang="ts">
import medicalDocument from '@/assets/medical-document.png'
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen'])

const internalOpen = ref(props.isOpen)

const loading = ref(false)

watch(
  () => props.isOpen,
  (newVal) => {
    internalOpen.value = newVal
    loading.value = true
    if (newVal) {
      setTimeout(() => {
        loading.value = false
      }, 2000)
    }
  },
)

function close() {
  internalOpen.value = false
  emit('update:isOpen', false)
}
</script>

<template>
  <v-dialog v-model="internalOpen" max-width="700">
    <v-card>
      <v-card-title class="text-h6 pa-6 bg-deep-purple-darken-2"> Dokumentvorschau </v-card-title>
      <v-card-text>
        <div
          v-if="loading"
          class="mt-16 d-flex flex-column align-center justify-center text-center"
        >
          <div class="mb-10 text-h5 text-deep-purple-lighten-2">Ihr Dokument hochladen...</div>
          <v-progress-circular indeterminate size="100" width="8" color="deep-purple-lighten-2" />
        </div>
        <v-img v-else :src="medicalDocument" height="400px" width="100%" class="mt-4" />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="deep-purple-darken-2" text @click="close">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
