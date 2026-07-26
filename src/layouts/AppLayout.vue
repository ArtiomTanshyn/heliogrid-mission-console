<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAccessRoleLabel } from '@app/access/model/labels'
import { useUserStore } from '@/stores/userStore'
import { APP_ICON } from '@shared/ui/icons'

const route = useRoute()
const userStore = useUserStore()

const navItems = [
  { label: 'Dashboard', icon: APP_ICON.CHART_LINE, to: '/' },
  { label: 'Operators', icon: APP_ICON.USERS, to: '/operators' },
  { label: 'Operations Ledger', icon: APP_ICON.FILE_EXPORT, to: '/ledger' },
  { label: 'Settings', icon: APP_ICON.COG, to: '/settings' },
]

const title = computed(() => {
  const current = navItems.find((item) => item.to === route.path)
  if (route.name === 'operator-details') return 'Operator Details'
  return current?.label ?? 'Mission Performance'
})

const isNavActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">HG</span>
        <div>
          <strong>HelioGrid</strong>
          <small>Mission Console</small>
        </div>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['nav-link', { active: isNavActive(item.to) }]"
        >
          <i :class="item.icon" />
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">HelioGrid Mission Console</p>
          <h1>{{ title }}</h1>
        </div>
        <div class="role-pill">
          <span class="status-dot" />
          {{ getAccessRoleLabel(userStore.role) }} view
        </div>
      </header>
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  min-height: 100vh;
  grid-template-columns: var(--sidebar-width) 1fr;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 22px;
  border-right: 1px solid var(--border);
  background: var(--surface);
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
}

.brand-mark {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 10px;
  color: white;
  background: var(--primary);
  font-weight: 800;
}

.brand small {
  display: block;
  color: var(--text-muted);
}

.nav {
  display: grid;
  gap: 8px;
}

.nav-link {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 11px 12px;
  border-radius: var(--radius);
  color: var(--text-muted);
  font-weight: 700;
}

.nav-link.active {
  color: var(--primary);
  background: var(--primary-soft);
}

.workspace {
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 28px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(12px);
}

.topbar h1 {
  margin: 0;
  font-size: 1.65rem;
}

.role-pill {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text-muted);
  font-weight: 700;
}

.role-pill .status-dot {
  background: var(--success);
}

.content {
  padding: 24px 28px 40px;
}

@media (max-width: 860px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    padding: 14px;
  }

  .nav {
    grid-template-columns: repeat(4, 1fr);
  }

  .nav-link {
    justify-content: center;
    font-size: 0.85rem;
  }

  .brand {
    margin-bottom: 14px;
  }

  .topbar,
  .content {
    padding-inline: 16px;
  }
}
</style>
