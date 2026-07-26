import { beforeEach, describe, expect, it, vi } from 'vitest'
import { USER_ROLE } from '@app/access/model/roles'
import { generateLedger } from './ledgerApi'
import { getCrews, getOperators } from './operatorsApi'

vi.mock('./operatorsApi', () => ({
  getCrews: vi.fn(),
  getOperators: vi.fn(),
}))

const access = {
  admin: { role: USER_ROLE.ADMIN, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
  crewLead: { role: USER_ROLE.CREW_LEAD, crewLeadOperatorId: 'operator-002', currentOperatorId: 'operator-001' },
} as const

describe('generateLedger failures', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects when scoped crew lookup fails', async () => {
    vi.mocked(getCrews).mockRejectedValueOnce(new Error('Crew lookup failed'))

    await expect(generateLedger({}, access.crewLead)).rejects.toThrow('Crew lookup failed')

    expect(getOperators).not.toHaveBeenCalled()
  })

  it('rejects when operator lookup fails', async () => {
    vi.mocked(getCrews).mockResolvedValueOnce([])
    vi.mocked(getOperators).mockRejectedValueOnce(new Error('Operator lookup failed'))

    await expect(generateLedger({}, access.admin)).rejects.toThrow('Operator lookup failed')

    expect(getOperators).toHaveBeenCalledWith({})
  })
})
