import { getCrewLabel } from '@entities/crew/model/labels'
import type { Crew } from '@entities/crew/model/types'
import { SERVICE_LINES } from '@entities/mission-order/model/options'
import { getServiceLineLabel } from '@entities/mission-order/model/labels'
import { OPERATING_REGIONS, OPERATOR_ROLES, OPERATOR_STATUSES } from '@entities/operator/model/options'
import { getOperatingRegionLabel, getOperatorRoleLabel, getOperatorStatusLabel } from '@entities/operator/model/labels'
import { toSelectOptions } from '@shared/lib/selectOptions'

export const operatorOperatingRegionOptions = toSelectOptions(OPERATING_REGIONS, getOperatingRegionLabel)
export const operatorRoleOptions = toSelectOptions(OPERATOR_ROLES, getOperatorRoleLabel)
export const operatorStatusOptions = toSelectOptions(OPERATOR_STATUSES, getOperatorStatusLabel)
export const operatorServiceLineOptions = toSelectOptions(SERVICE_LINES, getServiceLineLabel)

export const getOperatorCrewOptions = (crews: Crew[]) =>
  crews.map((crew) => ({ label: getCrewLabel(crew.id, crew.name), value: crew.id }))
