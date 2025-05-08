<script setup lang="ts">
import insuranceCardImg from '@/assets/insurance-card.png'
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToFillPersonalData() {
  router.push('/no-insurance')
}

function navigateToCheckPersonalData() {
  router.push('/check-personal-data')
}
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <h1 class="mt-16 text-deep-purple-darken-2">Bitte legen Sie Ihre Versicherungskarte ein</h1>
    <v-img :src="insuranceCardImg" height="400px" width="400px" class="mb-4" @click="navigateToCheckPersonalData()"/>
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
  </v-container>
</template>
