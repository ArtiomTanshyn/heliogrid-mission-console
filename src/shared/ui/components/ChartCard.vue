<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <section class="chart-card">
    <div class="chart-header">
      <h2>{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="chart-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.chart-card {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.chart-header {
  margin-bottom: 16px;
}

h2 {
  margin: 0 0 4px;
  font-size: 1rem;
}

p {
  margin: 0;
  color: var(--text-muted);
}

.chart-body {
  position: relative;
  min-height: 280px;
}
</style>
