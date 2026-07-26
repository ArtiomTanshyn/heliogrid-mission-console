import { describe, expect, it } from 'vitest'
import type { MissionOrderDto } from '@api/dto/missionOrderDto'
import { mapMissionOrderDtoToMissionOrder } from './mappers'

describe('mission order mappers', () => {
  it('maps backend-like snake_case DTO fields into the domain model', () => {
    const dto: MissionOrderDto = {
      id: 'mission-001',
      operator_id: 'operator-001',
      service_line: 'Cargo Resupply',
      mission_value: 42000,
      ops_credit: 4200,
      status: 'recovered',
      created_at: '2026-03-15T00:00:00.000Z',
    }

    expect(mapMissionOrderDtoToMissionOrder(dto)).toEqual({
      id: 'mission-001',
      operatorId: 'operator-001',
      serviceLine: 'Cargo Resupply',
      missionValue: 42000,
      opsCredit: 4200,
      status: 'recovered',
      createdAt: '2026-03-15T00:00:00.000Z',
    })
  })
})
