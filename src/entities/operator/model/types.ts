export type OperatingRegion = 'Low Earth Orbit' | 'Lunar Corridor' | 'Mars Relay' | 'Deep Space Network'
export type OperatorRole = 'Field Operator' | 'Crew Lead' | 'Mission Strategist' | 'Flight Director'
export type OperatorStatus = 'ready' | 'paused' | 'onboarding'

export interface Operator {
  id: string
  name: string
  email: string
  operatingRegion: OperatingRegion
  role: OperatorRole
  crewId: string
  crewLeadId: string | null
  status: OperatorStatus
  avatarUrl: string
  initials: string
  joinedAt: string
}

export interface OperatorPerformance {
  operatorId: string
  totalMissionOrders: number
  activeMissionOrders: number
  totalMissionValue: number
  totalOpsCredit: number
  incidentCount: number
  incidentRate: number
  reliabilityRate: number
  readinessRate: number
  missionScore: number
  valueContributionScore: number
  incidentPenalty: number
}

export interface OperatorWithMetrics extends Operator {
  crewName: string
  metrics: OperatorPerformance
}
