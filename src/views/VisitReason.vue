<script setup lang="ts">
const cardOptions = [
  {
    title: 'Ich habe einen Termin',
    icon: 'mdi-calendar-check',
    color: '#F4EDFF',
    route: '/appointments',
  },
  {
    title: 'Ich muss einige Dokumente abgeben',
    icon: 'mdi-file-document-outline',
    color: '#cef6fe',
    route: '/upload-documents',
  },
  {
    title: 'Ich brauche ein Rezept',
    icon: 'mdi-medication',
    color: '#fffbbf',
    route: '/go-to-reception',
  },
  { title: 'Sonstiger', icon: 'mdi-account', color: '#dcffcc', route: '/go-to-reception' },
]

import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToRoute(route: string) {
  router.push(route)
}
</script>

<template>
  <v-container>
    <div class="d-flex flex-column align-center">
      <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2">
        Was ist der Grund für Ihren Besuch?
      </div>

      <v-row no-gutters class="fill-height mt-16">
        <v-col
          v-for="card in cardOptions"
          :key="card.title"
          cols="12"
          sm="6"
          md="6"
          lg="3"
          class="d-flex"
        >
          <v-card
            class="ma-4 pa-4 d-flex flex-column justify-center align-center"
            :color="card.color"
            variant="flat"
            style="aspect-ratio: 1 / 1; width: 100%; border-radius: 30px"
            @click="navigateToRoute(card.route)"
          >
            <div style="height: 50%" class="d-flex align-end justify-center w-100 mb-6">
              <v-btn class="ma-2" color="white" :icon="card.icon" size="x-large" variant="flat" />
            </div>
            <v-row>
              <v-col class="d-flex align-center">
                <div class="text-h6 mb-1 text-center">
                  {{ card.title }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
