<script setup lang="ts">
import router from '@/router'
import { computed, ref } from 'vue'

const firstname = ref('')
const lastname = ref('')
const birthdate = ref('')
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
    <div class="mt-16 font-weight-light text-h3 text-center text-deep-purple-darken-2">
      Bitte geben Sie Ihre persönlichen Daten ein
    </div>

    <div class="w-100 mt-16" style="max-width: 500px; height: 300px">
      <div v-if="loading" class="d-flex flex-column align-center justify-center text-center">
        <div class="mb-10 text-h5 text-deep-purple-lighten-2">Suche nach Ihren Daten...</div>
        <v-progress-circular indeterminate size="150" width="10" color="deep-purple-lighten-2" />
      </div>
      <v-form v-else>
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
    </div>

    <v-row class="d-flex justify-center mt-4">
      <v-col>
        <v-btn
          rounded
          size="x-large"
          color="deep-purple-darken-2"
          width="500"
          @click="findPatient()"
          :disabled="loading"
        >
          <span>Bestätigen</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
