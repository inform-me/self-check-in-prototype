<script setup lang="ts">
import insuranceCardImg from '@/assets/insurance-card.png'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)

function navigateToCheckPersonalData() {
  // simulate loading
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
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <div class="mt-16 font-weight-light text-h3 text-center">
      Bitte legen Sie Ihre Versicherungskarte ein
    </div>

    <!-- Wrapper for consistent height/width -->
    <div style="height: 50vh; width: 430px" class="d-flex justify-center align-center mb-4">
      <div v-if="loading" class="d-flex flex-column align-center justify-center text-center">
        <div class="mb-10 text-h5 text-deep-purple-darken-2">Suche nach Ihren Daten...</div>
        <v-progress-circular indeterminate size="150" width="10" color="deep-purple-darken-2" />
      </div>
      <v-img
        v-else
        :src="insuranceCardImg"
        height="400px"
        width="400px"
        @click="navigateToCheckPersonalData()"
      />
    </div>

    <v-row>
      <v-col class="align-self-end">
        <v-btn
          class="mb-16"
          rounded
          size="x-large"
          @click="navigateToFillPersonalData"
          color="deep-purple-darken-2"
          width="500"
        >
          Ich habe keine Versicherungskarte
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
