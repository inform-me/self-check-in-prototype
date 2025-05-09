<script setup lang="ts"></script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2">
      Bitte laden Sie die Dokumente hoch
    </div>

    <!-- camera btn -->
    <v-btn
      rounded
      size="x-large"
      color="deep-purple-darken-2"
      width="500"
      class="mt-16"
      @click="$emit('openCamera')"
    >
      <v-icon left class="mr-4">mdi-camera</v-icon>
      Dokumente scannen
    </v-btn>
  </v-container>
</template>
