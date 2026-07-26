import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useOperatorsStore } from '@/stores/operatorsStore'
import { OPERATORS_FILTER_RELOAD_DEBOUNCE_MS, useOperatorsPage } from './useOperatorsPage'

const TestPage = defineComponent({
  setup() {
    useOperatorsPage()
    return () => null
  },
})

describe('useOperatorsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces url-driven operator reloads', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/operators', component: TestPage }],
    })
    await router.push('/operators')

    const operatorsStore = useOperatorsStore()
    vi.spyOn(operatorsStore, 'loadCrews').mockResolvedValue()
    const loadOperators = vi.spyOn(operatorsStore, 'loadOperators').mockResolvedValue()

    const wrapper = mount(TestPage, {
      global: {
        plugins: [router],
      },
    })
    await router.isReady()
    await flushPromises()

    expect(loadOperators).toHaveBeenCalledTimes(1)

    await router.replace({ path: '/operators', query: { search: 'Astra' } })
    await nextTick()
    await router.replace({ path: '/operators', query: { search: 'Nova' } })
    await nextTick()

    expect(loadOperators).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(OPERATORS_FILTER_RELOAD_DEBOUNCE_MS - 1)
    expect(loadOperators).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()

    expect(loadOperators).toHaveBeenCalledTimes(2)
    expect(loadOperators).toHaveBeenLastCalledWith(
      expect.objectContaining({
        search: 'Nova',
      }),
    )

    wrapper.unmount()
  })
})
