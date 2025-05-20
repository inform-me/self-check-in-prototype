<script setup lang="ts">
import floorplanImg from '@/assets/floorplan.png'

import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToHomePage() {
  router.push('/')
}
</script>

<template>
  <v-container
    class="d-flex flex-column justify-center align-center"
    fluid
    width="70vw"
    @click="navigateToHomePage"
  >
    <div class="mt-16 font-weight-light text-h4 text-center text-deep-purple-darken-2 mb-10">
      Vielen Dank, wir haben nun alle notwendigen Informationen und Unterlagen. Bitte nehmen Sie
      direkt im MRT-Vorbereitungsraum Platz.
    </div>

    <v-img :src="floorplanImg" :width="$vuetify.display.lgAndUp ? '400px' : '600px'" />
  </v-container>
</template>
