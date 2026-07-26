import { delayed } from './mockApi'
import { mapMissionOrderDtosToMissionOrders } from '@entities/mission-order/api/mappers'
import { mockMissionOrders } from '@mock/missionOrders'

export async function getMissionOrdersByOperator(operatorId: string) {
  return delayed(() =>
    mapMissionOrderDtosToMissionOrders(mockMissionOrders)
      .filter((missionOrder) => missionOrder.operatorId === operatorId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  )
}

export async function getMissionOrders() {
  return delayed(() => mapMissionOrderDtosToMissionOrders(mockMissionOrders))
}
