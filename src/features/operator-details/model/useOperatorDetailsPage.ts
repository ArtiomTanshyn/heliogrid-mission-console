import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCrewLabel } from '@entities/crew/model/labels'
import { groupMissionOrdersByServiceLine, groupMissionValueByMonth } from '@entities/mission-order/model/analytics'
import { getServiceLineLabel } from '@entities/mission-order/model/labels'
import { getOperatingRegionLabel, getOperatorStatusLabel } from '@entities/operator/model/labels'
import { getOperatorStatusSeverity } from '@entities/operator/model/status'
import { CHART_COLOR, LINE_CHART_TENSION, SERVICE_LINE_CHART_COLORS } from '@shared/ui/chartTheme'
import { APP_ICON } from '@shared/ui/icons'
import { METRIC_TONE, TAG_SEVERITY } from '@shared/ui/primevue'
import { useOperatorsStore } from '@/stores/operatorsStore'
import { formatCurrency, formatDate, formatPercent, formatScore } from '@shared/lib/formatters'

export function useOperatorDetailsPage() {
  const route = useRoute()
  const operatorsStore = useOperatorsStore()

  const loadOperatorDetails = async () => {
    await operatorsStore.loadCrews()
    await operatorsStore.loadOperatorDetails(String(route.params.id))
  }

  onMounted(loadOperatorDetails)
  watch(() => route.params.id, loadOperatorDetails)

  const operator = computed(() => operatorsStore.selectedOperator)
  const missionOrders = computed(() => operatorsStore.selectedMissionOrders)
  const latestMissionOrders = computed(() => missionOrders.value.slice(0, 20))

  const profileTags = computed(() => {
    if (!operator.value) return []

    return [
      { label: getCrewLabel(operator.value.crewId, operator.value.crewName) },
      { label: getOperatingRegionLabel(operator.value.operatingRegion), severity: TAG_SEVERITY.INFO },
      {
        label: getOperatorStatusLabel(operator.value.status),
        severity: getOperatorStatusSeverity(operator.value.status),
      },
      { label: `Joined ${formatDate(operator.value.joinedAt)}`, severity: TAG_SEVERITY.SECONDARY },
    ]
  })

  const metricCards = computed(() => {
    if (!operator.value) return []

    return [
      {
        label: 'Mission Value',
        value: formatCurrency(operator.value.metrics.totalMissionValue),
        icon: APP_ICON.DOLLAR,
        tone: METRIC_TONE.BLUE,
      },
      {
        label: 'Ops Credit',
        value: formatCurrency(operator.value.metrics.totalOpsCredit),
        icon: APP_ICON.WALLET,
        tone: METRIC_TONE.GREEN,
      },
      {
        label: 'Reliability',
        value: formatPercent(operator.value.metrics.reliabilityRate),
        icon: APP_ICON.SHIELD,
        tone: METRIC_TONE.GREEN,
      },
      {
        label: 'Mission Score',
        value: formatScore(operator.value.metrics.missionScore),
        icon: APP_ICON.BOLT,
        tone: METRIC_TONE.AMBER,
      },
    ]
  })

  const missionValueChart = computed(() => {
    const rows = groupMissionValueByMonth(missionOrders.value)

    return {
      labels: rows.map((row) => row.label),
      datasets: [
        {
          label: 'Mission Value',
          data: rows.map((row) => row.missionValue),
          borderColor: CHART_COLOR.PRIMARY,
          backgroundColor: CHART_COLOR.PRIMARY_FILL_SOFT,
          fill: true,
          tension: LINE_CHART_TENSION,
        },
      ],
    }
  })

  const serviceLineChart = computed(() => {
    const rows = groupMissionOrdersByServiceLine(missionOrders.value)

    return {
      labels: Object.keys(rows).map(getServiceLineLabel),
      datasets: [
        {
          data: Object.values(rows),
          backgroundColor: SERVICE_LINE_CHART_COLORS,
        },
      ],
    }
  })

  const charts = computed(() => [
    {
      title: 'Mission Value over Time',
      type: 'line' as const,
      data: missionValueChart.value,
    },
    {
      title: 'Mission Orders by Service Line',
      type: 'doughnut' as const,
      data: serviceLineChart.value,
    },
  ])

  const scoreFormulaItems = computed(() => {
    if (!operator.value) return []

    return [
      `Value contribution: 40% · ${formatScore(operator.value.metrics.valueContributionScore)}`,
      `Reliability: 30% · ${formatPercent(operator.value.metrics.reliabilityRate)}`,
      `Readiness: 20% · ${formatPercent(operator.value.metrics.readinessRate)}`,
      `Incident penalty: 10% · ${formatScore(operator.value.metrics.incidentPenalty)}`,
    ]
  })

  return {
    operator,
    operatorsStore,
    charts,
    latestMissionOrders,
    metricCards,
    profileTags,
    scoreFormulaItems,
  }
}
