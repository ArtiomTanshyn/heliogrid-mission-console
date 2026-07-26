import { describe, expect, it } from 'vitest'
import { SERVICE_LINE } from './options'
import type { MissionOrder } from './types'
import {
  groupIncidentsByMonth,
  groupMissionOrdersByServiceLine,
  groupMissionValueByMonth,
  isValueMissionOrder,
} from './analytics'

const missionOrder = (overrides: Partial<MissionOrder>): MissionOrder => ({
  id: 'mission-001',
  operatorId: 'operator-001',
  serviceLine: SERVICE_LINE.CARGO_RESUPPLY,
  missionValue: 0,
  opsCredit: 0,
  status: 'confirmed',
  createdAt: '2026-01-10T00:00:00.000Z',
  ...overrides,
})

describe('mission order analytics', () => {
  it('treats confirmed and recovered mission orders as value-bearing', () => {
    expect(isValueMissionOrder(missionOrder({ status: 'confirmed' }))).toBe(true)
    expect(isValueMissionOrder(missionOrder({ status: 'recovered' }))).toBe(true)
    expect(isValueMissionOrder(missionOrder({ status: 'incident' }))).toBe(false)
  })

  it('groups value-bearing mission value by calendar month and year', () => {
    const rows = groupMissionValueByMonth([
      missionOrder({ id: 'mission-jan-1', missionValue: 20000, createdAt: '2026-01-05T00:00:00.000Z' }),
      missionOrder({
        id: 'mission-jan-2',
        missionValue: 30000,
        status: 'recovered',
        createdAt: '2026-01-20T00:00:00.000Z',
      }),
      missionOrder({
        id: 'mission-jan-incident',
        missionValue: 90000,
        status: 'incident',
        createdAt: '2026-01-25T00:00:00.000Z',
      }),
      missionOrder({ id: 'mission-feb', missionValue: 15000, createdAt: '2026-02-01T00:00:00.000Z' }),
    ])

    expect(rows[0]).toEqual({ label: 'Jan 2026', missionValue: 50000 })
    expect(rows[1]).toEqual({ label: 'Feb 2026', missionValue: 15000 })
  })

  it('keeps matching months from different years separate for mission value', () => {
    const rows = groupMissionValueByMonth([
      missionOrder({ id: 'mission-jan-2025', missionValue: 20000, createdAt: '2025-01-05T00:00:00.000Z' }),
      missionOrder({ id: 'mission-jan-2026', missionValue: 30000, createdAt: '2026-01-05T00:00:00.000Z' }),
    ])

    expect(rows.find((row) => row.label === 'Jan 2025')).toEqual({ label: 'Jan 2025', missionValue: 20000 })
    expect(rows.find((row) => row.label === 'Jan 2026')).toEqual({ label: 'Jan 2026', missionValue: 30000 })
  })

  it('groups mission order counts by service line', () => {
    expect(
      groupMissionOrdersByServiceLine([
        missionOrder({ id: 'mission-1', serviceLine: SERVICE_LINE.CARGO_RESUPPLY }),
        missionOrder({ id: 'mission-2', serviceLine: SERVICE_LINE.CARGO_RESUPPLY }),
        missionOrder({ id: 'mission-3', serviceLine: SERVICE_LINE.ORBITAL_IMAGING }),
      ]),
    ).toEqual({
      [SERVICE_LINE.CARGO_RESUPPLY]: 2,
      [SERVICE_LINE.ORBITAL_IMAGING]: 1,
    })
  })

  it('groups incident counts by calendar month and year', () => {
    const rows = groupIncidentsByMonth([
      missionOrder({ id: 'mission-jan-incident', status: 'incident', createdAt: '2026-01-10T00:00:00.000Z' }),
      missionOrder({ id: 'mission-jan-confirmed', status: 'confirmed', createdAt: '2026-01-12T00:00:00.000Z' }),
      missionOrder({ id: 'mission-mar-incident', status: 'incident', createdAt: '2026-03-02T00:00:00.000Z' }),
    ])

    expect(rows[0]).toEqual({ label: 'Jan 2026', count: 1 })
    expect(rows[2]).toEqual({ label: 'Mar 2026', count: 1 })
  })

  it('keeps matching months from different years separate for incidents', () => {
    const rows = groupIncidentsByMonth([
      missionOrder({ id: 'mission-dec-2025', status: 'incident', createdAt: '2025-12-10T00:00:00.000Z' }),
      missionOrder({ id: 'mission-dec-2026', status: 'incident', createdAt: '2026-12-10T00:00:00.000Z' }),
    ])

    expect(rows.find((row) => row.label === 'Dec 2025')).toEqual({ label: 'Dec 2025', count: 1 })
    expect(rows.find((row) => row.label === 'Dec 2026')).toEqual({ label: 'Dec 2026', count: 1 })
  })
})
