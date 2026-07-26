import { computed } from 'vue'
import { getServiceLineLabel } from '@entities/mission-order/model/labels'
import { getOperatorRoleLabel } from '@entities/operator/model/labels'
import { CHART_COLOR, LINE_CHART_TENSION, SERVICE_LINE_CHART_COLORS } from '@shared/ui/chartTheme'
import { APP_ICON } from '@shared/ui/icons'
import { METRIC_TONE } from '@shared/ui/primevue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useUserStore } from '@/stores/userStore'
import { formatCurrency, formatPercent } from '@shared/lib/formatters'

export function useDashboardPage() {
  const dashboardStore = useDashboardStore()
  const userStore = useUserStore()

  const summary = computed(() => dashboardStore.summary)
  const performanceByRole = computed(() => {
    const data = summary.value?.charts.performanceByRole ?? {}

    return Object.fromEntries(
      Object.entries(data).map(([role, scores]) => [
        role,
        scores.reduce((sum, score) => sum + score, 0) / scores.length,
      ]),
    )
  })

  const metricCards = computed(() => {
    if (!summary.value) return []

    return [
      {
        label: 'Mission Value',
        value: userStore.canSeeMissionValue ? formatCurrency(summary.value.totalMissionValue) : 'Scoped',
        icon: APP_ICON.DOLLAR,
        tone: METRIC_TONE.BLUE,
      },
      {
        label: 'Ops Credit',
        value: userStore.canSeeMissionValue ? formatCurrency(summary.value.totalOpsCredit) : 'Scoped',
        icon: APP_ICON.WALLET,
        tone: METRIC_TONE.GREEN,
      },
      {
        label: 'Ready Operators',
        value: summary.value.readyOperators,
        icon: APP_ICON.USERS,
        tone: METRIC_TONE.AMBER,
      },
      {
        label: 'Reliability',
        value: formatPercent(summary.value.averageReliability),
        icon: APP_ICON.SHIELD,
        tone: METRIC_TONE.GREEN,
      },
      {
        label: 'Incident Rate',
        value: formatPercent(summary.value.incidentRate),
        icon: APP_ICON.UNDO,
        tone: METRIC_TONE.RED,
      },
      {
        label: 'Top Operator',
        value: summary.value.topOperator,
        icon: APP_ICON.STAR,
        tone: METRIC_TONE.BLUE,
      },
    ]
  })
  const primaryMetricCards = computed(() => metricCards.value.slice(0, 4))
  const secondaryMetricCards = computed(() => metricCards.value.slice(4))

  const missionValueChart = computed(() => ({
    labels: summary.value?.charts.missionValueByMonth.map((item) => item.label) ?? [],
    datasets: [
      {
        label: 'Mission Value',
        data: summary.value?.charts.missionValueByMonth.map((item) => item.missionValue) ?? [],
        borderColor: CHART_COLOR.PRIMARY,
        backgroundColor: CHART_COLOR.PRIMARY_FILL,
        tension: LINE_CHART_TENSION,
        fill: true,
      },
    ],
  }))

  const serviceLineChart = computed(() => ({
    labels: Object.keys(summary.value?.charts.missionOrdersByServiceLine ?? {}).map(getServiceLineLabel),
    datasets: [
      {
        data: Object.values(summary.value?.charts.missionOrdersByServiceLine ?? {}),
        backgroundColor: SERVICE_LINE_CHART_COLORS,
      },
    ],
  }))

  const roleChart = computed(() => ({
    labels: Object.keys(performanceByRole.value).map(getOperatorRoleLabel),
    datasets: [
      {
        label: 'Average mission score',
        data: Object.values(performanceByRole.value),
        backgroundColor: CHART_COLOR.PRIMARY,
      },
    ],
  }))

  const incidentChart = computed(() => ({
    labels: summary.value?.charts.incidentTrend.map((item) => item.label) ?? [],
    datasets: [
      {
        label: 'Incidents',
        data: summary.value?.charts.incidentTrend.map((item) => item.count) ?? [],
        borderColor: CHART_COLOR.DANGER,
        backgroundColor: CHART_COLOR.DANGER,
        tension: LINE_CHART_TENSION,
      },
    ],
  }))

  const charts = computed(() => [
    {
      title: 'Mission Value by Month',
      subtitle: 'Confirmed and recovered mission orders only',
      type: 'line' as const,
      data: missionValueChart.value,
    },
    {
      title: 'Mission Orders by Service Line',
      type: 'doughnut' as const,
      data: serviceLineChart.value,
    },
    {
      title: 'Mission Performance by Operator Role',
      type: 'bar' as const,
      data: roleChart.value,
    },
    {
      title: 'Incident Trend',
      type: 'line' as const,
      data: incidentChart.value,
    },
  ])

  return {
    charts,
    dashboardStore,
    primaryMetricCards,
    secondaryMetricCards,
    summary,
    loadDashboard: dashboardStore.loadDashboard,
  }
}
