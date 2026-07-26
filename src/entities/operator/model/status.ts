import { OPERATOR_STATUS } from './options'
import { TAG_SEVERITY, type TagSeverity } from '@shared/ui/primevue'
import type { OperatorStatus } from './types'

export const OPERATOR_STATUS_SEVERITY: Record<OperatorStatus, TagSeverity> = {
  [OPERATOR_STATUS.READY]: TAG_SEVERITY.SUCCESS,
  [OPERATOR_STATUS.PAUSED]: TAG_SEVERITY.DANGER,
  [OPERATOR_STATUS.ONBOARDING]: TAG_SEVERITY.WARN,
}

export const getOperatorStatusSeverity = (status: OperatorStatus) => OPERATOR_STATUS_SEVERITY[status]
