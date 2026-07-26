<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getCrewLabel } from '@entities/crew/model/labels'
import { getOperatorStatusSeverity } from '@entities/operator/model/status'
import { getOperatingRegionLabel, getOperatorRoleLabel, getOperatorStatusLabel } from '@entities/operator/model/labels'
import type { OperatorWithMetrics } from '@entities/operator/model/types'
import { formatCurrency, formatPercent, formatScore } from '@shared/lib/formatters'
import { APP_ICON } from '@shared/ui/icons'
import { OPERATORS_TABLE } from '../model/table'
import { usePerformanceScore } from '../model/usePerformanceScore'

defineProps<{
  operators: OperatorWithMetrics[]
  loading: boolean
}>()

const router = useRouter()
const { severity } = usePerformanceScore()

const openOperator = (operator: OperatorWithMetrics) => {
  router.push(`/operators/${operator.id}`)
}
</script>

<template>
  <div class="desktop-table panel table-scroll">
    <DataTable
      :value="operators"
      :loading="loading"
      paginator
      :rows="OPERATORS_TABLE.ROWS"
      :rows-per-page-options="[...OPERATORS_TABLE.ROWS_PER_PAGE_OPTIONS]"
      :sort-field="OPERATORS_TABLE.SORT_FIELD"
      :sort-order="OPERATORS_TABLE.SORT_ORDER_DESC"
      data-key="id"
      :table-style="{ minWidth: OPERATORS_TABLE.MIN_WIDTH }"
    >
      <Column header="Operator" sortable sort-field="name">
        <template #body="{ data }">
          <button class="operator-cell" @click="openOperator(data)">
            <img v-if="data.avatarUrl" :src="data.avatarUrl" :alt="data.name" />
            <span v-else class="avatar-fallback" aria-hidden="true">{{ data.initials }}</span>
            <span>
              <strong>{{ data.name }}</strong>
              <small>{{ data.email }}</small>
            </span>
          </button>
        </template>
      </Column>
      <Column field="role" header="Operator Role" sortable>
        <template #body="{ data }">{{ getOperatorRoleLabel(data.role) }}</template>
      </Column>
      <Column field="crewName" header="Crew" sortable>
        <template #body="{ data }">{{ getCrewLabel(data.crewId, data.crewName) }}</template>
      </Column>
      <Column field="operatingRegion" header="Operating Region" sortable>
        <template #body="{ data }">{{ getOperatingRegionLabel(data.operatingRegion) }}</template>
      </Column>
      <Column header="Mission Orders" sortable sort-field="metrics.totalMissionOrders">
        <template #body="{ data }">{{ data.metrics.totalMissionOrders }}</template>
      </Column>
      <Column header="Mission Value" sortable sort-field="metrics.totalMissionValue">
        <template #body="{ data }">{{ formatCurrency(data.metrics.totalMissionValue) }}</template>
      </Column>
      <Column header="Ops Credit" sortable sort-field="metrics.totalOpsCredit">
        <template #body="{ data }">{{ formatCurrency(data.metrics.totalOpsCredit) }}</template>
      </Column>
      <Column header="Reliability" sortable sort-field="metrics.reliabilityRate">
        <template #body="{ data }">{{ formatPercent(data.metrics.reliabilityRate) }}</template>
      </Column>
      <Column header="Incident Rate" sortable sort-field="metrics.incidentRate">
        <template #body="{ data }">{{ formatPercent(data.metrics.incidentRate) }}</template>
      </Column>
      <Column header="Mission Score" sortable sort-field="metrics.missionScore">
        <template #body="{ data }">
          <Tag :value="formatScore(data.metrics.missionScore)" :severity="severity(data.metrics.missionScore)" />
        </template>
      </Column>
      <Column header="Status">
        <template #body="{ data }">
          <Tag :value="getOperatorStatusLabel(data.status)" :severity="getOperatorStatusSeverity(data.status)" />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Button :icon="APP_ICON.ARROW_RIGHT" text rounded aria-label="Open operator" @click="openOperator(data)" />
        </template>
      </Column>
    </DataTable>
  </div>

  <div class="mobile-list">
    <article v-for="operator in operators" :key="operator.id" class="operator-card" @click="openOperator(operator)">
      <div class="operator-card__header">
        <img v-if="operator.avatarUrl" :src="operator.avatarUrl" :alt="operator.name" />
        <span v-else class="avatar-fallback" aria-hidden="true">{{ operator.initials }}</span>
        <div>
          <h3>{{ operator.name }}</h3>
          <p>{{ getOperatorRoleLabel(operator.role) }} · {{ getCrewLabel(operator.crewId, operator.crewName) }}</p>
        </div>
        <Tag :value="formatScore(operator.metrics.missionScore)" :severity="severity(operator.metrics.missionScore)" />
      </div>
      <div class="operator-card__metrics">
        <span
          ><strong>{{ operator.metrics.totalMissionOrders }}</strong> Mission Orders</span
        >
        <span
          ><strong>{{ formatCurrency(operator.metrics.totalMissionValue) }}</strong> Mission Value</span
        >
        <span
          ><strong>{{ formatPercent(operator.metrics.reliabilityRate) }}</strong> Reliability</span
        >
      </div>
    </article>
  </div>
</template>

<style scoped>
.operator-cell {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.operator-cell img,
.operator-card img,
.avatar-fallback {
  width: 38px;
  height: 38px;
  border-radius: 999px;
}

.avatar-fallback {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  background: var(--surface-muted);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

.operator-cell small {
  display: block;
  color: var(--text-muted);
}

.mobile-list {
  display: none;
}

.operator-card {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.operator-card__header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.operator-card h3,
.operator-card p {
  margin: 0;
}

.operator-card p {
  color: var(--text-muted);
}

.operator-card__metrics {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 14px;
}

.operator-card__metrics span {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.operator-card__metrics strong {
  display: block;
  color: var(--text);
}

@media (max-width: 820px) {
  .desktop-table {
    display: none;
  }

  .mobile-list {
    display: grid;
    gap: 12px;
  }
}
</style>
