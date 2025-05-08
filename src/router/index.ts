import { createRouter, createWebHistory } from 'vue-router'
import CardInserted from '../views/CardInserted.vue'
import InsertInsuranceCard from '../views/InsertInsuranceCard.vue'
import NoInsuranceForm from '../views/NoInsuranceForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: InsertInsuranceCard },
    { path: '/no-insurance', component: NoInsuranceForm },
    { path: '/card-inserted', component: CardInserted },
  ],
})

export default router
