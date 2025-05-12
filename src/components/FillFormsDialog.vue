<script setup lang="ts">
import qrCodeImage from '@/assets/qr-code.png'
import { defineProps, ref } from 'vue'

const props = defineProps<{
  appointment: {
    title: string
    doctor: string
    date: string
    documentsCompleted: boolean
  }
}>()

const dialog = ref(false)

const { appointment } = props
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="red" rounded variant="flat">
        Formulare ausfüllen
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h6 pa-6 bg-deep-purple-darken-2">
        Formulare für {{ appointment.title }}
      </v-card-title>

      <v-card-text class="mt-4">
        <div>
          Bitte füllen Sie alle erforderlichen Formulare für Ihren Termin bei
          <strong>{{ appointment.doctor }}</strong> am <strong>{{ appointment.date }}</strong> aus.
        </div>

        <div class="mt-4">
          Scannen Sie den QR-Code mit Ihrem Handy oder füllen Sie die Formulare mit diesem Tablet
          aus.
        </div>

        <v-img class="mt-16" :src="qrCodeImage" height="400px" width="600px" />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="dialog = false" color="grey">Schließen</v-btn>
        <v-spacer />
        <v-btn
          color="deep-purple-darken-2"
          rounded
          variant="flat"
          @click="dialog = false"
          class="ma-2"
          href="https://informme.info/app/#/welcome?to=institution%2Fclient-demo-20&lastname=Mustermann&firstname=Max&birthdate=1978-05-22&phonenumber=%2806397%29+0769779&email=max_mustermann78%40gmail.com&forms=roentgen_fragebogen-client%2Cendoskopie-demo%2Cgespraechsbogen-client&admissionId=04775632&location=muc"
          target="_blank"
        >
          Formulare hier ausfüllen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
