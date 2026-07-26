<script setup lang="ts">
import { onMounted } from 'vue'
import BaseChart from '@shared/ui/components/BaseChart.vue'
import ChartCard from '@shared/ui/components/ChartCard.vue'
import MetricCard from '@shared/ui/components/MetricCard.vue'
import StateBlock from '@shared/ui/components/StateBlock.vue'
import { useDashboardPage } from '@features/dashboard/model/useDashboardPage'
import { APP_ICON } from '@shared/ui/icons'

const { charts, dashboardStore, loadDashboard, primaryMetricCards, secondaryMetricCards, summary } = useDashboardPage()

onMounted(loadDashboard)
</script>

<template>
  <section class="page">
    <StateBlock
      v-if="dashboardStore.error"
      title="Mission console error"
      :message="dashboardStore.error"
      :icon="APP_ICON.EXCLAMATION_TRIANGLE"
    />
    <template v-else-if="summary">
      <div class="grid-4">
        <MetricCard
          v-for="metric in primaryMetricCards"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :icon="metric.icon"
          :tone="metric.tone"
        />
      </div>
      <div class="grid-4">
        <MetricCard
          v-for="metric in secondaryMetricCards"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :icon="metric.icon"
          :tone="metric.tone"
        />
      </div>

      <div class="grid-2">
        <ChartCard v-for="chart in charts" :key="chart.title" :title="chart.title" :subtitle="chart.subtitle">
          <BaseChart :type="chart.type" :data="chart.data" />
        </ChartCard>
      </div>
    </template>
    <div v-else class="grid-4">
      <Skeleton v-for="item in 6" :key="item" height="118px" />
    </div>
  </section>
</template>
