import DonePage from '@/views/DonePage.vue'
import GoToReception from '@/views/GoToReception.vue'
import MyAppointments from '@/views/MyAppointments.vue'
import CalendarView from '@/views/CalendarView.vue'
import UploadDocuments from '@/views/UploadDocuments.vue'
import RadiologyDataView from '@/views/RadiologyDataView.vue'
import ReportingPage from '@/views/ReportingPage.vue'
import SmartReportingEditorView from '@/views/SmartReportingEditorView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CheckPersonalData from '../views/CheckPersonalData.vue'
import InsertInsuranceCard from '../views/InsertInsuranceCard.vue'
import NoInsuranceForm from '../views/PersonalDataForm.vue'
import VisitReason from '../views/VisitReason.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: InsertInsuranceCard },
    { path: '/no-insurance', component: NoInsuranceForm },
    { path: '/check-personal-data', component: CheckPersonalData },
    { path: '/visit-reason', component: VisitReason },
    { path: '/go-to-reception', component: GoToReception },
    { path: '/appointments', component: MyAppointments },
    { path: '/calendar', component: CalendarView },
    { path: '/upload-documents', component: UploadDocuments },
    { path: '/radiology-data', component: RadiologyDataView },
    { path: '/reporting', component: ReportingPage },
    { path: '/smart-reporting', component: SmartReportingEditorView },
    { path: '/done', component: DonePage },
  ],
})

export default router
