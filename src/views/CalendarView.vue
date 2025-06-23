<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppointments } from '@/composables/useAppointments'
import AppointmentDetailModal from '@/components/AppointmentDetailModal.vue'
import router from '@/router'

const { appointments } = useAppointments()

const appointmentDetailOpen = ref(false)
const selectedAppointment = ref<{
  title: string
  doctor: string
  date: string
  startTimeISO: string
  durationMinutes: number
  documentsCompleted: boolean
} | null>(null)

const today = new Date()
const calendarValue = ref([today])

const events = computed(() => {
  return appointments.value.map((appointment) => {
    const startDate = new Date(appointment.startTimeISO)
    const endDate = new Date(startDate.getTime() + appointment.durationMinutes * 60 * 1000)
    
    return {
      title: `${appointment.title} - ${appointment.doctor}`,
      start: startDate,
      end: endDate,
      color: appointment.documentsCompleted ? 'green' : 'red',
      appointment
    }
  })
})

function navigateToAppointments() {
  router.push('/appointments')
}

function openPatientDetails(...args: unknown[]) {
  const eventData = args[1] as { 
    event?: { 
      appointment?: {
        title: string
        doctor: string
        date: string
        startTimeISO: string
        durationMinutes: number
        documentsCompleted: boolean
      }
    } 
  }
  const calendarEvent = eventData?.event
  if (calendarEvent?.appointment) {
    appointmentDetailOpen.value = true
    selectedAppointment.value = calendarEvent.appointment
  }
}
</script>

<template>
  <AppointmentDetailModal 
    :appointment="selectedAppointment" 
    :isOpen="appointmentDetailOpen" 
    @update:isOpen="appointmentDetailOpen = $event" 
  />

  <v-container class="d-flex flex-column justify-center align-center" fluid style="width: 80vw">
    <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2 d-flex align-center justify-space-between w-100">
      <span>Terminkalender</span>
      <v-btn
        rounded
        color="deep-purple-darken-2"
        variant="outlined"
        @click="navigateToAppointments"
      >
        <v-icon left class="mr-2">mdi-view-list</v-icon>
        Listenansicht
      </v-btn>
    </div>
    
    <v-sheet class="mt-4 w-100">
      <v-calendar
        v-model="calendarValue"
        :events="events"
        type="week"
        :interval-height="68"
        :first-interval="8"
        :interval-count="12"
        :weekdays="[1,2,3,4,5,6,0]"
        @click:event="openPatientDetails"
      ></v-calendar>
    </v-sheet>
  </v-container>
</template>

<style scoped lang="scss">
</style>
