import { getCrewLabel } from '@entities/crew/model/labels'
import type { Crew } from '@entities/crew/model/types'
import { SERVICE_LINES } from '@entities/mission-order/model/options'
import { getServiceLineLabel } from '@entities/mission-order/model/labels'
import { OPERATING_REGIONS, OPERATOR_ROLES } from '@entities/operator/model/options'
import { getOperatingRegionLabel, getOperatorRoleLabel } from '@entities/operator/model/labels'
import { toSelectOptions } from '@shared/lib/selectOptions'

export const ledgerOperatingRegionOptions = toSelectOptions(OPERATING_REGIONS, getOperatingRegionLabel)
export const ledgerOperatorRoleOptions = toSelectOptions(OPERATOR_ROLES, getOperatorRoleLabel)
export const ledgerServiceLineOptions = toSelectOptions(SERVICE_LINES, getServiceLineLabel)

export const getLedgerCrewOptions = (crews: Crew[]) =>
  crews.map((crew) => ({ label: getCrewLabel(crew.id, crew.name), value: crew.id }))
