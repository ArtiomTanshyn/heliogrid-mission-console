import { defineStore } from 'pinia'
import { getDashboardSummary } from '@api/dashboardApi'
import { useUserStore } from './userStore'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summary: null as Awaited<ReturnType<typeof getDashboardSummary>> | null,
    loading: false,
    error: '',
  }),
  actions: {
    async loadDashboard() {
      this.loading = true
      this.error = ''
      try {
        const user = useUserStore()
        this.summary = await getDashboardSummary(user)
      } catch {
        this.error = 'Mission performance could not be loaded.'
      } finally {
        this.loading = false
      }
    },
  },
})
