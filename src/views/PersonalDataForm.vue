<script setup lang="ts">
import router from '@/router'
import { computed, ref } from 'vue'

const firstname = ref('')
const lastname = ref('')
const birthdate = ref('')
const birthdateMenu = ref(false)
const loading = ref(false)

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

const findPatient = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    navigateToVisitReason()
  }, 2000)
}

const allFieldsFilled = computed(() => {
  return lastname.value && firstname.value && birthdate.value
})

function navigateToVisitReason() {
  router.push('/visit-reason')
}
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center text-center" fluid>
    <div class="mt-16 font-weight-light text-h4 text-deep-purple-darken-2">
      Bitte geben Sie Ihre persönlichen Daten ein
    </div>

    <div class="personal-data-form mt-10">
      <div
        v-if="loading"
        class="d-flex flex-column align-center justify-center text-center"
        style="height: 300px"
      >
        <div class="mb-10 text-h5 text-deep-purple-lighten-2">Suche nach Ihren Daten...</div>
        <v-progress-circular indeterminate size="150" width="10" color="deep-purple-lighten-2" />
      </div>

      <v-form v-else>
        <v-container class="pa-0">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="firstname" label="Nachname" required />
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="lastname" label="Vorname" required />
            </v-col>

            <v-col cols="12">
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

          <v-row class="mt-4">
            <v-col class="d-flex justify-center">
              <v-btn
                rounded
                block
                size="x-large"
                color="deep-purple-darken-2"
                width="100%"
                max-width="300"
                @click="findPatient"
                :disabled="!allFieldsFilled || loading"
              >
                <span>Bestätigen</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
  </v-container>
</template>

<style scoped>
.personal-data-form {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}
</style>
