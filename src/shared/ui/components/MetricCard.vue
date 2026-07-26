<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  tone?: 'blue' | 'green' | 'amber' | 'red'
  helper?: string
}>()
</script>

<template>
  <article class="metric-card">
    <div :class="['icon', tone ?? 'blue']">
      <i :class="icon" />
    </div>
    <div>
      <p>{{ label }}</p>
      <strong>{{ value }}</strong>
      <small v-if="helper">{{ helper }}</small>
    </div>
  </article>
</template>

<style scoped>
.metric-card {
  display: flex;
  gap: 14px;
  align-items: center;
  min-height: 118px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 10px;
}

.blue {
  color: var(--p-mission-metric-blue-color);
  background: var(--p-mission-metric-blue-background);
}
.green {
  color: var(--p-mission-metric-green-color);
  background: var(--p-mission-metric-green-background);
}
.amber {
  color: var(--p-mission-metric-amber-color);
  background: var(--p-mission-metric-amber-background);
}
.red {
  color: var(--p-mission-metric-red-color);
  background: var(--p-mission-metric-red-background);
}

p {
  margin: 0 0 6px;
  color: var(--text-muted);
  font-weight: 700;
}

strong {
  display: block;
  font-size: 1.55rem;
}

small {
  color: var(--text-muted);
}
</style>
