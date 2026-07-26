import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { USER_ROLE } from '@app/access/model/roles'
import { generateLedger } from './ledgerApi'

const access = {
  admin: { role: USER_ROLE.ADMIN, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
  crewLead: { role: USER_ROLE.CREW_LEAD, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
  operator: { role: USER_ROLE.OPERATOR, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
} as const

const awaitMockApi = async <T>(promise: Promise<T>) => {
  await vi.advanceTimersByTimeAsync(2_000)
  return promise
}

describe('generateLedger', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('generates full ledger rows for Control Admin', async () => {
    const rows = await awaitMockApi(generateLedger({}, access.admin))

    expect(rows).toHaveLength(48)
    expect(rows.some((row) => row.operatorId === 'operator-001')).toBe(true)
    expect(rows.some((row) => row.crewName === 'Aurora Crew')).toBe(true)
  })

  it('scopes ledger rows to the assigned crew for Crew Lead', async () => {
    const rows = await awaitMockApi(generateLedger({}, access.crewLead))

    expect(rows).toHaveLength(8)
    expect(rows.every((row) => row.crewName === 'Aurora Crew')).toBe(true)
  })

  it('scopes ledger rows to the current operator for Operator access', async () => {
    const rows = await awaitMockApi(generateLedger({}, access.operator))

    expect(rows).toHaveLength(1)
    expect(rows[0]?.operatorId).toBe('operator-001')
    expect(rows[0]?.operatorName).toBe('Astra Vey')
  })
})
