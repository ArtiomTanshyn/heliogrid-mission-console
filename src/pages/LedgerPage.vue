<script setup lang="ts">
import MetricCard from '@shared/ui/components/MetricCard.vue'
import StateBlock from '@shared/ui/components/StateBlock.vue'
import { useLedgerPage } from '@features/ledger/model/useLedgerPage'
import { getCrewLabel } from '@entities/crew/model/labels'
import { getOperatingRegionLabel, getOperatorRoleLabel } from '@entities/operator/model/labels'
import { LEDGER_TABLE } from '@features/ledger/model/table'
import { formatDatePickerValue, parseDatePickerValue } from '@shared/lib/datePicker'
import { formatCurrency, formatPercent, formatScore } from '@shared/lib/formatters'
import { APP_ICON } from '@shared/ui/icons'
import { BUTTON_SEVERITY } from '@shared/ui/primevue'

const {
  applyFilters,
  canExportRows,
  exportCsv,
  exportJson,
  filters,
  options,
  resetFilters,
  ledgerStore,
  resultSummary,
  summaryCards,
} = useLedgerPage()
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Operations Ledger</p>
        <h2>Generate mission performance ledger</h2>
        <p class="muted">The ledger preview uses the same filter contract as the mock API.</p>
      </div>
      <div class="toolbar">
        <Button
          label="Export Ledger CSV"
          :icon="APP_ICON.DOWNLOAD"
          :severity="BUTTON_SEVERITY.SECONDARY"
          :disabled="!canExportRows"
          @click="exportCsv"
        />
        <Button
          label="Export Ledger JSON"
          :icon="APP_ICON.CODE"
          :severity="BUTTON_SEVERITY.SECONDARY"
          outlined
          :disabled="!canExportRows"
          @click="exportJson"
        />
      </div>
    </div>

    <section class="ledger-filters panel">
      <DatePicker
        :model-value="parseDatePickerValue(filters.from)"
        date-format="yy-mm-dd"
        placeholder="From date"
        show-icon
        icon-display="input"
        show-button-bar
        @update:model-value="filters.from = formatDatePickerValue($event)"
      />
      <DatePicker
        :model-value="parseDatePickerValue(filters.to)"
        date-format="yy-mm-dd"
        placeholder="To date"
        show-icon
        icon-display="input"
        show-button-bar
        @update:model-value="filters.to = formatDatePickerValue($event)"
      />
      <Select
        v-model="filters.operatingRegion"
        :options="options.operatingRegions"
        option-label="label"
        option-value="value"
        placeholder="Operating Region"
        show-clear
      />
      <Select
        v-model="filters.crewId"
        :options="options.crews"
        option-label="label"
        option-value="value"
        placeholder="Crew"
        show-clear
      />
      <Select
        v-model="filters.role"
        :options="options.roles"
        option-label="label"
        option-value="value"
        placeholder="Operator Role"
        show-clear
      />
      <Select
        v-model="filters.serviceLine"
        :options="options.serviceLines"
        option-label="label"
        option-value="value"
        placeholder="Service Line"
        show-clear
      />
      <Button label="Apply" :icon="APP_ICON.FILTER_FILL" @click="applyFilters" />
      <Button
        label="Reset"
        :icon="APP_ICON.REFRESH"
        :severity="BUTTON_SEVERITY.SECONDARY"
        outlined
        @click="resetFilters"
      />
    </section>
    <p class="results-summary">{{ resultSummary }}</p>

    <div class="grid-4">
      <MetricCard
        v-for="metric in summaryCards"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
        :icon="metric.icon"
        :tone="metric.tone"
      />
    </div>

    <StateBlock
      v-if="ledgerStore.error"
      title="Ledger error"
      :message="ledgerStore.error"
      :icon="APP_ICON.EXCLAMATION_TRIANGLE"
    />
    <section v-else class="panel table-scroll">
      <DataTable
        :value="ledgerStore.rows"
        :loading="ledgerStore.loading"
        paginator
        :rows="LEDGER_TABLE.ROWS"
        data-key="operatorId"
        :table-style="{ minWidth: LEDGER_TABLE.MIN_WIDTH }"
      >
        <Column field="operatorName" header="Operator" sortable />
        <Column field="crewName" header="Crew" sortable>
          <template #body="{ data }">{{ getCrewLabel(data.crewName) }}</template>
        </Column>
        <Column field="operatingRegion" header="Operating Region" sortable>
          <template #body="{ data }">{{ getOperatingRegionLabel(data.operatingRegion) }}</template>
        </Column>
        <Column field="role" header="Operator Role" sortable>
          <template #body="{ data }">{{ getOperatorRoleLabel(data.role) }}</template>
        </Column>
        <Column field="missionOrders" header="Mission Orders" sortable />
        <Column field="missionValue" header="Mission Value" sortable>
          <template #body="{ data }">{{ formatCurrency(data.missionValue) }}</template>
        </Column>
        <Column field="opsCredit" header="Ops Credit" sortable>
          <template #body="{ data }">{{ formatCurrency(data.opsCredit) }}</template>
        </Column>
        <Column field="reliabilityRate" header="Reliability" sortable>
          <template #body="{ data }">{{ formatPercent(data.reliabilityRate) }}</template>
        </Column>
        <Column field="incidentRate" header="Incident Rate" sortable>
          <template #body="{ data }">{{ formatPercent(data.incidentRate) }}</template>
        </Column>
        <Column field="missionScore" header="Mission Score" sortable>
          <template #body="{ data }">{{ formatScore(data.missionScore) }}</template>
        </Column>
      </DataTable>
    </section>
  </section>
</template>

<style scoped>
.ledger-filters {
  display: grid;
  gap: 12px;
  align-items: center;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
}

.ledger-filters :deep(.p-inputtext),
.ledger-filters :deep(.p-datepicker),
.ledger-filters :deep(.p-select),
.ledger-filters :deep(.p-button) {
  width: 100%;
  min-height: 46px;
}

.ledger-filters :deep(.p-select-label) {
  display: flex;
  align-items: center;
}

.results-summary {
  margin: -6px 0 0;
  color: var(--text-muted);
  font-weight: 700;
}

@media (max-width: 1100px) {
  .ledger-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .ledger-filters {
    grid-template-columns: 1fr;
  }
}
</style>
