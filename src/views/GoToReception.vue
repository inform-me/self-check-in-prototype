<script setup lang="ts">
import receptionImg from '@/assets/reception.jpg'
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <h1 class="mt-16 text-deep-purple-darken-2">Bitte, gehen Sie zur Rezeption</h1>

    <v-img :src="receptionImg" height="400px" width="600px" />
  </v-container>
</template>
