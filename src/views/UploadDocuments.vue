<script setup lang="ts">
import medicalDocument from '@/assets/medical-document.png'
import CameraCapture from '@/components/CameraCapture.vue'
import router from '@/router'
import { ref } from 'vue'

const showCamera = ref(false)
const imageTaken = ref(false)
const capturedImage = ref<string | null>(null)
const loading = ref(false)

function caputeImage(image: string) {
  capturedImage.value = image
  imageTaken.value = true
  loading.value = true
  showCamera.value = false

  setTimeout(() => {
    loading.value = false
  }, 2000)
}

function navigateToHomePage() {
  router.push('/')
}
</script>

<template>
  <div v-if="!imageTaken">
    <!-- Show camera -->
    <CameraCapture
      v-if="showCamera"
      @image-captured="caputeImage($event)"
      @cancel="showCamera = false"
    />

    <!-- Default screen -->
    <v-container v-else class="d-flex flex-column justify-center align-center" fluid>
      <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2">
        Bitte laden Sie die Dokumente hoch
      </div>

      <v-btn
        rounded
        size="x-large"
        color="deep-purple-darken-2"
        class="mt-16"
        @click="showCamera = true"
      >
        <v-icon left class="mr-4">mdi-camera</v-icon>
        Dokumente scannen
      </v-btn>
    </v-container>
  </div>

  <!-- After confirmation -->
  <v-div v-else>
    <v-container fluid>
      <div v-if="loading" class="mt-16 d-flex flex-column align-center justify-center text-center">
        <div class="mb-10 text-h5 text-deep-purple-lighten-2">Ihr Dokument hochladen...</div>
        <v-progress-circular indeterminate size="100" width="8" color="deep-purple-lighten-2" />
      </div>
      <div v-else class="d-flex flex-column justify-center align-center text-center">
        <div class="mt-16 font-weight-light text-h4 text-deep-purple-darken-2">
          Das Dokument wurde erfolgreich hochgeladen
        </div>
        <v-img class="mt-16 align-center" :src="medicalDocument" height="400px" width="600px" />

        <div class="d-flex flex-column align-center">
          <v-btn
            rounded
            size="x-large"
            color="deep-purple-darken-2"
            class="mt-16"
            @click="((showCamera = true), (imageTaken = false))"
          >
            <v-icon left class="mr-4">mdi-camera</v-icon>
            Mehr Dokumente scannen
          </v-btn>
          <v-btn
            rounded
            block
            variant="outlined"
            size="x-large"
            color="deep-purple-darken-2"
            class="mt-16"
            @click="navigateToHomePage"
          >
            Fertig
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-div>
</template>
