import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { OperatorsFilters } from '@api/operatorsApi'
import { normalizeOperatorsFilters, pruneEmptyOperatorsFilters } from './filters'

export function useUrlFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<OperatorsFilters>(() => normalizeOperatorsFilters(route.query))

  const updateFilters = (next: OperatorsFilters) => {
    const query = pruneEmptyOperatorsFilters(normalizeOperatorsFilters(next))
    router.replace({ query })
  }

  return { filters, updateFilters }
}
