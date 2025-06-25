<script setup lang="ts">
import qrCodeImage from '@/assets/qr-code.png'
import { defineProps, defineEmits, ref, computed } from 'vue'

interface InfoIcon {
  iconCode: string
  tooltip: string
  color: string
}

interface Appointment {
  title: string
  doctor: string
  date: string
  startTimeISO: string
  durationMinutes: number
  documentsCompleted: boolean
  problemIcons?: InfoIcon[]
  isFlagged?: boolean
}

const props = defineProps<{
  appointment: Appointment | null
  isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen', 'update:appointment'])

const dialog = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})

const mandatoryForms = ref([
  { id: 'roentgen_fragebogen', name: 'Röntgen Fragebogen', completed: false },
  { id: 'einverstaendnis', name: 'Einverständniserklärung', completed: false }
])

const availableAdditionalForms = ref([
  { id: 'anamnese_bogen', name: 'Anamnese Bogen' },
  { id: 'datenschutz', name: 'Datenschutzerklärung' },
  { id: 'notfall_kontakt', name: 'Notfallkontakt' },
  { id: 'allergien_fragebogen', name: 'Allergien Fragebogen' },
  { id: 'medikation_liste', name: 'Medikation Liste' }
])

const selectedAdditionalForms = ref<string[]>([])
const showAdditionalFormsDialog = ref(false)
const tempSelectedForms = ref<string[]>([])

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString('de-DE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const sendAllForms = () => {
  const allFormIds = [...mandatoryForms.value.map(f => f.id), ...selectedAdditionalForms.value]
  const formsParam = allFormIds.join(',')
  const url = `https://informme.info/app/#/welcome?to=institution/client-demo-20&forms=${formsParam}&location=muc`
  window.open(url, '_blank')
}

const sendNewForms = () => {
  if (selectedAdditionalForms.value.length === 0) return
  const formsParam = selectedAdditionalForms.value.join(',')
  const url = `https://informme.info/app/#/welcome?to=institution/client-demo-20&forms=${formsParam}&location=muc`
  window.open(url, '_blank')
}

const openAdditionalFormsDialog = () => {
  tempSelectedForms.value = [...selectedAdditionalForms.value]
  showAdditionalFormsDialog.value = true
}

const addSelectedForms = (formIds: string[]) => {
  selectedAdditionalForms.value = formIds
  showAdditionalFormsDialog.value = false
}

const removeAdditionalForm = (formId: string) => {
  const index = selectedAdditionalForms.value.indexOf(formId)
  if (index > -1) {
    selectedAdditionalForms.value.splice(index, 1)
  }
}

const toggleFlag = () => {
  if (props.appointment) {
    const updatedAppointment = {
      ...props.appointment,
      isFlagged: !props.appointment.isFlagged
    }
    emit('update:appointment', updatedAppointment)
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
        <v-btn 
          icon 
          :color="appointment.isFlagged ? 'yellow' : 'grey'"
          @click="toggleFlag"
          class="mr-2"
        >
          <v-icon>{{ appointment.isFlagged ? 'mdi-flag' : 'mdi-flag-outline' }}</v-icon>
        </v-btn>
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
            <h4 class="text-subtitle-1 mb-2">Zugewiesene Formulare:</h4>
            <v-chip-group column>
              <v-chip
                v-for="form in mandatoryForms"
                :key="form.id"
                color="deep-purple-lighten-4"
                class="mb-2"
              >
                <v-icon left>mdi-file-document</v-icon>
                {{ form.name }}
                <v-chip
                  v-if="form.completed"
                  size="small"
                  color="green"
                  variant="outlined"
                  class="ml-2"
                >
                  Abgeschlossen
                </v-chip>
              </v-chip>
            </v-chip-group>
          </div>

          <div class="mb-4" v-if="selectedAdditionalForms.length > 0">
            <h4 class="text-subtitle-1 mb-2">Zusätzliche Formulare:</h4>
            <v-chip-group column>
              <v-chip
                v-for="formId in selectedAdditionalForms"
                :key="formId"
                color="blue-lighten-4"
                class="mb-2"
                closable
                @click:close="removeAdditionalForm(formId)"
              >
                <v-icon left>mdi-file-document-plus</v-icon>
                {{ availableAdditionalForms.find(f => f.id === formId)?.name }}
              </v-chip>
            </v-chip-group>
          </div>

          <div class="mb-4">
            <v-btn
              color="primary"
              variant="outlined"
              @click="openAdditionalFormsDialog"
            >
              <v-icon left>mdi-plus</v-icon>
              Weitere Formulare hinzufügen
            </v-btn>
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
          v-if="selectedAdditionalForms.length > 0"
          color="orange"
          variant="outlined"
          class="mr-2"
          @click="sendNewForms"
        >
          <v-icon left>mdi-send</v-icon>
          Neue Formulare senden
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="sendAllForms"
        >
          <v-icon left>mdi-qrcode</v-icon>
          Alle Formulare senden
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showAdditionalFormsDialog" max-width="600">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Weitere Formulare hinzufügen</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="showAdditionalFormsDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="mt-4">
        <h4 class="text-subtitle-1 mb-3">Verfügbare Formulare:</h4>
        <v-chip-group
          v-model="tempSelectedForms"
          multiple
          column
        >
          <v-chip
            v-for="form in availableAdditionalForms"
            :key="form.id"
            :value="form.id"
            filter
            variant="outlined"
            class="mb-2"
          >
            <v-icon left>mdi-file-document</v-icon>
            {{ form.name }}
          </v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn text @click="showAdditionalFormsDialog = false" color="grey">
          Abbrechen
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          @click="addSelectedForms(tempSelectedForms)"
        >
          <v-icon left>mdi-check</v-icon>
          Formulare hinzufügen
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
