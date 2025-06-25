<template>
  <v-dialog v-model="isOpen" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Customize Reminder Messages</span>
      </v-card-title>
      
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <h3>SMS Template</h3>
              <v-textarea
                v-model="localSmsTemplate"
                label="SMS Reminder Template"
                rows="3"
                outlined
                hint="Use {date}, {time}, {doctor}, {patient} as placeholders"
                persistent-hint
              ></v-textarea>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <h3>Email Template</h3>
              <v-textarea
                v-model="localEmailTemplate"
                label="Email Reminder Template"
                rows="5"
                outlined
                hint="Use {date}, {time}, {doctor}, {patient} as placeholders"
                persistent-hint
              ></v-textarea>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12">
              <v-alert type="info" outlined>
                <strong>Available Placeholders:</strong><br>
                {date} - Appointment date<br>
                {time} - Appointment time<br>
                {doctor} - Doctor name<br>
                {patient} - Patient name
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="closeEditor">
          Cancel
        </v-btn>
        <v-btn color="primary" @click="saveTemplates">
          Save Templates
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  smsTemplate: string
  emailTemplate: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:smsTemplate': [value: string]
  'update:emailTemplate': [value: string]
  'close': []
}>()

const isOpen = ref(true)
const localSmsTemplate = ref(props.smsTemplate)
const localEmailTemplate = ref(props.emailTemplate)

watch(() => props.smsTemplate, (newValue) => {
  localSmsTemplate.value = newValue
})

watch(() => props.emailTemplate, (newValue) => {
  localEmailTemplate.value = newValue
})

const saveTemplates = () => {
  emit('update:smsTemplate', localSmsTemplate.value)
  emit('update:emailTemplate', localEmailTemplate.value)
  closeEditor()
}

const closeEditor = () => {
  isOpen.value = false
  emit('close')
}
</script>
