<script setup lang="ts">
import MissionOrdersTable from '@features/operator-details/ui/MissionOrdersTable.vue'
import BaseChart from '@shared/ui/components/BaseChart.vue'
import ChartCard from '@shared/ui/components/ChartCard.vue'
import MetricCard from '@shared/ui/components/MetricCard.vue'
import StateBlock from '@shared/ui/components/StateBlock.vue'
import { useOperatorDetailsPage } from '@features/operator-details/model/useOperatorDetailsPage'
import { getOperatorRoleLabel } from '@entities/operator/model/labels'
import { APP_ICON } from '@shared/ui/icons'

const { operator, operatorsStore, charts, latestMissionOrders, metricCards, profileTags, scoreFormulaItems } =
  useOperatorDetailsPage()
</script>

<template>
  <section class="page">
    <StateBlock
      v-if="operatorsStore.error"
      title="Operator unavailable"
      :message="operatorsStore.error"
      :icon="APP_ICON.LOCK"
    />
    <template v-else-if="operator">
      <section class="profile panel">
        <img v-if="operator.avatarUrl" :src="operator.avatarUrl" :alt="operator.name" />
        <span v-else class="avatar-fallback" aria-hidden="true">{{ operator.initials }}</span>
        <div>
          <p class="eyebrow">{{ getOperatorRoleLabel(operator.role) }}</p>
          <h2>{{ operator.name }}</h2>
          <p class="muted">{{ operator.email }}</p>
          <div class="profile-tags">
            <Tag v-for="tag in profileTags" :key="tag.label" :value="tag.label" :severity="tag.severity" />
          </div>
        </div>
      </section>

      <div class="grid-4">
        <MetricCard
          v-for="metric in metricCards"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :icon="metric.icon"
          :tone="metric.tone"
        />
      </div>

      <div class="grid-2">
        <ChartCard v-for="chart in charts" :key="chart.title" :title="chart.title">
          <BaseChart :type="chart.type" :data="chart.data" />
        </ChartCard>
      </div>

      <section class="panel">
        <h2>Latest Mission Orders</h2>
        <MissionOrdersTable :mission-orders="latestMissionOrders" />
      </section>

      <section class="panel score">
        <div>
          <p class="eyebrow">Why this score?</p>
          <h2>Mission score explanation</h2>
          <p class="muted">
            The score blends mission value, reliability, readiness, and incident risk into one weighted metric.
          </p>
        </div>
        <div class="formula">
          <span v-for="item in scoreFormulaItems" :key="item">{{ item }}</span>
        </div>
      </section>
    </template>
    <Skeleton v-else height="320px" />
  </section>
</template>

<style scoped>
.profile {
  display: flex;
  gap: 18px;
  align-items: center;
}

.profile img,
.avatar-fallback {
  width: 86px;
  height: 86px;
  border-radius: 999px;
}

.avatar-fallback {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  background: var(--surface-muted);
  color: var(--text-muted);
  font-weight: 800;
}

.profile h2 {
  margin-bottom: 4px;
}

.profile-tags,
.formula {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.score {
  display: grid;
  gap: 16px;
}

.formula span {
  padding: 10px 12px;
  border-radius: var(--radius);
  background: var(--surface-muted);
  font-weight: 700;
}
</style>
