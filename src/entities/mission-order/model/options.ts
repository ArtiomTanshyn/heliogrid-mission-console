import type { MissionOrderStatus, ServiceLine } from './types'

export const SERVICE_LINE = {
  SATELLITE_DEPLOYMENT: 'Satellite Deployment',
  CARGO_RESUPPLY: 'Cargo Resupply',
  ORBITAL_IMAGING: 'Orbital Imaging',
  RESEARCH_PAYLOAD: 'Research Payload',
} as const satisfies Record<string, ServiceLine>

export const MISSION_ORDER_STATUS = {
  CONFIRMED: 'confirmed',
  INCIDENT: 'incident',
  RECOVERED: 'recovered',
} as const satisfies Record<string, MissionOrderStatus>

export const SERVICE_LINES: ServiceLine[] = Object.values(SERVICE_LINE)
export const VALUE_BEARING_MISSION_ORDER_STATUSES: MissionOrderStatus[] = [
  MISSION_ORDER_STATUS.CONFIRMED,
  MISSION_ORDER_STATUS.RECOVERED,
]
