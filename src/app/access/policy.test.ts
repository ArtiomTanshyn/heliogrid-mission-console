import { describe, expect, it } from 'vitest'
import type { Crew } from '@entities/crew/model/types'
import type { OperatorWithMetrics } from '@entities/operator/model/types'
import { USER_ROLE } from './model/roles'
import {
  canAccessOperator,
  canExportLedger,
  canSeeMissionValue,
  filterOperatorsByAccess,
  getScopedOperatorFilters,
} from './policy'

const crews: Crew[] = [
  { id: 'crew-aurora', name: 'Aurora Crew', operatingRegion: 'Lunar Corridor', leadOperatorId: 'operator-002' },
  { id: 'crew-vega', name: 'Vega Crew', operatingRegion: 'Deep Space Network', leadOperatorId: 'operator-030' },
]

const operators = [
  { id: 'operator-001', crewId: 'crew-aurora' },
  { id: 'operator-002', crewId: 'crew-aurora' },
  { id: 'operator-030', crewId: 'crew-vega' },
]

const operatorWithMetrics = (id: string, crewId: string): OperatorWithMetrics => ({
  id,
  crewId,
  name: id,
  email: `${id}@heliogrid.demo`,
  operatingRegion: crewId === 'crew-vega' ? 'Deep Space Network' : 'Lunar Corridor',
  role: 'Field Operator',
  crewLeadId: null,
  status: 'ready',
  avatarUrl: '',
  initials: 'OP',
  joinedAt: '2026-01-01T00:00:00.000Z',
  crewName: crewId,
  metrics: {
    operatorId: id,
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
  },
})

describe('access policy', () => {
  it('allows ledger export and mission value only for Control Admin', () => {
    expect(canExportLedger({ role: USER_ROLE.ADMIN })).toBe(true)
    expect(canSeeMissionValue({ role: USER_ROLE.ADMIN })).toBe(true)
    expect(canExportLedger({ role: USER_ROLE.CREW_LEAD })).toBe(false)
    expect(canSeeMissionValue({ role: USER_ROLE.OPERATOR })).toBe(false)
  })

  it('scopes filters for Crew Lead to the led crew', () => {
    expect(
      getScopedOperatorFilters(
        { crewId: 'crew-vega', status: 'ready' },
        { role: USER_ROLE.CREW_LEAD, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
        crews,
      ),
    ).toEqual({ crewId: 'crew-aurora', status: 'ready' })
  })

  it('filters operator rows by access context', () => {
    expect(
      filterOperatorsByAccess(
        operators,
        { role: USER_ROLE.ADMIN, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
        crews,
      ),
    ).toHaveLength(3)

    expect(
      filterOperatorsByAccess(
        operators,
        { role: USER_ROLE.CREW_LEAD, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
        crews,
      ).map((operator) => operator.id),
    ).toEqual(['operator-001', 'operator-002'])

    expect(
      filterOperatorsByAccess(
        operators,
        { role: USER_ROLE.OPERATOR, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
        crews,
      ),
    ).toEqual([{ id: 'operator-001', crewId: 'crew-aurora' }])
  })

  it('checks operator detail access for each role', () => {
    const auroraOperator = operatorWithMetrics('operator-001', 'crew-aurora')
    const vegaOperator = operatorWithMetrics('operator-030', 'crew-vega')

    expect(
      canAccessOperator(
        auroraOperator,
        { role: USER_ROLE.ADMIN, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-999' },
        crews,
      ),
    ).toBe(true)
    expect(
      canAccessOperator(
        auroraOperator,
        { role: USER_ROLE.CREW_LEAD, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-999' },
        crews,
      ),
    ).toBe(true)
    expect(
      canAccessOperator(
        vegaOperator,
        { role: USER_ROLE.CREW_LEAD, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-999' },
        crews,
      ),
    ).toBe(false)
    expect(
      canAccessOperator(
        auroraOperator,
        { role: USER_ROLE.OPERATOR, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
        crews,
      ),
    ).toBe(true)
  })
})
