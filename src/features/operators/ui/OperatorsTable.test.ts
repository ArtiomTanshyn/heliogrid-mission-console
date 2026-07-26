import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { OPERATING_REGION, OPERATOR_ROLE, OPERATOR_STATUS } from '@entities/operator/model/options'
import type { OperatorWithMetrics } from '@entities/operator/model/types'
import OperatorsTable from './OperatorsTable.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

const operator = (overrides: Partial<OperatorWithMetrics>): OperatorWithMetrics => ({
  id: 'operator-001',
  name: 'Astra Vey',
  email: 'astra.vey@heliogrid.demo',
  operatingRegion: OPERATING_REGION.LUNAR_CORRIDOR,
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
    totalMissionOrders: 2,
    activeMissionOrders: 2,
    totalMissionValue: 56_000,
    totalOpsCredit: 5_600,
    incidentCount: 0,
    incidentRate: 0,
    reliabilityRate: 100,
    readinessRate: 96,
    missionScore: 82,
    valueContributionScore: 56,
    incidentPenalty: 100,
  },
  ...overrides,
})

describe('OperatorsTable avatars', () => {
  it('renders inline svg avatars and initials fallback rows', () => {
    const wrapper = mount(OperatorsTable, {
      props: {
        loading: false,
        operators: [
          operator({
            id: 'operator-001',
            avatarUrl: 'data:image/svg+xml;utf8,%3Csvg%3E%3C/svg%3E',
          }),
          operator({
            id: 'operator-002',
            name: 'Orin Sol',
            email: 'orin.sol@heliogrid.demo',
            avatarUrl: '',
            initials: 'OS',
          }),
        ],
      },
      global: {
        stubs: {
          Button: true,
          Column: true,
          DataTable: true,
          Tag: {
            props: ['value'],
            template: '<span>{{ value }}</span>',
          },
        },
      },
    })

    expect(wrapper.find('img[src^="data:image/svg+xml"]').exists()).toBe(true)
    expect(wrapper.find('.avatar-fallback').text()).toBe('OS')
  })
})
