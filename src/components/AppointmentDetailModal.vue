<script setup lang="ts">
import qrCodeImage from '@/assets/qr-code.png'
import { defineProps, defineEmits, ref, computed } from 'vue'

const props = defineProps<{
  appointment: {
    title: string
    doctor: string
    date: string
    startTimeISO: string
    durationMinutes: number
    documentsCompleted: boolean
  } | null
  isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen'])

const dialog = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})

const availableForms = ref([
  { id: 'roentgen_fragebogen', name: 'Röntgen Fragebogen', required: true, completed: false },
  { id: 'anamnese_bogen', name: 'Anamnese Bogen', required: false, completed: false },
  { id: 'einverstaendnis', name: 'Einverständniserklärung', required: true, completed: false },
  { id: 'datenschutz', name: 'Datenschutzerklärung', required: false, completed: false },
  { id: 'notfall_kontakt', name: 'Notfallkontakt', required: false, completed: false }
])

const selectedForms = ref<string[]>(['roentgen_fragebogen'])

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const sendSelectedForms = () => {
  const formsParam = selectedForms.value.join(',')
  const url = `https://informme.info/app/#/welcome?to=institution/client-demo-20&forms=${formsParam}&location=muc`
  window.open(url, '_blank')
}

const toggleForm = (formId: string) => {
  const index = selectedForms.value.indexOf(formId)
  if (index > -1) {
    selectedForms.value.splice(index, 1)
  } else {
    selectedForms.value.push(formId)
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card v-if="appointment">
      <v-toolbar
        color="primary"
        dark
        style="font-size: 20px"
      >
        <v-toolbar-title>Termindetails: {{ appointment.title }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-6 appointment-details-content">
        <div class="mb-6">
          <h3 class="text-h6 mb-3">Termininfomationen</h3>
          <v-row>
            <v-col cols="12" sm="6">
              <v-chip color="deep-purple-lighten-4" class="mb-2">
                <v-icon left>mdi-doctor</v-icon>
                {{ appointment.doctor }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6">
              <v-chip color="deep-purple-lighten-4" class="mb-2">
                <v-icon left>mdi-calendar</v-icon>
                {{ appointment.date }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6">
              <v-chip color="deep-purple-lighten-4" class="mb-2">
                <v-icon left>mdi-clock</v-icon>
                {{ formatTime(appointment.startTimeISO) }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6">
              <v-chip color="deep-purple-lighten-4" class="mb-2">
                <v-icon left>mdi-timer</v-icon>
                {{ appointment.durationMinutes }} Min
              </v-chip>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4" />

        <div class="mb-6">
          <h3 class="text-h6 mb-3">Formulare verwalten</h3>
          
          <div class="mb-4">
            <h4 class="text-subtitle-1 mb-2">Verfügbare Formulare:</h4>
            <v-list>
              <v-list-item
                v-for="form in availableForms"
                :key="form.id"
                @click="toggleForm(form.id)"
              >
                <template #prepend>
                  <v-checkbox
                    :model-value="selectedForms.includes(form.id)"
                    @click.stop="toggleForm(form.id)"
                    color="deep-purple-darken-2"
                  />
                </template>
                <v-list-item-title>{{ form.name }}</v-list-item-title>
                <template #append>
                  <v-chip
                    v-if="form.required"
                    size="small"
                    color="red"
                    variant="outlined"
                  >
                    Erforderlich
                  </v-chip>
                  <v-chip
                    v-if="form.completed"
                    size="small"
                    color="green"
                    variant="outlined"
                  >
                    Abgeschlossen
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>

          <div class="mb-4">
            <v-alert
              v-if="selectedForms.length === 0"
              type="warning"
              variant="outlined"
            >
              Bitte wählen Sie mindestens ein Formular aus.
            </v-alert>
          </div>
        </div>

        <v-divider class="my-4" />

        <div class="text-center">
          <div class="mb-4">
            Scannen Sie den QR-Code mit Ihrem Handy oder füllen Sie die Formulare mit diesem Tablet aus.
          </div>
          <v-img :src="qrCodeImage" height="300px" width="300px" class="mx-auto" />
        </div>
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-btn text @click="dialog = false" color="grey">
          Schließen
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          :disabled="selectedForms.length === 0"
          @click="sendSelectedForms"
        >
          <v-icon left>mdi-send</v-icon>
          Ausgewählte Formulare senden
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.appointment-details-content {
  font-size: 16px;
}
</style>
