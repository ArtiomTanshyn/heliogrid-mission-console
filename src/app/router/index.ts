import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'

const DashboardPage = () => import('../../pages/DashboardPage.vue')
const OperatorsPage = () => import('../../pages/OperatorsPage.vue')
const OperatorDetailsPage = () => import('../../pages/OperatorDetailsPage.vue')
const LedgerPage = () => import('../../pages/LedgerPage.vue')
const SettingsPage = () => import('../../pages/SettingsPage.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', name: 'dashboard', component: DashboardPage },
        { path: 'operators', name: 'operators', component: OperatorsPage },
        { path: 'operators/:id', name: 'operator-details', component: OperatorDetailsPage },
        { path: 'ledger', name: 'ledger', component: LedgerPage },
        { path: 'settings', name: 'settings', component: SettingsPage },
      ],
    },
  ],
})
