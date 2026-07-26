<script setup lang="ts">
import { APP_ICON } from '@shared/ui/icons'

defineProps<{
  title: string
  message: string
  icon?: string
}>()
</script>

<template>
  <div class="state-block">
    <i :class="icon ?? APP_ICON.INFO_CIRCLE" />
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.state-block {
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 220px;
  padding: 28px;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  text-align: center;
}

i {
  color: var(--primary);
  font-size: 1.8rem;
}

h3 {
  margin: 0;
}

p {
  max-width: 460px;
  margin: 0;
  color: var(--text-muted);
}
</style>
