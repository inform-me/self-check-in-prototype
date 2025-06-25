<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useAppointments } from '@/composables/useAppointments'
import AppointmentDetailModal from '@/components/AppointmentDetailModal.vue'
import ReminderConfigDialog from '@/components/ReminderConfigDialog.vue'
import router from '@/router'

const { appointments } = useAppointments()

const currentView = ref<'month' | 'week' | 'day'>('week')
const selectedAppointmentTypes = ref<string[]>(['MRT', 'Röntgen', 'Computertomographie', 'Mammographie'])

// Force calendar re-render when view changes
const calendarKey = ref(`calendar-${currentView.value}`)

// Watch for view changes and force re-render
watch(currentView, (newView) => {
  nextTick(() => {
    calendarKey.value = `calendar-${newView}-${Date.now()}`
  })
  
  // Enforce selection rules when switching views
  if (newView === 'month' || newView === 'week') {
    // Single-selection views: if multiple are selected, keep only the first one
    if (selectedAppointmentTypes.value.length > 1) {
      selectedAppointmentTypes.value = [selectedAppointmentTypes.value[0]]
    }
  }
  // Daily view allows multi-selection, so no enforcement needed
})

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
  return appointments.value
    .filter(appointment => selectedAppointmentTypes.value.includes(appointment.title))
    .map((appointment) => {
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

function toggleAppointmentType(type: string) {
  if (currentView.value === 'month' || currentView.value === 'week') {
    // Single-selection logic for monthly and weekly views
    if (selectedAppointmentTypes.value.length === 1 && selectedAppointmentTypes.value.includes(type)) {
      // If clicking the only selected type, show all
      selectedAppointmentTypes.value = ['MRT', 'Röntgen', 'Computertomographie', 'Mammographie']
    } else {
      // Select only the clicked type
      selectedAppointmentTypes.value = [type]
    }
  } else {
    // Multi-selection logic for daily view only
    const index = selectedAppointmentTypes.value.indexOf(type)
    if (index > -1) {
      selectedAppointmentTypes.value.splice(index, 1)
    } else {
      selectedAppointmentTypes.value.push(type)
    }
  }
}

// Week view helper functions
const weekDays = computed(() => {
  const today = new Date()
  const currentWeek = []
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    currentWeek.push({
      name: day.toLocaleDateString('de-DE', { weekday: 'short' }),
      date: day.toISOString().split('T')[0]
    })
  }
  return currentWeek
})

const timeSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

function getEventsForDayAndHour(date: string, hour: number) {
  return events.value.filter(event => {
    const eventDate = event.start.toISOString().split('T')[0]
    const eventHour = event.start.getHours()
    return eventDate === date && eventHour === hour
  })
}

// Daily view helper functions
const todayFormatted = computed(() => {
  const today = new Date()
  return today.toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

function getEventsForTypeAndHour(type: string, hour: number) {
  const today = new Date().toISOString().split('T')[0]
  return events.value.filter(event => {
    const eventDate = event.start.toISOString().split('T')[0]
    const eventHour = event.start.getHours()
    return eventDate === today && eventHour === hour && event.appointment.title === type
  })
}

function openPatientDetails(...args: unknown[]) {
  console.log('Opening patient details:', args)
  
  // Handle both v-calendar events and custom events
  let appointment = null
  if (args[0] && typeof args[0] === 'object') {
    const event = args[0] as { 
      event?: { appointment?: typeof selectedAppointment.value }
      appointment?: typeof selectedAppointment.value
    }
    if (event.event?.appointment) {
      appointment = event.event.appointment
    } else if (event.appointment) {
      appointment = event.appointment
    }
  }
  
  if (appointment) {
    selectedAppointment.value = appointment
    appointmentDetailOpen.value = true
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
      <div class="d-flex gap-2">
        <v-btn-toggle v-model="currentView" mandatory class="mr-4">
          <v-btn value="month" size="small">
            <v-icon>mdi-calendar-month</v-icon>
            <span class="ml-1">Monat</span>
          </v-btn>
          <v-btn value="week" size="small">
            <v-icon>mdi-calendar-week</v-icon>
            <span class="ml-1">Woche</span>
          </v-btn>
          <v-btn value="day" size="small">
            <v-icon>mdi-calendar-today</v-icon>
            <span class="ml-1">Tag</span>
          </v-btn>
        </v-btn-toggle>
        
        <v-btn
          rounded
          color="deep-purple-darken-2"
          variant="outlined"
          @click="navigateToAppointments"
        >
          <v-icon left class="mr-2">mdi-view-list</v-icon>
          Listenansicht
        </v-btn>
        
        <v-menu
          offset-y
          min-width="400px"
          left
          :close-on-content-click="false"
        >
          <template #activator="{ props }">
            <v-btn
              icon
              class="ml-2"
              v-bind="props"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>

          <ReminderConfigDialog />
        </v-menu>
      </div>
    </div>

    <div class="mt-4 d-flex justify-center gap-2 flex-wrap">
      <v-chip
        v-for="type in ['MRT', 'Röntgen', 'Computertomographie', 'Mammographie']"
        :key="type"
        :color="selectedAppointmentTypes.includes(type) ? 'deep-purple-darken-2' : 'grey-lighten-2'"
        :variant="selectedAppointmentTypes.includes(type) ? 'flat' : 'outlined'"
        clickable
        @click="toggleAppointmentType(type)"
      >
        {{ type }}
      </v-chip>
    </div>
    
    <!-- Month view -->
    <v-sheet v-if="currentView === 'month'" class="mt-4 w-100">
      <v-calendar
        key="month-view"
        v-model="calendarValue"
        :events="events"
        type="month"
        :interval-height="68"
        :first-interval="8"
        :interval-count="12"
        :weekdays="[1,2,3,4,5,6,0]"
        @click:event="openPatientDetails"
      ></v-calendar>
    </v-sheet>

    <!-- Week view - Custom implementation -->
    <v-sheet v-if="currentView === 'week'" class="mt-4 w-100">
      <div class="week-calendar">
        <div class="week-header d-flex">
          <div class="time-column" style="width: 80px;"></div>
          <div class="day-column" v-for="day in weekDays" :key="day.date" style="flex: 1; text-align: center; padding: 8px; border: 1px solid #e0e0e0;">
            <div class="font-weight-bold">{{ day.name }}</div>
            <div class="text-caption">{{ day.date }}</div>
          </div>
        </div>
        <div class="week-body">
          <div class="time-slot d-flex" v-for="hour in timeSlots" :key="hour" style="height: 68px;">
            <div class="time-column" style="width: 80px; padding: 8px; border: 1px solid #e0e0e0; text-align: center; font-size: 12px;">
              {{ hour }}:00
            </div>
            <div class="day-column" v-for="day in weekDays" :key="`${day.date}-${hour}`" style="flex: 1; border: 1px solid #e0e0e0; position: relative;">
              <div 
                v-for="event in getEventsForDayAndHour(day.date, hour)" 
                :key="event.title"
                class="event-block"
                :style="{ backgroundColor: event.color, color: 'white', padding: '2px 4px', margin: '1px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }"
                @click="openPatientDetails(event)"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-sheet>

    <!-- Daily view - Custom implementation -->
    <div v-else-if="currentView === 'day'" class="mt-4 w-100">
      <v-row>
        <v-col
          v-for="type in selectedAppointmentTypes"
          :key="type"
          :cols="Math.floor(12 / selectedAppointmentTypes.length)"
        >
          <v-card>
            <v-card-title class="text-center bg-deep-purple-lighten-4">
              {{ type }}
            </v-card-title>
            <div class="day-calendar">
              <div class="day-header text-center pa-2 font-weight-bold">
                {{ todayFormatted }}
              </div>
              <div class="day-body">
                <div class="time-slot d-flex" v-for="hour in timeSlots" :key="hour" style="height: 68px;">
                  <div class="time-column" style="width: 80px; padding: 8px; border: 1px solid #e0e0e0; text-align: center; font-size: 12px;">
                    {{ hour }}:00
                  </div>
                  <div class="event-column" style="flex: 1; border: 1px solid #e0e0e0; position: relative;">
                    <div 
                      v-for="event in getEventsForTypeAndHour(type, hour)" 
                      :key="event.title"
                      class="event-block"
                      :style="{ backgroundColor: event.color, color: 'white', padding: '4px 8px', margin: '2px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }"
                      @click="openPatientDetails(event)"
                    >
                      {{ event.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
</style>
