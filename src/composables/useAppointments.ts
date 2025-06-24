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
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: false,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: false,
  },
  
  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 30, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0, 0, 0).toISOString(),
    durationMinutes: 75,
    documentsCompleted: false,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 30, 0, 0).toISOString(),
    durationMinutes: 60,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 45, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: false,
  },
  
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 15, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 10, 0, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: false,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 14, 30, 0, 0).toISOString(),
    durationMinutes: 50,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 12, 0, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: false,
  },
  
  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 11, 30, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 16, 15, 0, 0).toISOString(),
    durationMinutes: 85,
    documentsCompleted: false,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 8, 45, 0, 0).toISOString(),
    durationMinutes: 55,
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
