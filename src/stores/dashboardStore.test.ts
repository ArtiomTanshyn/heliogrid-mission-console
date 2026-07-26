import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { USER_ROLE } from '@app/access/model/roles'
import { useDashboardStore } from './dashboardStore'
import { useUserStore } from './userStore'

const awaitStoreAction = async (promise: Promise<void>) => {
  await vi.advanceTimersByTimeAsync(2_000)
  await promise
}

const scopedOperatorCount = (summary: NonNullable<ReturnType<typeof useDashboardStore>['summary']>) =>
  Object.values(summary.charts.performanceByRole).reduce((sum, scores) => sum + scores.length, 0)

describe('dashboardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads dashboard summary through the current access role', async () => {
    const userStore = useUserStore()
    const dashboardStore = useDashboardStore()

    userStore.setRole(USER_ROLE.OPERATOR)
    await awaitStoreAction(dashboardStore.loadDashboard())

    expect(dashboardStore.loading).toBe(false)
    expect(dashboardStore.error).toBe('')
    expect(dashboardStore.summary).not.toBeNull()
    expect(scopedOperatorCount(dashboardStore.summary!)).toBe(1)
    expect(dashboardStore.summary?.topOperator).toBe('Astra Vey')
  })
})
