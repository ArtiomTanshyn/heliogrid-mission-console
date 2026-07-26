import { defineStore } from 'pinia'
import { generateLedger } from '@api/ledgerApi'
import { useUserStore } from './userStore'
import type { LedgerFilters, LedgerRow } from '@entities/ledger/model/types'

export const useLedgerStore = defineStore('ledger', {
  state: () => ({
    rows: [] as LedgerRow[],
    loading: false,
    error: '',
  }),
  actions: {
    async generate(filters: LedgerFilters) {
      this.loading = true
      this.error = ''
      try {
        const user = useUserStore()
        this.rows = await generateLedger(filters, user)
      } catch {
        this.error = 'Ledger could not be generated.'
      } finally {
        this.loading = false
      }
    },
  },
})
