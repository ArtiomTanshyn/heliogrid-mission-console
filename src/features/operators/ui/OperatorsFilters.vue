<script setup lang="ts">
import { computed } from 'vue'
import {
  getOperatorCrewOptions,
  operatorOperatingRegionOptions,
  operatorRoleOptions,
  operatorStatusOptions,
  operatorServiceLineOptions,
} from '../model/filterOptions'
import type { OperatorsFilters } from '@api/operatorsApi'
import type { Crew } from '@entities/crew/model/types'
import { formatDatePickerValue, parseDatePickerValue } from '@shared/lib/datePicker'
import { APP_ICON } from '@shared/ui/icons'
import { BUTTON_SEVERITY } from '@shared/ui/primevue'

const props = defineProps<{
  modelValue: OperatorsFilters
  crews: Crew[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: OperatorsFilters]
  apply: []
  reset: []
}>()

const crewOptions = computed(() => getOperatorCrewOptions(props.crews))

const value = computed({
  get: () => props.modelValue,
  set: (next) => emit('update:modelValue', next),
})

const update = (key: keyof OperatorsFilters, next: string | undefined) => {
  value.value = { ...value.value, [key]: next ?? '' }
}
</script>

<template>
  <section class="filters panel">
    <span class="search">
      <i :class="APP_ICON.SEARCH" />
      <InputText
        :model-value="value.search"
        placeholder="Search by name or email"
        @update:model-value="update('search', String($event))"
      />
    </span>

    <Select
      :model-value="value.operatingRegion"
      :options="operatorOperatingRegionOptions"
      option-label="label"
      option-value="value"
      placeholder="Operating Region"
      show-clear
      @update:model-value="update('operatingRegion', $event)"
    />
    <Select
      :model-value="value.role"
      :options="operatorRoleOptions"
      option-label="label"
      option-value="value"
      placeholder="Operator Role"
      show-clear
      @update:model-value="update('role', $event)"
    />
    <Select
      :model-value="value.crewId"
      :options="crewOptions"
      option-label="label"
      option-value="value"
      placeholder="Crew"
      show-clear
      @update:model-value="update('crewId', $event)"
    />
    <Select
      :model-value="value.status"
      :options="operatorStatusOptions"
      option-label="label"
      option-value="value"
      placeholder="Status"
      show-clear
      @update:model-value="update('status', $event)"
    />
    <Select
      :model-value="value.serviceLine"
      :options="operatorServiceLineOptions"
      option-label="label"
      option-value="value"
      placeholder="Service Line"
      show-clear
      @update:model-value="update('serviceLine', $event)"
    />
    <DatePicker
      :model-value="parseDatePickerValue(value.from)"
      date-format="yy-mm-dd"
      placeholder="From date"
      show-icon
      icon-display="input"
      show-button-bar
      @update:model-value="update('from', formatDatePickerValue($event))"
    />
    <DatePicker
      :model-value="parseDatePickerValue(value.to)"
      date-format="yy-mm-dd"
      placeholder="To date"
      show-icon
      icon-display="input"
      show-button-bar
      @update:model-value="update('to', formatDatePickerValue($event))"
    />
    <Button label="Apply" :icon="APP_ICON.FILTER_FILL" @click="emit('apply')" />
    <Button
      label="Reset"
      :icon="APP_ICON.REFRESH"
      :severity="BUTTON_SEVERITY.SECONDARY"
      outlined
      @click="emit('reset')"
    />
  </section>
</template>

<style scoped>
.filters {
  display: grid;
  gap: 12px;
  align-items: center;
  grid-template-columns: minmax(260px, 1.35fr) repeat(4, minmax(150px, 1fr));
}

.search {
  position: relative;
  display: block;
  min-width: 0;
}

.search i {
  position: absolute;
  top: 50%;
  left: 14px;
  z-index: 1;
  color: var(--text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.search :deep(input) {
  width: 100%;
  padding-left: 42px;
}

.filters :deep(.p-inputtext),
.filters :deep(.p-datepicker),
.filters :deep(.p-select),
.filters :deep(.p-button) {
  width: 100%;
  min-height: 46px;
}

.filters :deep(.p-select-label) {
  display: flex;
  align-items: center;
}

@media (max-width: 1180px) {
  .filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
