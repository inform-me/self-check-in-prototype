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
  ],
})

export default router
