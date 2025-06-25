<template>
  <v-card>
    <v-card-title class="bg-primary text-white">
      <span>Reminder Configuration</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-switch
          v-model="sendSmsReminders"
          label="Send SMS Reminders"
          @change="saveReminderSettings"
        ></v-switch>
        
        <v-switch
          v-model="sendEmailReminders"
          label="Send Email Reminders"
          @change="saveReminderSettings"
        ></v-switch>

        <v-divider class="my-4"></v-divider>
        
        <v-btn
          color="primary"
          @click="showMessageEditor = true"
        >
          Customize Reminder Messages
        </v-btn>
        
        <ReminderTextEditor
          v-if="showMessageEditor"
          :smsTemplate="smsTemplate"
          :emailTemplate="emailTemplate"
          @update:smsTemplate="updateSmsTemplate"
          @update:emailTemplate="updateEmailTemplate"
          @close="showMessageEditor = false"
        />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ReminderTextEditor from './ReminderTextEditor.vue'

const sendSmsReminders = ref(true)
const sendEmailReminders = ref(true)
const showMessageEditor = ref(false)
const smsTemplate = ref('')
const emailTemplate = ref('')

onMounted(() => {
  const savedSettings = localStorage.getItem('reminderSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    sendSmsReminders.value = settings.sendSmsReminders ?? true
    sendEmailReminders.value = settings.sendEmailReminders ?? true
    smsTemplate.value = settings.smsTemplate ?? 'Default SMS reminder: Your appointment is scheduled for {date} at {time}.'
    emailTemplate.value = settings.emailTemplate ?? 'Default Email reminder: Your appointment with {doctor} is scheduled for {date} at {time}.'
  } else {
    smsTemplate.value = 'Default SMS reminder: Your appointment is scheduled for {date} at {time}.'
    emailTemplate.value = 'Default Email reminder: Your appointment with {doctor} is scheduled for {date} at {time}.'
  }
})

const saveReminderSettings = () => {
  localStorage.setItem('reminderSettings', JSON.stringify({
    sendSmsReminders: sendSmsReminders.value,
    sendEmailReminders: sendEmailReminders.value,
    smsTemplate: smsTemplate.value,
    emailTemplate: emailTemplate.value
  }))
}

const updateSmsTemplate = (newTemplate: string) => {
  smsTemplate.value = newTemplate
  saveReminderSettings()
}

const updateEmailTemplate = (newTemplate: string) => {
  emailTemplate.value = newTemplate
  saveReminderSettings()
}
</script>
