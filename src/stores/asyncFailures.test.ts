import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getDashboardSummary } from '@api/dashboardApi'
import { generateLedger } from '@api/ledgerApi'
import { getMissionOrdersByOperator } from '@api/missionOrdersApi'
import { getOperatorById, getOperators } from '@api/operatorsApi'
import { USER_ROLE } from '@app/access/model/roles'
import { MISSION_ORDER_STATUS, SERVICE_LINE } from '@entities/mission-order/model/options'
import type { MissionOrder } from '@entities/mission-order/model/types'
import { OPERATING_REGION, OPERATOR_ROLE, OPERATOR_STATUS } from '@entities/operator/model/options'
import type { OperatorWithMetrics } from '@entities/operator/model/types'
import { useDashboardStore } from './dashboardStore'
import { useLedgerStore } from './ledgerStore'
import { useOperatorsStore } from './operatorsStore'
import { useUserStore } from './userStore'

vi.mock('@api/dashboardApi', () => ({
  getDashboardSummary: vi.fn(),
}))

vi.mock('@api/ledgerApi', () => ({
  generateLedger: vi.fn(),
}))

vi.mock('@api/operatorsApi', () => ({
  getCrews: vi.fn(),
  getOperatorById: vi.fn(),
  getOperators: vi.fn(),
}))

vi.mock('@api/missionOrdersApi', () => ({
  getMissionOrdersByOperator: vi.fn(),
}))

const operator = {
  id: 'operator-001',
  name: 'Astra Vey',
  email: 'astra.vey@heliogrid.demo',
  operatingRegion: OPERATING_REGION.LOW_EARTH_ORBIT,
  role: OPERATOR_ROLE.FIELD_OPERATOR,
  crewId: 'crew-aurora',
  crewLeadId: 'operator-002',
  status: OPERATOR_STATUS.READY,
  avatarUrl: '',
  initials: 'AV',
  joinedAt: '2025-01-01T00:00:00.000Z',
  crewName: 'Aurora Crew',
  metrics: {
    operatorId: 'operator-001',
    totalMissionOrders: 1,
    activeMissionOrders: 1,
    totalMissionValue: 42_000,
    totalOpsCredit: 4_200,
    incidentCount: 0,
    incidentRate: 0,
    reliabilityRate: 100,
    readinessRate: 96,
    missionScore: 80,
    valueContributionScore: 42,
    incidentPenalty: 100,
  },
} satisfies OperatorWithMetrics

const missionOrder = {
  id: 'mission-test-001',
  operatorId: operator.id,
  serviceLine: SERVICE_LINE.RESEARCH_PAYLOAD,
  missionValue: 42_000,
  opsCredit: 4_200,
  status: MISSION_ORDER_STATUS.CONFIRMED,
  createdAt: '2026-07-01T00:00:00.000Z',
} satisfies MissionOrder

const secondOperator = {
  ...operator,
  id: 'operator-003',
  name: 'Nova Vale',
  email: 'nova.vale@heliogrid.demo',
  initials: 'NV',
  metrics: {
    ...operator.metrics,
    operatorId: 'operator-003',
    totalMissionValue: 28_000,
    totalOpsCredit: 2_800,
  },
} satisfies OperatorWithMetrics

describe('store async failures', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('sets the dashboard error after load failure and clears loading state', async () => {
    vi.mocked(getDashboardSummary).mockRejectedValueOnce(new Error('Summary unavailable'))

    const dashboardStore = useDashboardStore()

    await dashboardStore.loadDashboard()

    expect(dashboardStore.loading).toBe(false)
    expect(dashboardStore.error).toBe('Mission performance could not be loaded.')
    expect(dashboardStore.summary).toBeNull()
  })

  it('sets the ledger error after generation failure and clears loading state', async () => {
    vi.mocked(generateLedger).mockRejectedValueOnce(new Error('Ledger unavailable'))

    const ledgerStore = useLedgerStore()

    await ledgerStore.generate({})

    expect(ledgerStore.loading).toBe(false)
    expect(ledgerStore.error).toBe('Ledger could not be generated.')
    expect(ledgerStore.rows).toStrictEqual([])
  })

  it('sets the operators error after list failure and keeps existing rows', async () => {
    vi.mocked(getOperators).mockRejectedValueOnce(new Error('Operators unavailable'))

    const operatorsStore = useOperatorsStore()
    operatorsStore.operators = [operator]

    await operatorsStore.loadOperators({ search: 'Astra' })

    expect(operatorsStore.loading).toBe(false)
    expect(operatorsStore.error).toBe('Operators could not be loaded.')
    expect(operatorsStore.operators).toStrictEqual([operator])
  })

  it('keeps the latest operators list when an earlier filter response resolves later', async () => {
    let resolveFirstLoad: (operators: OperatorWithMetrics[]) => void = () => {}
    let resolveSecondLoad: (operators: OperatorWithMetrics[]) => void = () => {}
    vi.mocked(getOperators)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirstLoad = resolve
        }),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSecondLoad = resolve
        }),
      )

    const operatorsStore = useOperatorsStore()
    const firstLoad = operatorsStore.loadOperators({ search: 'Astra' })
    const secondLoad = operatorsStore.loadOperators({ search: 'Nova' })

    resolveSecondLoad([secondOperator])
    await secondLoad

    expect(operatorsStore.loading).toBe(false)
    expect(operatorsStore.error).toBe('')
    expect(operatorsStore.operators).toStrictEqual([secondOperator])

    resolveFirstLoad([operator])
    await firstLoad

    expect(operatorsStore.loading).toBe(false)
    expect(operatorsStore.error).toBe('')
    expect(operatorsStore.operators).toStrictEqual([secondOperator])
  })

  it('clears stale operator details while a new details route is loading', async () => {
    let resolveOperatorLookup: (operator: OperatorWithMetrics | null) => void = () => {}
    vi.mocked(getOperatorById).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveOperatorLookup = resolve
      }),
    )

    const operatorsStore = useOperatorsStore()
    operatorsStore.selectedOperator = operator
    operatorsStore.selectedMissionOrders = [missionOrder]

    const detailsLoad = operatorsStore.loadOperatorDetails('operator-missing')

    expect(operatorsStore.loading).toBe(true)
    expect(operatorsStore.error).toBe('')
    expect(operatorsStore.selectedOperator).toBeNull()
    expect(operatorsStore.selectedMissionOrders).toStrictEqual([])

    resolveOperatorLookup(null)
    await detailsLoad

    expect(operatorsStore.loading).toBe(false)
    expect(operatorsStore.error).toBe('Operator details are unavailable for the current access role.')
    expect(getMissionOrdersByOperator).not.toHaveBeenCalled()
  })

  it('clears selected operator state when mission order loading fails', async () => {
    vi.mocked(getOperatorById).mockResolvedValueOnce(operator)
    vi.mocked(getMissionOrdersByOperator).mockRejectedValueOnce(new Error('Mission orders unavailable'))

    const userStore = useUserStore()
    const operatorsStore = useOperatorsStore()
    userStore.setRole(USER_ROLE.ADMIN)
    operatorsStore.selectedOperator = operator
    operatorsStore.selectedMissionOrders = [missionOrder]

    await operatorsStore.loadOperatorDetails(operator.id)

    expect(getMissionOrdersByOperator).toHaveBeenCalledWith(operator.id)
    expect(operatorsStore.loading).toBe(false)
    expect(operatorsStore.error).toBe('Operator details are unavailable for the current access role.')
    expect(operatorsStore.selectedOperator).toBeNull()
    expect(operatorsStore.selectedMissionOrders).toStrictEqual([])
  })
})
