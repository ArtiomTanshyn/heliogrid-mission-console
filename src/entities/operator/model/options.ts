import type { OperatingRegion, OperatorRole, OperatorStatus } from './types'

export const OPERATING_REGION = {
  LOW_EARTH_ORBIT: 'Low Earth Orbit',
  LUNAR_CORRIDOR: 'Lunar Corridor',
  MARS_RELAY: 'Mars Relay',
  DEEP_SPACE_NETWORK: 'Deep Space Network',
} as const satisfies Record<string, OperatingRegion>

export const OPERATOR_ROLE = {
  FIELD_OPERATOR: 'Field Operator',
  CREW_LEAD: 'Crew Lead',
  MISSION_STRATEGIST: 'Mission Strategist',
  FLIGHT_DIRECTOR: 'Flight Director',
} as const satisfies Record<string, OperatorRole>

export const OPERATOR_STATUS = {
  READY: 'ready',
  PAUSED: 'paused',
  ONBOARDING: 'onboarding',
} as const satisfies Record<string, OperatorStatus>

export const CREW_REGION = {
  LOW_EARTH_ORBIT: OPERATING_REGION.LOW_EARTH_ORBIT,
  LUNAR_CORRIDOR: OPERATING_REGION.LUNAR_CORRIDOR,
  MARS_RELAY: OPERATING_REGION.MARS_RELAY,
  DEEP_SPACE_NETWORK: OPERATING_REGION.DEEP_SPACE_NETWORK,
} as const satisfies Record<string, OperatingRegion>

export const OPERATING_REGIONS: OperatingRegion[] = Object.values(OPERATING_REGION)
export const OPERATOR_ROLES: OperatorRole[] = Object.values(OPERATOR_ROLE)
export const OPERATOR_STATUSES: OperatorStatus[] = Object.values(OPERATOR_STATUS)
export const CREW_REGIONS = Object.values(CREW_REGION)
