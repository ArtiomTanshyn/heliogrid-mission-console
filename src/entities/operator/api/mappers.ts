import type { Crew } from '@entities/crew/model/types'
import type { MissionOrder } from '@entities/mission-order/model/types'
import type { Operator, OperatorWithMetrics } from '../model/types'
import type { OperatorDto, CrewDto } from '@api/dto/operatorDto'
import { calculateOperatorPerformance } from '../model/performance'

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export const mapOperatorDtoToOperator = (operator: OperatorDto): Operator => ({
  id: operator.id,
  name: operator.operator_name,
  email: operator.email,
  operatingRegion: operator.operating_region,
  role: operator.role,
  crewId: operator.crew_id,
  crewLeadId: operator.crew_lead_id,
  status: operator.status,
  avatarUrl: operator.avatar_url ?? '',
  initials: getInitials(operator.operator_name),
  joinedAt: operator.joined_at,
})

export const mapOperatorDtosToOperators = (operators: OperatorDto[]) => operators.map(mapOperatorDtoToOperator)

export const mapCrewDtoToCrew = (crew: CrewDto): Crew => ({
  id: crew.id,
  name: crew.name,
  operatingRegion: crew.operating_region,
  leadOperatorId: crew.lead_operator_id,
})

export const mapCrewDtosToCrews = (crews: CrewDto[]) => crews.map(mapCrewDtoToCrew)

export const mapOperatorDtoToOperatorWithMetrics = (
  operatorDto: OperatorDto,
  crews: Crew[],
  missionOrders: MissionOrder[],
): OperatorWithMetrics => {
  const operator = mapOperatorDtoToOperator(operatorDto)

  return {
    ...operator,
    crewName: crews.find((crew) => crew.id === operator.crewId)?.name ?? 'Unassigned Crew',
    metrics: calculateOperatorPerformance(operator.id, missionOrders),
  }
}
