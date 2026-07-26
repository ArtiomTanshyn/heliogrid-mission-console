import { delayed } from './mockApi'
import { mapMissionOrderDtosToMissionOrders } from '@entities/mission-order/api/mappers'
import {
  groupIncidentsByMonth,
  groupMissionOrdersByServiceLine,
  groupMissionValueByMonth,
  isValueMissionOrder,
} from '@entities/mission-order/model/analytics'
import { MISSION_ORDER_STATUS } from '@entities/mission-order/model/options'
import { calculateOperatorPerformance } from '@entities/operator/model/performance'
import { mapCrewDtosToCrews, mapOperatorDtosToOperators } from '@entities/operator/api/mappers'
import { OPERATOR_STATUS } from '@entities/operator/model/options'
import { mockCrews } from '@mock/crews'
import { mockMissionOrders } from '@mock/missionOrders'
import { mockOperators } from '@mock/operators'
import { filterOperatorsByAccess, type AccessContext } from '@app/access/policy'

export async function getDashboardSummary(access?: AccessContext) {
  return delayed(() => {
    const crews = mapCrewDtosToCrews(mockCrews)
    const allOperators = mapOperatorDtosToOperators(mockOperators)
    const operators = access ? filterOperatorsByAccess(allOperators, access, crews) : allOperators
    const operatorIds = new Set(operators.map((operator) => operator.id))
    const missionOrders = mapMissionOrderDtosToMissionOrders(mockMissionOrders).filter((missionOrder) =>
      operatorIds.has(missionOrder.operatorId),
    )
    const operatorMetrics = operators.map((operator) => calculateOperatorPerformance(operator.id, missionOrders))
    const valueMissionOrders = missionOrders.filter(isValueMissionOrder)
    const totalMissionOrders = missionOrders.length
    const incidents = missionOrders.filter(
      (missionOrder) => missionOrder.status === MISSION_ORDER_STATUS.INCIDENT,
    ).length
    const top = operatorMetrics.reduce(
      (best, item) => (!best || item.missionScore > best.missionScore ? item : best),
      undefined as (typeof operatorMetrics)[number] | undefined,
    )
    const topOperator = top ? operators.find((operator) => operator.id === top.operatorId) : null

    return {
      totalMissionValue: valueMissionOrders.reduce((sum, missionOrder) => sum + missionOrder.missionValue, 0),
      totalOpsCredit: valueMissionOrders.reduce((sum, missionOrder) => sum + missionOrder.opsCredit, 0),
      readyOperators: operators.filter((operator) => operator.status === OPERATOR_STATUS.READY).length,
      averageReliability: operatorMetrics.length
        ? operatorMetrics.reduce((sum, item) => sum + item.reliabilityRate, 0) / operatorMetrics.length
        : 0,
      incidentRate: totalMissionOrders ? (incidents / totalMissionOrders) * 100 : 0,
      topOperator: topOperator?.name ?? 'N/A',
      charts: {
        missionValueByMonth: groupMissionValueByMonth(missionOrders),
        missionOrdersByServiceLine: groupMissionOrdersByServiceLine(missionOrders),
        incidentTrend: groupIncidentsByMonth(missionOrders),
        performanceByRole: operators.reduce<Record<string, number[]>>((acc, operator) => {
          const score = operatorMetrics.find((item) => item.operatorId === operator.id)?.missionScore ?? 0
          acc[operator.role] = [...(acc[operator.role] ?? []), score]
          return acc
        }, {}),
      },
    }
  })
}
