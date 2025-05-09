<script setup lang="ts">
import { computed, ref } from 'vue'

// Helper to format dates in German (DD.MM.YYYY)
function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Define dates
const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)
const twoWeeksLater = new Date()
twoWeeksLater.setDate(today.getDate() + 14)

// Define appointments
const appointments = ref([
  {
    title: 'Allgemeine Untersuchung',
    doctor: 'Dr. Müller',
    date: formatDate(today),
    documentsComplete: true,
  },
  {
    title: 'Zahnkontrolle',
    doctor: 'Dr. Schmidt',
    date: formatDate(today),
    documentsComplete: false,
  },
  {
    title: 'Augenuntersuchung',
    doctor: 'Dr. Weber',
    date: formatDate(tomorrow),
    documentsComplete: true,
  },
  {
    title: 'Hautscreening',
    doctor: 'Dr. Neumann',
    date: formatDate(twoWeeksLater),
    documentsComplete: false,
  },
])

// Group appointments by date
const groupedAppointments = computed(() => {
  const groups: Record<string, typeof appointments.value> = {}
  for (const appt of appointments.value) {
    if (!groups[appt.date]) {
      groups[appt.date] = []
    }
    groups[appt.date].push(appt)
  }
  return groups
})
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <div class="mt-16 font-weight-light text-h3 text-center">Ihre Termine</div>

    <div v-for="(group, date) in groupedAppointments" :key="date" class="mt-10 w-100">
      <h2 class="text-subtitle-1 text-grey mb-4">
        {{ date }}
      </h2>
      <v-row>
        <v-col v-for="(appointment, index) in group" :key="index" cols="12" md="4">
          <v-card flat elevation="2">
            <v-row>
              <v-col sm="2" lg="3" class="bg-blue-lighten-5 d-flex justify-center align-center">
                <v-icon size="50" color="black" icon="mdi-calendar"> mdi-calendar </v-icon>
              </v-col>
              <v-col sm="10" lg="9" class="py-6">
                <v-card-title class="text-h6 font-weight-bold">
                  {{ appointment.title }}
                </v-card-title>
                <v-card-subtitle class="mb-2">
                  {{ appointment.date }}
                </v-card-subtitle>
                <v-card-subtitle class="mb-2">bei {{ appointment.doctor }}</v-card-subtitle>
                <v-card-subtitle>
                  Dokumente vollständig:

                  <v-chip
                    class="ml-2"
                    :color="appointment.documentsComplete ? 'green' : 'red'"
                    dark
                    small
                  >
                    {{ appointment.documentsComplete ? 'Ja' : 'Nein' }}
                  </v-chip>
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
