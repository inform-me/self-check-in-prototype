import { ref } from 'vue'

const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)
const twoWeeksLater = new Date()
twoWeeksLater.setDate(today.getDate() + 14)

const isXrayFormFilled = ref(false)

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const appointments = ref([
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0, 0).toISOString(),
    durationMinutes: 60,
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: isXrayFormFilled.value,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(twoWeeksLater),
    startTimeISO: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate(), 11, 15, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: false,
  },
])

export function useAppointments() {
  const fillXrayForm = () => {
    isXrayFormFilled.value = true
    const xrayAppointment = appointments.value.find(
      (appt) => appt.title === 'Röntgen' && appt.date === formatDate(today),
    )
    if (xrayAppointment) {
      xrayAppointment.documentsCompleted = true
    }
  }

  return {
    appointments,
    isXrayFormFilled,
    formatDate,
    fillXrayForm,
  }
}
