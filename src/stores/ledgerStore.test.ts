import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { USER_ROLE } from '@app/access/model/roles'
import { useLedgerStore } from './ledgerStore'
import { useUserStore } from './userStore'

const awaitStoreAction = async (promise: Promise<void>) => {
  await vi.advanceTimersByTimeAsync(2_000)
  await promise
}

describe('ledgerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('generates ledger rows through the current access role', async () => {
    const userStore = useUserStore()
    const ledgerStore = useLedgerStore()

    userStore.setRole(USER_ROLE.CREW_LEAD)
    await awaitStoreAction(ledgerStore.generate({}))

    expect(ledgerStore.loading).toBe(false)
    expect(ledgerStore.error).toBe('')
    expect(ledgerStore.rows).toHaveLength(8)
    expect(ledgerStore.rows.every((row) => row.crewName === 'Aurora Crew')).toBe(true)
  })
})
