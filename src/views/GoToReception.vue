<script setup lang="ts">
import receptionImg from '@/assets/reception.jpg'
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2">
      Bitte, gehen Sie zur Rezeption
    </div>

    <v-img :src="receptionImg" height="400px" width="600px" />
  </v-container>
</template>
