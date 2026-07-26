import { defineStore } from 'pinia'
import { getMissionOrdersByOperator } from '@api/missionOrdersApi'
import { getOperatorById, getOperators, getCrews, type OperatorsFilters } from '@api/operatorsApi'
import { canAccessOperator, filterOperatorsByAccess, getScopedOperatorFilters } from '@app/access/policy'
import { useUserStore } from './userStore'
import type { Crew } from '@entities/crew/model/types'
import type { MissionOrder } from '@entities/mission-order/model/types'
import type { OperatorWithMetrics } from '@entities/operator/model/types'

export const useOperatorsStore = defineStore('operators', {
  state: () => ({
    operators: [] as OperatorWithMetrics[],
    selectedOperator: null as OperatorWithMetrics | null,
    selectedMissionOrders: [] as MissionOrder[],
    crews: [] as Crew[],
    loading: false,
    error: '',
    operatorsRequestId: 0,
  }),
  actions: {
    async loadCrews() {
      this.crews = await getCrews()
    },
    async loadOperators(filters: OperatorsFilters = {}) {
      const requestId = this.operatorsRequestId + 1
      this.operatorsRequestId = requestId
      this.loading = true
      this.error = ''
      try {
        const user = useUserStore()
        const operators = await getOperators(getScopedOperatorFilters(filters, user, this.crews))
        if (requestId === this.operatorsRequestId) {
          this.operators = filterOperatorsByAccess(operators, user, this.crews)
        }
      } catch {
        if (requestId === this.operatorsRequestId) {
          this.error = 'Operators could not be loaded.'
        }
      } finally {
        if (requestId === this.operatorsRequestId) {
          this.loading = false
        }
      }
    },
    async loadOperatorDetails(operatorId: string) {
      this.loading = true
      this.error = ''
      this.selectedOperator = null
      this.selectedMissionOrders = []
      try {
        const user = useUserStore()
        const operator = await getOperatorById(operatorId)
        if (!operator) throw new Error('Missing operator')
        if (!canAccessOperator(operator, user, this.crews)) throw new Error('Access denied')
        this.selectedOperator = operator
        this.selectedMissionOrders = await getMissionOrdersByOperator(operatorId)
      } catch {
        this.selectedOperator = null
        this.selectedMissionOrders = []
        this.error = 'Operator details are unavailable for the current access role.'
      } finally {
        this.loading = false
      }
    },
  },
})
