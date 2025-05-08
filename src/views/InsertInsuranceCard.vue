<script setup lang="ts">
import insuranceCardImg from '@/assets/insurance-card.png'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToForm() {
  router.push('/no-insurance')
}
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <h1 class="mt-16 text-deep-purple-darken-2">Bitte legen Sie Ihre Versicherungskarte ein</h1>
    <v-img :src="insuranceCardImg" height="400px" width="400px" class="mb-4" />
    <v-btn
      class="mb-16"
      rounded
      size="x-large"
      @click="goToForm"
      color="deep-purple-darken-2"
      width="500"
    >
      Ich habe keine Versicherungskarte
    </v-btn>
  </v-container>
</template>
