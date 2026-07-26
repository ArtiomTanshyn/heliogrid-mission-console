import { computed, onMounted, ref } from 'vue'
import {
  getLedgerCrewOptions,
  ledgerOperatingRegionOptions,
  ledgerOperatorRoleOptions,
  ledgerServiceLineOptions,
} from './filterOptions'
import { mapRowsToLedgerExport, LEDGER_EXPORT_FILENAME, LEDGER_EXPORT_MIME_TYPE } from './export'
import { getEmptyLedgerFilters, normalizeLedgerFilters } from './filters'
import { APP_ICON } from '@shared/ui/icons'
import { METRIC_TONE } from '@shared/ui/primevue'
import { useOperatorsStore } from '@/stores/operatorsStore'
import { useLedgerStore } from '@/stores/ledgerStore'
import { useUserStore } from '@/stores/userStore'
import type { LedgerFilters } from '@entities/ledger/model/types'
import { downloadFile, toCsv } from '@shared/lib/csvExport'
import { formatCurrency } from '@shared/lib/formatters'

export function useLedgerPage() {
  const ledgerStore = useLedgerStore()
  const operatorsStore = useOperatorsStore()
  const userStore = useUserStore()
  const filters = ref<LedgerFilters>(getEmptyLedgerFilters())

  const options = computed(() => ({
    operatingRegions: ledgerOperatingRegionOptions,
    serviceLines: ledgerServiceLineOptions,
    roles: ledgerOperatorRoleOptions,
    crews: getLedgerCrewOptions(operatorsStore.crews),
  }))

  const canExportRows = computed(() => userStore.canExport && ledgerStore.rows.length > 0)
  const resultSummary = computed(() => {
    if (ledgerStore.loading) return 'Generating ledger...'

    return `${ledgerStore.rows.length} ledger rows`
  })

  const summaryCards = computed(() => [
    {
      label: 'Rows',
      value: ledgerStore.rows.length,
      icon: APP_ICON.TABLE,
      tone: METRIC_TONE.BLUE,
    },
    {
      label: 'Mission Value',
      value: formatCurrency(ledgerStore.rows.reduce((sum, row) => sum + row.missionValue, 0)),
      icon: APP_ICON.DOLLAR,
      tone: METRIC_TONE.BLUE,
    },
    {
      label: 'Ops Credit',
      value: formatCurrency(ledgerStore.rows.reduce((sum, row) => sum + row.opsCredit, 0)),
      icon: APP_ICON.WALLET,
      tone: METRIC_TONE.GREEN,
    },
    {
      label: 'Exports',
      value: userStore.canExport ? 'Enabled' : 'Restricted',
      icon: APP_ICON.LOCK,
      tone: METRIC_TONE.AMBER,
    },
  ])

  const applyFilters = async () => {
    const next = normalizeLedgerFilters(
      filters.value,
      operatorsStore.crews.map((crew) => crew.id),
    )
    filters.value = next
    await ledgerStore.generate(next)
  }

  const resetFilters = async () => {
    filters.value = getEmptyLedgerFilters()
    await ledgerStore.generate(filters.value)
  }

  const exportCsv = () => {
    if (!canExportRows.value) return

    downloadFile(
      LEDGER_EXPORT_FILENAME.CSV,
      toCsv(mapRowsToLedgerExport(ledgerStore.rows)),
      LEDGER_EXPORT_MIME_TYPE.CSV,
    )
  }

  const exportJson = () => {
    if (!canExportRows.value) return

    downloadFile(
      LEDGER_EXPORT_FILENAME.JSON,
      JSON.stringify(mapRowsToLedgerExport(ledgerStore.rows), null, 2),
      LEDGER_EXPORT_MIME_TYPE.JSON,
    )
  }

  onMounted(async () => {
    await operatorsStore.loadCrews()
    await applyFilters()
  })

  return {
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
  }
}
