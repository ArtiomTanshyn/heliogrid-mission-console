<script setup lang="ts">
import OperatorsFilters from '@features/operators/ui/OperatorsFilters.vue'
import OperatorsTable from '@features/operators/ui/OperatorsTable.vue'
import StateBlock from '@shared/ui/components/StateBlock.vue'
import { useOperatorsPage } from '@features/operators/model/useOperatorsPage'
import { APP_ICON } from '@shared/ui/icons'

const { operatorsStore, applyFilters, filters, resetFilters, resultSummary } = useOperatorsPage()
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Operator Roster</p>
        <h2>Mission performance table with applied filters</h2>
        <p class="muted">Filters apply through the mock API layer and sync with URL query parameters.</p>
      </div>
    </div>

    <OperatorsFilters v-model="filters" :crews="operatorsStore.crews" @apply="applyFilters" @reset="resetFilters" />
    <p class="results-summary">{{ resultSummary }}</p>

    <StateBlock
      v-if="operatorsStore.error"
      title="Could not load operators"
      :message="operatorsStore.error"
      :icon="APP_ICON.EXCLAMATION_TRIANGLE"
    />
    <StateBlock
      v-else-if="!operatorsStore.loading && !operatorsStore.operators.length"
      title="No operators found"
      message="Adjust the filters or reset them to see the full crew roster."
      :icon="APP_ICON.FILTER"
    />
    <OperatorsTable v-else :operators="operatorsStore.operators" :loading="operatorsStore.loading" />
  </section>
</template>

<style scoped>
.results-summary {
  margin: -6px 0 0;
  color: var(--text-muted);
  font-weight: 700;
}
</style>
