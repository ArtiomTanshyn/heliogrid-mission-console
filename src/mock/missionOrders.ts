import { MISSION_ORDER_STATUS, SERVICE_LINE, SERVICE_LINES } from '@entities/mission-order/model/options'
import { mockOperators } from './operators'
import type { MissionOrderDto } from '@api/dto/missionOrderDto'
import type { MissionOrderStatus, ServiceLine } from '@entities/mission-order/model/types'

const GENERATED_MISSION_COUNT = 468

const toIsoDate = (year: number, month: number, day: number) => new Date(Date.UTC(year, month - 1, day)).toISOString()

const missionOperators = mockOperators.filter((operator) => operator.id !== 'operator-047')

const valueRanges: Record<ServiceLine, { min: number; max: number }> = {
  [SERVICE_LINE.SATELLITE_DEPLOYMENT]: { min: 35000, max: 120000 },
  [SERVICE_LINE.CARGO_RESUPPLY]: { min: 18000, max: 65000 },
  [SERVICE_LINE.ORBITAL_IMAGING]: { min: 8000, max: 35000 },
  [SERVICE_LINE.RESEARCH_PAYLOAD]: { min: 12000, max: 55000 },
}

const getMissionStatus = (index: number, operatorId: string): MissionOrderStatus => {
  if (operatorId === 'operator-016') return MISSION_ORDER_STATUS.CONFIRMED
  if (operatorId === 'operator-005' && index % 3 === 0) return MISSION_ORDER_STATUS.INCIDENT

  const bucket = index % 20

  if (bucket < 14) return MISSION_ORDER_STATUS.CONFIRMED
  if (bucket < 18) return MISSION_ORDER_STATUS.RECOVERED

  return MISSION_ORDER_STATUS.INCIDENT
}

const getMissionValue = (serviceLine: ServiceLine, index: number, operatorId: string) => {
  const { min, max } = valueRanges[serviceLine]
  const spread = max - min

  if (operatorId === 'operator-016') return max - (index % 5) * 900
  if (operatorId === 'operator-005') return min + (index % 6) * 700

  return min + ((index * 7919 + Number(operatorId.slice(-3)) * 389) % (spread + 1))
}

const getOpsCredit = (missionValue: number, index: number) => Math.round(missionValue * (0.07 + (index % 6) * 0.01))

const generatedMissions: MissionOrderDto[] = Array.from({ length: GENERATED_MISSION_COUNT }, (_, index) => {
  const operator = missionOperators[index % missionOperators.length]
  const serviceLine = SERVICE_LINES[index % SERVICE_LINES.length]
  const missionValue = getMissionValue(serviceLine, index, operator.id)
  const month = (Math.floor(index / SERVICE_LINES.length) % 12) + 1
  const year = index < GENERATED_MISSION_COUNT / 2 ? 2025 : 2026

  return {
    id: `mission-${String(index + 1).padStart(4, '0')}`,
    operator_id: operator.id,
    service_line: serviceLine,
    mission_value: missionValue,
    ops_credit: getOpsCredit(missionValue, index),
    status: getMissionStatus(index, operator.id),
    created_at: toIsoDate(year, month, 1 + (index % 26)),
  }
})

const scenarioMissions: MissionOrderDto[] = [
  {
    id: 'mission-scenario-001',
    operator_id: 'operator-001',
    service_line: SERVICE_LINE.RESEARCH_PAYLOAD,
    mission_value: 52000,
    ops_credit: 5720,
    status: MISSION_ORDER_STATUS.CONFIRMED,
    created_at: toIsoDate(2026, 7, 12),
  },
  {
    id: 'mission-scenario-002',
    operator_id: 'operator-016',
    service_line: SERVICE_LINE.SATELLITE_DEPLOYMENT,
    mission_value: 118000,
    ops_credit: 12980,
    status: MISSION_ORDER_STATUS.CONFIRMED,
    created_at: toIsoDate(2026, 8, 4),
  },
  {
    id: 'mission-scenario-003',
    operator_id: 'operator-016',
    service_line: SERVICE_LINE.CARGO_RESUPPLY,
    mission_value: 64000,
    ops_credit: 7040,
    status: MISSION_ORDER_STATUS.CONFIRMED,
    created_at: toIsoDate(2026, 8, 18),
  },
  {
    id: 'mission-scenario-004',
    operator_id: 'operator-016',
    service_line: SERVICE_LINE.SATELLITE_DEPLOYMENT,
    mission_value: 112000,
    ops_credit: 12320,
    status: MISSION_ORDER_STATUS.RECOVERED,
    created_at: toIsoDate(2025, 11, 20),
  },
  {
    id: 'mission-scenario-005',
    operator_id: 'operator-005',
    service_line: SERVICE_LINE.ORBITAL_IMAGING,
    mission_value: 12000,
    ops_credit: 840,
    status: MISSION_ORDER_STATUS.INCIDENT,
    created_at: toIsoDate(2026, 3, 8),
  },
  {
    id: 'mission-scenario-006',
    operator_id: 'operator-005',
    service_line: SERVICE_LINE.CARGO_RESUPPLY,
    mission_value: 21000,
    ops_credit: 1680,
    status: MISSION_ORDER_STATUS.INCIDENT,
    created_at: toIsoDate(2025, 9, 16),
  },
  {
    id: 'mission-scenario-007',
    operator_id: 'operator-005',
    service_line: SERVICE_LINE.RESEARCH_PAYLOAD,
    mission_value: 14500,
    ops_credit: 1160,
    status: MISSION_ORDER_STATUS.INCIDENT,
    created_at: toIsoDate(2026, 4, 22),
  },
  {
    id: 'mission-scenario-008',
    operator_id: 'operator-047',
    service_line: SERVICE_LINE.RESEARCH_PAYLOAD,
    mission_value: 15000,
    ops_credit: 1200,
    status: MISSION_ORDER_STATUS.CONFIRMED,
    created_at: toIsoDate(2026, 6, 5),
  },
  {
    id: 'mission-scenario-009',
    operator_id: 'operator-031',
    service_line: SERVICE_LINE.SATELLITE_DEPLOYMENT,
    mission_value: 72000,
    ops_credit: 7200,
    status: MISSION_ORDER_STATUS.RECOVERED,
    created_at: toIsoDate(2025, 5, 15),
  },
  {
    id: 'mission-scenario-010',
    operator_id: 'operator-027',
    service_line: SERVICE_LINE.CARGO_RESUPPLY,
    mission_value: 61000,
    ops_credit: 6710,
    status: MISSION_ORDER_STATUS.CONFIRMED,
    created_at: toIsoDate(2025, 12, 9),
  },
  {
    id: 'mission-scenario-011',
    operator_id: 'operator-023',
    service_line: SERVICE_LINE.ORBITAL_IMAGING,
    mission_value: 28000,
    ops_credit: 2800,
    status: MISSION_ORDER_STATUS.RECOVERED,
    created_at: toIsoDate(2025, 10, 3),
  },
  {
    id: 'mission-scenario-012',
    operator_id: 'operator-038',
    service_line: SERVICE_LINE.ORBITAL_IMAGING,
    mission_value: 33000,
    ops_credit: 3300,
    status: MISSION_ORDER_STATUS.CONFIRMED,
    created_at: toIsoDate(2026, 2, 11),
  },
]

export const mockMissionOrders: MissionOrderDto[] = [...generatedMissions, ...scenarioMissions]
