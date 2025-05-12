<script setup lang="ts">
import insuranceCardImg from '@/assets/insurance-card.png'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

function navigateToCheckPersonalData() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/check-personal-data')
  }, 2000)
}

function navigateToFillPersonalData() {
  router.push('/no-insurance')
}
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center text-center" fluid>
    <!-- Image Wrapper -->
    <div class="image-wrapper">
      <div v-if="loading" class="mb-10 d-flex flex-column align-center justify-center text-center">
        <div class="mb-10 text-h5 text-deep-purple-lighten-2">Suche nach Ihren Daten...</div>
        <v-progress-circular indeterminate size="100" width="8" color="deep-purple-lighten-2" />
      </div>

      <v-img
        v-else
        :src="insuranceCardImg"
        class="insurance-img"
        @click="navigateToCheckPersonalData"
      />
    </div>

    <!-- Headline Text -->
    <div class="font-weight-light text-h4 text-deep-purple-darken-2 mb-6 px-4">
      Bitte legen Sie Ihre Versicherungskarte ein
    </div>

    <v-btn
      class="my-16 button-responsive"
      rounded
      size="x-large"
      @click="navigateToFillPersonalData"
      color="deep-purple-lighten-2"
    >
      <span class="test">Ich habe keine Versicherungskarte</span>
    </v-btn>
  </v-container>
</template>

<style scoped>
.image-wrapper {
  width: 100%;
  max-width: 430px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.insurance-img {
  width: 100%;
  max-width: 300px;
  cursor: pointer;
}

.test {
  white-space: normal;
  text-align: center;
  line-height: 1.4;
  word-break: break-word;
}
</style>
