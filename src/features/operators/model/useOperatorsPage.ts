import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'
import type { OperatorsFilters } from '@api/operatorsApi'
import { useOperatorsStore } from '@/stores/operatorsStore'
import { getEmptyOperatorsFilters, normalizeOperatorsFilters, pruneEmptyOperatorsFilters } from './filters'
import { useUrlFilters } from './useUrlFilters'

export const OPERATORS_FILTER_RELOAD_DEBOUNCE_MS = 250

export function useOperatorsPage() {
  const operatorsStore = useOperatorsStore()
  const { filters: urlFilters, updateFilters } = useUrlFilters()
  const draftFilters = ref<OperatorsFilters>({ ...getEmptyOperatorsFilters(), ...urlFilters.value })
  const lastAppliedFilters = ref<OperatorsFilters>(normalizeOperatorsFilters(draftFilters.value))
  let scheduledFiltersLoad: ReturnType<typeof window.setTimeout> | undefined
  const serializeFilters = (filters: OperatorsFilters) =>
    JSON.stringify(pruneEmptyOperatorsFilters(normalizeOperatorsFilters(filters)))
  const clearScheduledFiltersLoad = () => {
    if (scheduledFiltersLoad === undefined) return

    window.clearTimeout(scheduledFiltersLoad)
    scheduledFiltersLoad = undefined
  }
  const scheduleFiltersLoad = (filters: OperatorsFilters) => {
    clearScheduledFiltersLoad()
    scheduledFiltersLoad = window.setTimeout(() => {
      scheduledFiltersLoad = undefined
      void operatorsStore.loadOperators(filters)
    }, OPERATORS_FILTER_RELOAD_DEBOUNCE_MS)
  }

  onMounted(async () => {
    await operatorsStore.loadCrews()
    await operatorsStore.loadOperators(draftFilters.value)
    lastAppliedFilters.value = normalizeOperatorsFilters(draftFilters.value)
  })

  onScopeDispose(clearScheduledFiltersLoad)

  watch(urlFilters, (next) => {
    draftFilters.value = { ...getEmptyOperatorsFilters(), ...next }
    if (serializeFilters(next) === serializeFilters(lastAppliedFilters.value)) return

    const normalized = normalizeOperatorsFilters(next)
    lastAppliedFilters.value = normalized
    scheduleFiltersLoad(normalized)
  })

  const applyFilters = async () => {
    const next = normalizeOperatorsFilters(draftFilters.value)
    clearScheduledFiltersLoad()
    draftFilters.value = next
    lastAppliedFilters.value = next
    updateFilters(next)
    await operatorsStore.loadOperators(next)
  }

  const resetFilters = async () => {
    clearScheduledFiltersLoad()
    draftFilters.value = getEmptyOperatorsFilters()
    lastAppliedFilters.value = normalizeOperatorsFilters(draftFilters.value)
    updateFilters(draftFilters.value)
    await operatorsStore.loadOperators(draftFilters.value)
  }

  const resultSummary = computed(() => {
    if (operatorsStore.loading) return 'Loading operators...'

    return `${operatorsStore.operators.length} operators found`
  })

  return {
    applyFilters,
    operatorsStore,
    filters: draftFilters,
    resetFilters,
    resultSummary,
  }
}
