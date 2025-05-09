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

// Utility to compare formatted dates
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

// Title formatting for group headers
function getGroupTitle(dateStr: string): string {
  const date = new Date(dateStr.split('.').reverse().join('-')) // Convert DD.MM.YYYY to Date
  if (isSameDay(date, today)) return 'Heute'
  if (isSameDay(date, tomorrow)) return 'Morgen'
  return dateStr
}
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <h1 class="mt-16 text-deep-purple-darken-2">Ihre Termine</h1>

    <div v-for="(group, date) in groupedAppointments" :key="date" class="mt-10 w-100">
      <h2 class="text-subtitle-1 text-deep-purple-darken-2 mb-4 font-weight-bold">
        {{ getGroupTitle(date) }}
      </h2>
      <v-row>
        <v-col v-for="(appointment, index) in group" :key="index" cols="12" md="4">
          <v-card elevation="3" class="pa-4">
            <v-card-title class="text-h6 font-weight-bold">{{ appointment.title }}</v-card-title>
            <v-card-subtitle class="mb-2">bei {{ appointment.doctor }}</v-card-subtitle>

            <v-divider></v-divider>

            <v-card-text class="mt-3">
              <div><strong>Datum:</strong> {{ appointment.date }}</div>
              <div class="mt-2">
                <strong>Dokumente vollständig:</strong>
                <v-chip
                  class="ml-2"
                  :color="appointment.documentsComplete ? 'green' : 'red'"
                  dark
                  small
                >
                  {{ appointment.documentsComplete ? 'Ja' : 'Nein' }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
