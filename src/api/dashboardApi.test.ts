import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { USER_ROLE } from '@app/access/model/roles'
import { getDashboardSummary } from './dashboardApi'

const access = {
  admin: { role: USER_ROLE.ADMIN, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
  crewLead: { role: USER_ROLE.CREW_LEAD, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
  operator: { role: USER_ROLE.OPERATOR, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
} as const

const awaitMockApi = async <T>(promise: Promise<T>) => {
  await vi.advanceTimersByTimeAsync(2_000)
  return promise
}

const scopedOperatorCount = (summary: Awaited<ReturnType<typeof getDashboardSummary>>) =>
  Object.values(summary.charts.performanceByRole).reduce((sum, scores) => sum + scores.length, 0)

describe('getDashboardSummary', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns full-console summary for Control Admin', async () => {
    const summary = await awaitMockApi(getDashboardSummary(access.admin))

    expect(scopedOperatorCount(summary)).toBe(48)
    expect(summary.totalMissionValue).toBeGreaterThan(0)
    expect(summary.totalOpsCredit).toBeGreaterThan(0)
    expect(summary.topOperator).not.toBe('N/A')
  })

  it('scopes dashboard summary to the assigned crew for Crew Lead', async () => {
    const adminSummary = await awaitMockApi(getDashboardSummary(access.admin))
    const crewLeadSummary = await awaitMockApi(getDashboardSummary(access.crewLead))

    expect(scopedOperatorCount(crewLeadSummary)).toBeGreaterThan(1)
    expect(scopedOperatorCount(crewLeadSummary)).toBeLessThan(scopedOperatorCount(adminSummary))
    expect(crewLeadSummary.totalMissionValue).toBeLessThan(adminSummary.totalMissionValue)
  })

  it('scopes dashboard summary to the current operator for Operator access', async () => {
    const summary = await awaitMockApi(getDashboardSummary(access.operator))

    expect(scopedOperatorCount(summary)).toBe(1)
    expect(summary.topOperator).toBe('Astra Vey')
    expect(Object.values(summary.charts.performanceByRole).flat()).toHaveLength(1)
  })
})
