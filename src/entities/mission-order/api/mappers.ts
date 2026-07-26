import type { MissionOrder } from '../model/types'
import type { MissionOrderDto } from '@api/dto/missionOrderDto'

export const mapMissionOrderDtoToMissionOrder = (missionOrder: MissionOrderDto): MissionOrder => ({
  id: missionOrder.id,
  operatorId: missionOrder.operator_id,
  serviceLine: missionOrder.service_line,
  missionValue: missionOrder.mission_value,
  opsCredit: missionOrder.ops_credit,
  status: missionOrder.status,
  createdAt: missionOrder.created_at,
})

export const mapMissionOrderDtosToMissionOrders = (missionOrders: MissionOrderDto[]) =>
  missionOrders.map(mapMissionOrderDtoToMissionOrder)
