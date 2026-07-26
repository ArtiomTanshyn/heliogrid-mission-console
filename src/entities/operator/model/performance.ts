import type { MissionOrder } from '@entities/mission-order/model/types'
import { isValueMissionOrder } from '@entities/mission-order/model/analytics'
import { MISSION_ORDER_STATUS } from '@entities/mission-order/model/options'
import type { OperatorPerformance } from './types'

export function calculateOperatorPerformance(operatorId: string, missionOrders: MissionOrder[]): OperatorPerformance {
  const operatorMissionOrders = missionOrders.filter((missionOrder) => missionOrder.operatorId === operatorId)
  const totalMissionOrders = operatorMissionOrders.length
  const valueMissionOrders = operatorMissionOrders.filter(isValueMissionOrder)
  const activeMissionOrders = valueMissionOrders.length
  const incidentCount = operatorMissionOrders.filter(
    (missionOrder) => missionOrder.status === MISSION_ORDER_STATUS.INCIDENT,
  ).length
  const totalMissionValue = valueMissionOrders.reduce((sum, missionOrder) => sum + missionOrder.missionValue, 0)
  const totalOpsCredit = valueMissionOrders.reduce((sum, missionOrder) => sum + missionOrder.opsCredit, 0)
  const incidentRate = totalMissionOrders ? (incidentCount / totalMissionOrders) * 100 : 0
  const reliabilityRate = totalMissionOrders ? (activeMissionOrders / totalMissionOrders) * 100 : 0
  const readinessRate = Math.min(45 + activeMissionOrders * 2.8 + totalMissionValue / 8000, 96)
  const valueContributionScore = Math.min((totalMissionValue / 100000) * 100, 100)
  const incidentPenalty = 100 - incidentRate
  const missionScore =
    valueContributionScore * 0.4 + reliabilityRate * 0.3 + readinessRate * 0.2 + incidentPenalty * 0.1

  return {
    operatorId,
    totalMissionOrders,
    activeMissionOrders,
    totalMissionValue,
    totalOpsCredit,
    incidentCount,
    incidentRate,
    reliabilityRate,
    readinessRate,
    missionScore,
    valueContributionScore,
    incidentPenalty,
  }
}
