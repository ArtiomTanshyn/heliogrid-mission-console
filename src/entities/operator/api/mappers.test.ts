import { describe, expect, it } from 'vitest'
import { SERVICE_LINE } from '@entities/mission-order/model/options'
import type { MissionOrder } from '@entities/mission-order/model/types'
import type { CrewDto, OperatorDto } from '@api/dto/operatorDto'
import { mapCrewDtoToCrew, mapOperatorDtoToOperator, mapOperatorDtoToOperatorWithMetrics } from './mappers'

const operatorDto: OperatorDto = {
  id: 'operator-001',
  operator_name: 'Astra Vey',
  email: 'astra.vey@heliogrid.demo',
  operating_region: 'Lunar Corridor',
  role: 'Field Operator',
  crew_id: 'crew-aurora',
  crew_lead_id: 'operator-002',
  status: 'ready',
  avatar_url: null,
  joined_at: '2026-01-05T00:00:00.000Z',
}

const crewDto: CrewDto = {
  id: 'crew-aurora',
  name: 'Aurora Crew',
  operating_region: 'Lunar Corridor',
  lead_operator_id: 'operator-002',
}

const missionOrder = (overrides: Partial<MissionOrder>): MissionOrder => ({
  id: 'mission-001',
  operatorId: 'operator-001',
  serviceLine: SERVICE_LINE.RESEARCH_PAYLOAD,
  missionValue: 10000,
  opsCredit: 1000,
  status: 'confirmed',
  createdAt: '2026-01-10T00:00:00.000Z',
  ...overrides,
})

describe('operator mappers', () => {
  it('maps operator DTO fields and derives initials', () => {
    expect(mapOperatorDtoToOperator(operatorDto)).toEqual({
      id: 'operator-001',
      name: 'Astra Vey',
      email: 'astra.vey@heliogrid.demo',
      operatingRegion: 'Lunar Corridor',
      role: 'Field Operator',
      crewId: 'crew-aurora',
      crewLeadId: 'operator-002',
      status: 'ready',
      avatarUrl: '',
      initials: 'AV',
      joinedAt: '2026-01-05T00:00:00.000Z',
    })
  })

  it('maps crew DTO fields', () => {
    expect(mapCrewDtoToCrew(crewDto)).toEqual({
      id: 'crew-aurora',
      name: 'Aurora Crew',
      operatingRegion: 'Lunar Corridor',
      leadOperatorId: 'operator-002',
    })
  })

  it('enriches operators with crew names and metrics', () => {
    const operator = mapOperatorDtoToOperatorWithMetrics(
      operatorDto,
      [mapCrewDtoToCrew(crewDto)],
      [
        missionOrder({ id: 'mission-001', missionValue: 20000, opsCredit: 2000 }),
        missionOrder({ id: 'mission-002', status: 'incident', missionValue: 50000, opsCredit: 5000 }),
      ],
    )

    expect(operator.crewName).toBe('Aurora Crew')
    expect(operator.metrics.totalMissionOrders).toBe(2)
    expect(operator.metrics.totalMissionValue).toBe(20000)
    expect(operator.metrics.incidentCount).toBe(1)
  })
})
