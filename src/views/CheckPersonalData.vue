<script setup lang="ts">
import router from '@/router'
import { computed, ref } from 'vue'

const lastname = ref('Mustermann')
const firstname = ref('Max')
const birthdate = ref('Thu May 22 1978 00:00:00 GMT+0200 (Central European Summer Time)')
const birthdateMenu = ref(false)

// Format birthdate for display
const formattedBirthdate = computed(() => {
  if (!birthdate.value) return ''
  const date = new Date(birthdate.value)
  if (isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
})

const loading = ref(false)

const findPatient = () => {
  // set timeout to simulate loading
  loading.value = true

  setTimeout(() => {
    loading.value = false
    navigateToVisitReason()
  }, 2000)
}

function navigateToVisitReason() {
  router.push('/visit-reason')
}
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center">
    <v-row>
      <v-col>
        <div class="mt-16 font-weight-light text-h3 text-center">
          Bitte überprüfen Sie Ihre persönlichen Daten
        </div>
      </v-col>
    </v-row>

    <v-form class="w-100" style="max-width: 500px">
      <v-container>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field v-model="firstname" label="Nachname" required />
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field v-model="lastname" label="Vorname" required />
          </v-col>

          <v-col cols="12" md="12">
            <v-menu
              v-model="birthdateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  :model-value="formattedBirthdate"
                  label="Geburtsdatum"
                  required
                  readonly
                />
              </template>
              <v-date-picker v-model="birthdate" @update:modelValue="birthdateMenu = false" />
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-row>
      <v-col class="align-self-end">
        <v-btn
          rounded
          size="x-large"
          color="deep-purple-darken-2"
          width="500"
          @click="findPatient()"
        >
          <v-progress-circular v-if="loading" indeterminate color="white" size="24" />
          <span v-else>Bestätigen</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
