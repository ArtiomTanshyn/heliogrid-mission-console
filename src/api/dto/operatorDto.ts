import type { Crew } from '@entities/crew/model/types'
import type { OperatingRegion, OperatorRole, OperatorStatus } from '@entities/operator/model/types'

export interface OperatorDto {
  id: string
  operator_name: string
  email: string
  operating_region: OperatingRegion
  role: OperatorRole
  crew_id: string
  crew_lead_id: string | null
  status: OperatorStatus
  avatar_url: string | null
  joined_at: string
}

export interface CrewDto {
  id: string
  name: string
  operating_region: Crew['operatingRegion']
  lead_operator_id: string
}
