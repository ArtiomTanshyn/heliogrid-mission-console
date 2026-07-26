import type { ServiceLine } from '@entities/mission-order/model/types'
import type { OperatingRegion, OperatorRole } from '@entities/operator/model/types'

export interface LedgerFilters {
  from?: string
  to?: string
  operatingRegion?: OperatingRegion | ''
  crewId?: string
  role?: OperatorRole | ''
  serviceLine?: ServiceLine | ''
}

export interface LedgerRow {
  operatorId: string
  operatorName: string
  crewName: string
  operatingRegion: OperatingRegion
  role: OperatorRole
  missionOrders: number
  missionValue: number
  opsCredit: number
  reliabilityRate: number
  incidentRate: number
  missionScore: number
}
