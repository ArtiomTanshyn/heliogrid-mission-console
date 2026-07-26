import type { MissionOrderStatus, ServiceLine } from '@entities/mission-order/model/types'

export interface MissionOrderDto {
  id: string
  operator_id: string
  service_line: ServiceLine
  mission_value: number
  ops_credit: number
  status: MissionOrderStatus
  created_at: string
}
