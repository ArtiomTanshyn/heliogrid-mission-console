import { getCrews, getOperators } from './operatorsApi'
import { filterOperatorsByAccess, getScopedOperatorFilters, type AccessContext } from '@app/access/policy'
import type { LedgerFilters, LedgerRow } from '@entities/ledger/model/types'

export async function generateLedger(filters: LedgerFilters, access?: AccessContext): Promise<LedgerRow[]> {
  const crews = access ? await getCrews() : []
  const scopedFilters = access ? getScopedOperatorFilters(filters, access, crews) : filters
  const operators = await getOperators(scopedFilters)
  const scopedOperators = access ? filterOperatorsByAccess(operators, access, crews) : operators

  return scopedOperators.map((operator) => ({
    operatorId: operator.id,
    operatorName: operator.name,
    crewName: operator.crewName,
    operatingRegion: operator.operatingRegion,
    role: operator.role,
    missionOrders: operator.metrics.totalMissionOrders,
    missionValue: operator.metrics.totalMissionValue,
    opsCredit: operator.metrics.totalOpsCredit,
    reliabilityRate: operator.metrics.reliabilityRate,
    incidentRate: operator.metrics.incidentRate,
    missionScore: operator.metrics.missionScore,
  }))
}
