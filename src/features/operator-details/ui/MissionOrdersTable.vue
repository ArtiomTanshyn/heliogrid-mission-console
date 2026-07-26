<script setup lang="ts">
import { getMissionOrderStatusLabel, getServiceLineLabel } from '@entities/mission-order/model/labels'
import { getMissionOrderStatusSeverity } from '@entities/mission-order/model/status'
import type { MissionOrder } from '@entities/mission-order/model/types'
import { formatCurrency, formatDate } from '@shared/lib/formatters'
import { MISSION_ORDERS_TABLE } from '../model/missionOrdersTable'

defineProps<{ missionOrders: MissionOrder[] }>()
</script>

<template>
  <DataTable
    :value="missionOrders"
    paginator
    :rows="MISSION_ORDERS_TABLE.ROWS"
    data-key="id"
    :table-style="{ minWidth: MISSION_ORDERS_TABLE.MIN_WIDTH }"
  >
    <Column field="createdAt" header="Date" sortable>
      <template #body="{ data }">{{ formatDate(data.createdAt) }}</template>
    </Column>
    <Column field="serviceLine" header="Service Line" sortable>
      <template #body="{ data }">{{ getServiceLineLabel(data.serviceLine) }}</template>
    </Column>
    <Column field="missionValue" header="Mission Value" sortable>
      <template #body="{ data }">{{ formatCurrency(data.missionValue) }}</template>
    </Column>
    <Column field="opsCredit" header="Ops Credit" sortable>
      <template #body="{ data }">{{ formatCurrency(data.opsCredit) }}</template>
    </Column>
    <Column field="status" header="Status" sortable>
      <template #body="{ data }">
        <Tag :value="getMissionOrderStatusLabel(data.status)" :severity="getMissionOrderStatusSeverity(data.status)" />
      </template>
    </Column>
  </DataTable>
</template>
