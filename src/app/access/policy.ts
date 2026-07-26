import type { Crew } from '@entities/crew/model/types'
import type { OperatorWithMetrics } from '@entities/operator/model/types'
import { USER_ROLE } from './model/roles'
import type { UserRole } from './model/types'

export interface AccessContext {
  role: UserRole
  crewLeadOperatorId: string
  currentOperatorId: string
}

export const canExportLedger = (access: Pick<AccessContext, 'role'>) => access.role === USER_ROLE.ADMIN

export const canSeeMissionValue = (access: Pick<AccessContext, 'role'>) => access.role === USER_ROLE.ADMIN

export const getCrewLeadCrew = (access: Pick<AccessContext, 'crewLeadOperatorId'>, crews: Crew[]) =>
  crews.find((crew) => crew.leadOperatorId === access.crewLeadOperatorId)

export const getScopedOperatorFilters = <T extends { crewId?: string }>(
  filters: T,
  access: AccessContext,
  crews: Crew[],
): T => {
  if (access.role !== USER_ROLE.CREW_LEAD) return filters

  return {
    ...filters,
    crewId: getCrewLeadCrew(access, crews)?.id,
  }
}

export const filterOperatorsByAccess = <T extends { id: string; crewId?: string }>(
  operators: T[],
  access: AccessContext,
  crews: Crew[] = [],
) => {
  if (access.role === USER_ROLE.CREW_LEAD) {
    const crewId = getCrewLeadCrew(access, crews)?.id
    if (!crewId) return []

    return operators.filter((operator) => operator.crewId === crewId)
  }

  if (access.role !== USER_ROLE.OPERATOR) return operators

  return operators.filter((operator) => operator.id === access.currentOperatorId)
}

export const canAccessOperator = (operator: OperatorWithMetrics, access: AccessContext, crews: Crew[]) => {
  if (access.role === USER_ROLE.OPERATOR) {
    return operator.id === access.currentOperatorId
  }

  if (access.role === USER_ROLE.CREW_LEAD) {
    return operator.crewId === getCrewLeadCrew(access, crews)?.id
  }

  return true
}
