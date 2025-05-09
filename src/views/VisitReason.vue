<script setup lang="ts">
const cardOptions = [
  {
    title: 'Ich habe einen Termin',
    icon: 'mdi-calendar-check',
    color: '#39B7A2',
    route: '/appointments',
  },
  {
    title: 'Ich muss einige Dokumente abgeben',
    icon: 'mdi-file-document-outline',
    color: '#61B5EB',
    route: '/upload-documents',
  },
  {
    title: 'Ich brauche ein Rezept',
    icon: 'mdi-medication',
    color: '#8863DC',
    route: '/go-to-reception',
  },
  { title: 'Sonstiger', icon: 'mdi-account', color: '#16157C', route: '/go-to-reception' },
]

import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToRoute(route: string) {
  router.push(route)
}
</script>

<template>
  <div class="d-flex flex-column align-center">
    <h1 class="mt-16 mb-10 text-deep-purple-darken-2 text-center">
      Was ist der Grund für Ihren Besuch?
    </h1>

    <v-container>
      <v-row no-gutters class="fill-height">
        <v-col v-for="card in cardOptions" :key="card.title" cols="12" sm="6" md="3" class="d-flex">
          <v-card
            class="ma-4 pa-4 d-flex flex-column justify-center align-center"
            :color="card.color"
            variant="flat"
            elevation="4"
            style="aspect-ratio: 1 / 1; width: 100%; border-radius: 30px"
            @click="navigateToRoute(card.route)"
          >
            <div style="height: 50%" class="d-flex align-end justify-center w-100 mb-6">
              <v-icon :icon="card.icon" size="70" color="white" />
            </div>
            <v-row>
              <v-col class="d-flex align-center">
                <div class="text-h6 mb-1 text-white text-center">
                  {{ card.title }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
