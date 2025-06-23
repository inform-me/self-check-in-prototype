<script setup lang="ts">
import CameraCapture from '@/components/CameraCapture.vue'
import FillFormsDialog from '@/components/FillFormsDialog.vue'
import ImageUploadedDialog from '@/components/ImageUploadedDialog.vue'
import router from '@/router'
import { computed, ref } from 'vue'
import { useAppointments } from '@/composables/useAppointments'

const showCamera = ref(false)

const previewDialogOpen = ref(false)

const { appointments, isXrayFormFilled, formatDate, fillXrayForm } = useAppointments()

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



function navigateToDonePage() {
  router.push('/done')
}
</script>

<template>
  <CameraCapture
    v-if="showCamera"
    @image-captured="((showCamera = false), (previewDialogOpen = true))"
    @cancel="((showCamera = false), (previewDialogOpen = false))"
  />

  <div v-else>
    <ImageUploadedDialog :isOpen="previewDialogOpen" @update:isOpen="previewDialogOpen = $event" />

    <v-container class="d-flex flex-column justify-center align-center" fluid style="width: 80vw">
      <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2 d-flex align-center justify-space-between w-100">
        <span @click="fillXrayForm">Ihre Termine</span>
        <v-btn
          rounded
          color="deep-purple-darken-2"
          variant="outlined"
          @click="$router.push('/calendar')"
        >
          <v-icon left class="mr-2">mdi-calendar</v-icon>
          Kalenderansicht
        </v-btn>
      </div>

      <div v-for="(group, date) in groupedAppointments" :key="date" class="mt-6 w-100">
        <h2 class="text-subtitle-1 text-black mb-4 d-flex align-center justify-space-between">
          <v-row>
            <v-col cols="12" sm="6" class="d-flex align-center order-last order-sm-first">
              <v-chip color="white" variant="flat" class="text-grey-darken-2">{{ date }}</v-chip>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              class="d-flex justify-center justify-sm-end align-center order-first order-sm-last"
            >
              <v-btn
                v-if="isToday(date)"
                rounded
                color="deep-purple-darken-2"
                variant="outlined"
                @click="showCamera = true"
              >
                <v-icon left class="mr-4">mdi-camera</v-icon>
                Dokumente hochladen
              </v-btn>
            </v-col>
          </v-row>
        </h2>

        <v-row>
          <v-col v-for="(appointment, index) in group" :key="index" cols="12">
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

                  <v-row v-if="isToday(date)">
                    <v-col cols="12" sm="6" class="d-flex align-center">
                      <v-card-subtitle> Dokumente vollständig: </v-card-subtitle>
                      <v-chip
                        class="ml-2"
                        :color="appointment.documentsCompleted ? 'green' : 'red'"
                        dark
                        small
                      >
                        {{ appointment.documentsCompleted ? 'Ja' : 'Nein' }}
                      </v-chip>
                    </v-col>

                    <v-col
                      cols="12"
                      sm="6"
                      class="d-flex justify-center justify-sm-end align-center"
                    >
                      <FillFormsDialog
                        v-if="!appointment.documentsCompleted && isToday(date)"
                        :appointment="appointment"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="isToday(date)">
          <v-col cols="12" class="d-flex justify-center justify-sm-end">
            <v-btn
              v-if="group.every((appt) => appt.documentsCompleted)"
              rounded
              color="#4caf50"
              @click="navigateToDonePage"
            >
              Check-in abschließen
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-10" v-if="isToday(date)" />
      </div>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.background-green {
  background-color: #dcffcc !important;
  // background-color: #ede1ff !important;
}

.background-red {
  background-color: #ffd6d6 !important;
}

.today {
  border-top: solid 16px #f00 !important;
}

.today.documents-completed {
  border-top: solid 16px #4caf50 !important;
  // border-top: solid 16px #512da8 !important;
}
</style>
