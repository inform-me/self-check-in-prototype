<script setup lang="ts">
import FillFormsDialog from '@/components/FillFormsDialog.vue'
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
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(today),
    documentsCompleted: false,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(tomorrow),
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(twoWeeksLater),
    documentsCompleted: false,
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

// is today
const isToday = (date: string): boolean => {
  const todayDate = new Date()
  const [day, month, year] = date.split('.').map(Number)
  return (
    day === todayDate.getDate() &&
    month === todayDate.getMonth() + 1 &&
    year === todayDate.getFullYear()
  )
}
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center" fluid>
    <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2">
      Ihre Termine
    </div>

    <div v-for="(group, date) in groupedAppointments" :key="date" class="mt-10 w-100">
      <h2 class="text-subtitle-1 text-black mb-4">
        <v-chip color="white" variant="flat" class="text-grey-darken-2">{{ date }}</v-chip>
      </h2>

      <v-row>
        <v-col v-for="(appointment, index) in group" :key="index" cols="12" md="6">
          <v-card
            flat
            elevation="2"
            :class="{
              today: isToday(date),
              'documents-completed': appointment.documentsCompleted,
            }"
          >
            <v-row>
              <v-col
                sm="2"
                lg="3"
                class="d-flex justify-center align-center bg-grey-lighten-4"
                :class="{
                  'background-green': appointment.documentsCompleted && isToday(date),
                  'background-red': !appointment.documentsCompleted && isToday(date),
                }"
              >
                <v-btn
                  class="ma-2"
                  color="white"
                  icon="mdi-calendar"
                  size="x-large"
                  variant="flat"
                />
              </v-col>
              <v-col sm="10" lg="9" class="py-6">
                <v-card-title class="text-h6 font-weight-bold">
                  {{ appointment.title }}
                </v-card-title>
                <v-card-subtitle class="mb-2">
                  {{ appointment.date }}
                </v-card-subtitle>
                <v-card-subtitle class="mb-2">bei {{ appointment.doctor }}</v-card-subtitle>

                <div v-if="isToday(date)" class="d-flex align-center justify-space-between pr-4">
                  <div class="d-flex align-center">
                    <v-card-subtitle> Dokumente vollständig: </v-card-subtitle>
                    <v-chip
                      class="ml-2"
                      :color="appointment.documentsCompleted ? 'green' : 'red'"
                      dark
                      small
                    >
                      {{ appointment.documentsCompleted ? 'Ja' : 'Nein' }}
                    </v-chip>
                  </div>

                  <FillFormsDialog
                    v-if="!appointment.documentsCompleted && isToday(date)"
                    :appointment="appointment"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-divider class="mt-6 mb-2" v-if="isToday(date)" />
      </v-row>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.background-green {
  // background-color: #dcffcc !important;
  background-color: #ede1ff !important;
}

.background-red {
  background-color: #ffd6d6 !important;
}

.today {
  border-top: solid 16px #f00 !important;
}

.today.documents-completed {
  // border-top: solid 16px #4caf50 !important;
  border-top: solid 16px #512da8 !important;
}
</style>
