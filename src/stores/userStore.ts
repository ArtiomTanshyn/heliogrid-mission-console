import { defineStore } from 'pinia'
import { USER_ROLE } from '@app/access/model/roles'
import type { UserRole } from '@app/access/model/types'
import { canExportLedger, canSeeMissionValue } from '@app/access/policy'

export const useUserStore = defineStore('user', {
  state: () => ({
    role: USER_ROLE.ADMIN as UserRole,
    crewLeadOperatorId: 'operator-002',
    currentOperatorId: 'operator-001',
  }),
  getters: {
    canExport: (state) => canExportLedger(state),
    canSeeMissionValue: (state) => canSeeMissionValue(state),
  },
  actions: {
    setRole(role: UserRole) {
      this.role = role
    },
  },
})
