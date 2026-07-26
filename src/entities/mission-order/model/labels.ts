import type { MissionOrderStatus, ServiceLine } from './types'

export const SERVICE_LINE_LABEL: Record<ServiceLine, string> = {
  'Satellite Deployment': 'Satellite Deployment',
  'Cargo Resupply': 'Cargo Resupply',
  'Orbital Imaging': 'Orbital Imaging',
  'Research Payload': 'Research Payload',
}

export const MISSION_ORDER_STATUS_LABEL: Record<MissionOrderStatus, string> = {
  confirmed: 'confirmed',
  incident: 'incident',
  recovered: 'recovered',
}

export const getServiceLineLabel = (value: ServiceLine | string) => SERVICE_LINE_LABEL[value as ServiceLine] ?? value

export const getMissionOrderStatusLabel = (value: MissionOrderStatus | string) =>
  MISSION_ORDER_STATUS_LABEL[value as MissionOrderStatus] ?? value
