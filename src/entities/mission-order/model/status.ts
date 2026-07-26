import { MISSION_ORDER_STATUS } from './options'
import { TAG_SEVERITY, type TagSeverity } from '@shared/ui/primevue'
import type { MissionOrderStatus } from './types'

export const MISSION_ORDER_STATUS_SEVERITY: Record<MissionOrderStatus, TagSeverity> = {
  [MISSION_ORDER_STATUS.CONFIRMED]: TAG_SEVERITY.SUCCESS,
  [MISSION_ORDER_STATUS.INCIDENT]: TAG_SEVERITY.DANGER,
  [MISSION_ORDER_STATUS.RECOVERED]: TAG_SEVERITY.WARN,
}

export const getMissionOrderStatusSeverity = (status: MissionOrderStatus) => MISSION_ORDER_STATUS_SEVERITY[status]
