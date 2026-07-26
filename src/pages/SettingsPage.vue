<script setup lang="ts">
import { getAccessRoleLabel } from '@app/access/model/labels'
import { USER_ROLE_OPTIONS, USER_ROLE_PERMISSIONS } from '@app/access/model/roles'
import { useUserStore } from '@/stores/userStore'
import { APP_ICON } from '@shared/ui/icons'

const userStore = useUserStore()
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Settings</p>
        <h2>Access role demo switcher</h2>
        <p class="muted">Switch access role to verify route-level data scoping and ledger permissions.</p>
      </div>
    </div>

    <section class="panel role-grid">
      <button
        v-for="role in USER_ROLE_OPTIONS"
        :key="role"
        :class="['role-card', { active: userStore.role === role }]"
        @click="userStore.setRole(role)"
      >
        <span>{{ getAccessRoleLabel(role) }}</span>
        <i :class="userStore.role === role ? APP_ICON.CHECK_CIRCLE : APP_ICON.CIRCLE" />
      </button>
    </section>

    <section class="panel">
      <p class="eyebrow">Current access role</p>
      <h2>{{ getAccessRoleLabel(userStore.role) }}</h2>
      <ul>
        <li v-for="item in USER_ROLE_PERMISSIONS[userStore.role]" :key="item">{{ item }}</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.role-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
}

.role-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
}

.role-card.active {
  border-color: var(--primary);
  background: var(--primary-soft);
  color: var(--primary);
}

li {
  margin-bottom: 8px;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .role-grid {
    grid-template-columns: 1fr;
  }
}
</style>
