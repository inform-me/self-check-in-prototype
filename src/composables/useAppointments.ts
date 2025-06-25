import { ref } from 'vue'

interface InfoIcon {
  iconCode: string // Either 'mdi-[icon-name]' for Material Design icons or URL for images
  tooltip: string
  color: string // 'error' for clearly problematic, 'warning' for maybe problematic
}

interface Appointment {
  title: string
  doctor: string
  date: string
  startTimeISO: string
  durationMinutes: number
  documentsCompleted: boolean
  problemIcons?: InfoIcon[] // Array of critical condition icons
  isFlagged?: boolean // For the flagging feature
}

const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)
const twoWeeksLater = new Date()
twoWeeksLater.setDate(today.getDate() + 14)

const isXrayFormFilled = ref(false)

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const appointments = ref<Appointment[]>([
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0, 0).toISOString(),
    durationMinutes: 60,
    documentsCompleted: true,
    problemIcons: [
      { iconCode: 'mdi-baby', tooltip: 'Schwangerschaft', color: 'error' },
      { iconCode: 'mdi-alert-circle', tooltip: 'Kontrastmittelallergie', color: 'error' }
    ],
    isFlagged: false
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: isXrayFormFilled.value,
    problemIcons: [
      { iconCode: 'mdi-heart-pulse', tooltip: 'Herzschrittmacher', color: 'warning' }
    ],
    isFlagged: true
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: true,
    problemIcons: [
      { iconCode: 'mdi-baby', tooltip: 'Schwangerschaft', color: 'error' },
      { iconCode: 'mdi-alert-circle', tooltip: 'Kontrastmittelallergie', color: 'error' },
      { iconCode: 'mdi-pill', tooltip: 'Medikamentenallergie', color: 'warning' }
    ],
    isFlagged: false
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: false,
    isFlagged: false
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(today),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: false,
    problemIcons: [
      { iconCode: 'mdi-magnet', tooltip: 'Metallimplantat', color: 'error' }
    ],
    isFlagged: true
  },

  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 30, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: true,
    isFlagged: false
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0, 0, 0).toISOString(),
    durationMinutes: 75,
    documentsCompleted: false,
    isFlagged: false
  },
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 30, 0, 0).toISOString(),
    durationMinutes: 60,
    documentsCompleted: true,
    isFlagged: false
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(tomorrow),
    startTimeISO: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 45, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: false,
    isFlagged: false
  },

  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 9, 15, 0, 0).toISOString(),
    durationMinutes: 50,
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 0, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: false,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 30, 0, 0).toISOString(),
    durationMinutes: 85,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: false,
  },

  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 8, 45, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: true,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 10, 30, 0, 0).toISOString(),
    durationMinutes: 65,
    documentsCompleted: false,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 13, 15, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 15, 30, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: false,
  },

  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 9, 0, 0, 0).toISOString(),
    durationMinutes: 80,
    documentsCompleted: true,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 11, 15, 0, 0).toISOString(),
    durationMinutes: 55,
    documentsCompleted: false,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 14, 0, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 16, 45, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: false,
  },

  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 8, 30, 0, 0).toISOString(),
    durationMinutes: 60,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 10, 0, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: false,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 12, 30, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 15, 0, 0, 0).toISOString(),
    durationMinutes: 75,
    documentsCompleted: false,
  },

  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 9, 30, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 11, 45, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: false,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 14, 15, 0, 0).toISOString(),
    durationMinutes: 50,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6, 16, 30, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: false,
  },

  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 8, 45, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: true,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 10, 30, 0, 0).toISOString(),
    durationMinutes: 65,
    documentsCompleted: false,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 13, 0, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 15, 45, 0, 0).toISOString(),
    durationMinutes: 85,
    documentsCompleted: false,
  },

  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 9, 15, 0, 0).toISOString(),
    durationMinutes: 75,
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 11, 30, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: false,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 14, 0, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: true,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8, 16, 15, 0, 0).toISOString(),
    durationMinutes: 55,
    documentsCompleted: false,
  },

  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 8, 30, 0, 0).toISOString(),
    durationMinutes: 60,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 10, 45, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: false,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 13, 30, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9, 16, 0, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: false,
  },

  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 9, 0, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: true,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 11, 15, 0, 0).toISOString(),
    durationMinutes: 50,
    documentsCompleted: false,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 14, 30, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 16, 45, 0, 0).toISOString(),
    durationMinutes: 80,
    documentsCompleted: false,
  },

  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11, 8, 45, 0, 0).toISOString(),
    durationMinutes: 85,
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11, 10, 30, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: false,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11, 13, 15, 0, 0).toISOString(),
    durationMinutes: 65,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 11, 15, 30, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: false,
  },

  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12, 9, 30, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12, 11, 0, 0, 0).toISOString(),
    durationMinutes: 75,
    documentsCompleted: false,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12, 14, 15, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: true,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12, 16, 0, 0, 0).toISOString(),
    durationMinutes: 55,
    documentsCompleted: false,
  },

  {
    title: 'MRT',
    doctor: 'Dr. Müller',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13, 8, 30, 0, 0).toISOString(),
    durationMinutes: 60,
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Hoffmann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13, 10, 45, 0, 0).toISOString(),
    durationMinutes: 30,
    documentsCompleted: false,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Neumann',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13, 13, 0, 0, 0).toISOString(),
    durationMinutes: 40,
    documentsCompleted: true,
  },
  {
    title: 'Computertomographie',
    doctor: 'Dr. Weber',
    date: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13)),
    startTimeISO: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13, 15, 30, 0, 0).toISOString(),
    durationMinutes: 90,
    documentsCompleted: false,
  },

  {
    title: 'Computertomographie',
    doctor: 'Dr. Braun',
    date: formatDate(twoWeeksLater),
    startTimeISO: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate(), 9, 15, 0, 0).toISOString(),
    durationMinutes: 80,
    documentsCompleted: true,
  },
  {
    title: 'Mammographie',
    doctor: 'Dr. Fischer',
    date: formatDate(twoWeeksLater),
    startTimeISO: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate(), 11, 30, 0, 0).toISOString(),
    durationMinutes: 35,
    documentsCompleted: false,
  },
  {
    title: 'MRT',
    doctor: 'Dr. Klein',
    date: formatDate(twoWeeksLater),
    startTimeISO: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate(), 14, 0, 0, 0).toISOString(),
    durationMinutes: 50,
    documentsCompleted: true,
  },
  {
    title: 'Röntgen',
    doctor: 'Dr. Schmidt',
    date: formatDate(twoWeeksLater),
    startTimeISO: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate(), 16, 15, 0, 0).toISOString(),
    durationMinutes: 45,
    documentsCompleted: false,
  }
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
