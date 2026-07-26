import { describe, expect, it } from 'vitest'
import { SERVICE_LINE } from '@entities/mission-order/model/options'
import type { MissionOrder } from '@entities/mission-order/model/types'
import { calculateOperatorPerformance } from './performance'

const missionOrder = (overrides: Partial<MissionOrder>): MissionOrder => ({
  id: 'mission-001',
  operatorId: 'operator-001',
  serviceLine: SERVICE_LINE.SATELLITE_DEPLOYMENT,
  missionValue: 0,
  opsCredit: 0,
  status: 'confirmed',
  createdAt: '2026-01-15T00:00:00.000Z',
  ...overrides,
})

describe('calculateOperatorPerformance', () => {
  it('calculates value-bearing metrics and ignores other operators', () => {
    const performance = calculateOperatorPerformance('operator-001', [
      missionOrder({ id: 'mission-001', missionValue: 100000, opsCredit: 10000, status: 'confirmed' }),
      missionOrder({ id: 'mission-002', missionValue: 50000, opsCredit: 5000, status: 'recovered' }),
      missionOrder({ id: 'mission-003', missionValue: 20000, opsCredit: 2000, status: 'incident' }),
      missionOrder({ id: 'mission-004', operatorId: 'operator-999', missionValue: 90000, opsCredit: 9000 }),
    ])

    expect(performance.operatorId).toBe('operator-001')
    expect(performance.totalMissionOrders).toBe(3)
    expect(performance.activeMissionOrders).toBe(2)
    expect(performance.incidentCount).toBe(1)
    expect(performance.totalMissionValue).toBe(150000)
    expect(performance.totalOpsCredit).toBe(15000)
    expect(performance.incidentRate).toBeCloseTo(33.3333)
    expect(performance.reliabilityRate).toBeCloseTo(66.6667)
    expect(performance.readinessRate).toBeCloseTo(69.35)
    expect(performance.valueContributionScore).toBe(100)
    expect(performance.incidentPenalty).toBeCloseTo(66.6667)
    expect(performance.missionScore).toBeCloseTo(80.5367)
  })

  it('keeps empty operator metrics deterministic', () => {
    expect(calculateOperatorPerformance('operator-empty', [])).toEqual({
      operatorId: 'operator-empty',
      totalMissionOrders: 0,
      activeMissionOrders: 0,
      totalMissionValue: 0,
      totalOpsCredit: 0,
      incidentCount: 0,
      incidentRate: 0,
      reliabilityRate: 0,
      readinessRate: 45,
      missionScore: 19,
      valueContributionScore: 0,
      incidentPenalty: 100,
    })
  })
})
