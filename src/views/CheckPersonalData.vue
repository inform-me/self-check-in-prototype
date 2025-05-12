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

function navigateToVisitReason() {
  router.push('/visit-reason')
}

const allFieldsFilled = computed(() => {
  return lastname.value && firstname.value && birthdate.value
})
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center text-center" fluid>
    <div class="mt-16 font-weight-light text-h4 text-deep-purple-darken-2">
      Bitte überprüfen Sie Ihre persönlichen Daten
    </div>

    <v-form class="personal-data-form mt-10">
      <v-container class="pa-0">
        <v-row>
          <v-col cols="12 bg-white">
            <v-text-field v-model="firstname" label="Nachname" required />
          </v-col>

          <v-col cols="12 bg-white">
            <v-text-field v-model="lastname" label="Vorname" required />
          </v-col>

          <v-col cols="12 bg-white">
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
              :disabled="!allFieldsFilled"
              @click="navigateToVisitReason"
            >
              Bestätigen
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<style scoped lang="scss">
.personal-data-form {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
}
</style>
