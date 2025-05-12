<script setup lang="ts">
import { nextTick, ref } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const cameraOpen = ref(false)
const capturedImage = ref<string | null>(null)
const imageConfirmed = ref(false)

const openCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
    cameraOpen.value = true
    capturedImage.value = null
    imageConfirmed.value = false

    await nextTick()

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await videoRef.value.play()
    }
  } catch (error) {
    console.error('Fehler beim Zugriff auf die Kamera:', error)
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop())
    stream.value = null
  }
  cameraOpen.value = false
  capturedImage.value = null
  imageConfirmed.value = false
}

const takePicture = () => {
  if (!videoRef.value) return

  const canvas = document.createElement('canvas')
  const video = videoRef.value

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  capturedImage.value = canvas.toDataURL('image/png')

  // Stop the video to freeze the frame
  stream.value?.getTracks().forEach((track) => track.stop())
}

const retakePicture = async () => {
  await openCamera()
}

const confirmPicture = () => {
  imageConfirmed.value = true
  console.log('Image confirmed:', capturedImage.value)
}
</script>

<template>
  <div>
    <!-- Camera overlay -->
    <div v-if="cameraOpen" class="camera-wrapper d-flex justify-center align-center">
      <div class="camera-container">
        <!-- Image preview -->
        <template v-if="capturedImage && !imageConfirmed">
          <img :src="capturedImage" alt="Captured" class="camera-video" />
          <div class="button-group">
            <v-btn color="red" size="x-large" rounded variant="flat" @click="retakePicture">
              <v-icon left class="mr-4">mdi-camera-retake</v-icon>
              Neu aufnehmen
            </v-btn>

            <v-btn color="green" size="x-large" rounded variant="flat" @click="confirmPicture">
              <v-icon left class="mr-4">mdi-check</v-icon>
              Bestätigen
            </v-btn>
          </div>
        </template>

        <!-- Live camera view -->
        <template v-else>
          <video ref="videoRef" autoplay playsinline class="camera-video" />
          <div class="button-group">
            <v-btn icon size="x-large" color="white" @click="takePicture">
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </div>
        </template>

        <!-- Close button -->
        <v-btn class="close-btn" icon size="large" color="white" @click="stopCamera">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Default screen -->
    <v-container v-else class="d-flex flex-column justify-center align-center" fluid>
      <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2">
        Bitte laden Sie die Dokumente hoch
      </div>

      <v-btn
        rounded
        size="x-large"
        color="deep-purple-darken-2"
        width="500"
        class="mt-16"
        @click="openCamera"
      >
        <v-icon left class="mr-4">mdi-camera</v-icon>
        Dokumente scannen
      </v-btn>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.camera-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 1000;
}

.camera-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (min-width: 1024px) {
    width: 768px;
    height: 1024px;
    margin: auto;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
    padding-bottom: 140px;
  }
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.button-group {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
  z-index: 10;

  @media (min-width: 1024px) {
    padding: 0 40px;
    bottom: 250px;
  }
}
</style>
