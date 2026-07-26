import type { OperatingRegion, OperatorRole, OperatorStatus } from './types'

export const OPERATING_REGION_LABEL: Record<OperatingRegion, string> = {
  'Low Earth Orbit': 'Low Earth Orbit',
  'Lunar Corridor': 'Lunar Corridor',
  'Mars Relay': 'Mars Relay',
  'Deep Space Network': 'Deep Space Network',
}

export const OPERATOR_ROLE_LABEL: Record<OperatorRole, string> = {
  'Field Operator': 'Field Operator',
  'Crew Lead': 'Crew Lead',
  'Mission Strategist': 'Mission Strategist',
  'Flight Director': 'Flight Director',
}

export const OPERATOR_STATUS_LABEL: Record<OperatorStatus, string> = {
  ready: 'ready',
  paused: 'paused',
  onboarding: 'onboarding',
}

export const getOperatingRegionLabel = (value: OperatingRegion | string) =>
  OPERATING_REGION_LABEL[value as OperatingRegion] ?? value

export const getOperatorRoleLabel = (value: OperatorRole | string) =>
  OPERATOR_ROLE_LABEL[value as OperatorRole] ?? value

export const getOperatorStatusLabel = (value: OperatorStatus | string) =>
  OPERATOR_STATUS_LABEL[value as OperatorStatus] ?? value
