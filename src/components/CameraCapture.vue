<script setup lang="ts">
import { nextTick, ref, defineEmits, defineExpose } from 'vue'

const emit = defineEmits<{
  (e: 'image-captured', image: string): void
  (e: 'cancel'): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const capturedImage = ref<string | null>(null)

const openCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
    })

    await nextTick()

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await videoRef.value.play()
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
  }
}

const stopCamera = () => {
  stream.value?.getTracks().forEach((track) => track.stop())
  stream.value = null
}

const takePicture = () => {
  if (!videoRef.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
  capturedImage.value = canvas.toDataURL('image/png')
  stopCamera()
}

const retakePicture = async () => {
  capturedImage.value = null
  await openCamera()
}

const confirmPicture = () => {
  if (capturedImage.value) {
    emit('image-captured', capturedImage.value)
  }
  stopCamera()
}

const cancel = () => {
  stopCamera()
  emit('cancel')
}

openCamera()

defineExpose({ stopCamera }) // Allow parent to stop camera if needed
</script>

<template>
  <div class="camera-wrapper d-flex justify-center align-center">
    <div class="camera-container">
      <template v-if="capturedImage">
        <img :src="capturedImage" alt="Captured" class="camera-video" />
        <div class="button-group">
          <v-btn color="red" icon size="x-large" @click="retakePicture">
            <v-icon>mdi-camera-retake</v-icon>
          </v-btn>
          <v-btn color="green" icon size="x-large" @click="confirmPicture">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </div>
      </template>

      <template v-else>
        <video ref="videoRef" autoplay playsinline class="camera-video" />
        <div class="button-group">
          <v-btn icon size="x-large" color="white" @click="takePicture">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </div>
      </template>

      <v-btn class="close-btn" icon size="large" color="white" @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
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
