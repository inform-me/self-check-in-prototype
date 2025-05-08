<script setup lang="ts">
const cardOptions = [
  { title: 'Ich habe einen Termin', icon: 'mdi-calendar-check', color: '#39B7A2' },
  {
    title: 'Ich muss einige Dokumente abgeben',
    icon: 'mdi-file-document-multiple-outline',
    color: '#61B5EB',
  },
  { title: 'Ich brauche ein Rezept', icon: 'mdi-medication', color: '#8863DC' },
  { title: 'Sonstiger', icon: 'mdi-account', color: '#16157C' },
]
</script>

<template>
  <v-container class="d-flex flex-column align-center">
    <h1 class="mt-16 mb-10 text-deep-purple-darken-2 text-center">
      Was ist der Grund für Ihren Besuch?
    </h1>

    <div class="card-grid mt-16">
      <div v-for="(card, index) in cardOptions" :key="index" class="square-card-wrapper">
        <v-card
          :color="card.color"
          class="pa-6 d-flex flex-column align-center justify-center text-center"
          elevation="4"
          style="height: 230px; width: 230px"
          rounded
        >
          <v-icon :icon="card.icon" class="mb-6" size="70" color="white" />

          <div
            class="text-white"
            style="
              white-space: normal;
              text-align: center;
              line-height: 1.2;
              height: 48px; /* enough for 2 lines of text */
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            {{ card.title }}
          </div>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  justify-items: center;
}
</style>
