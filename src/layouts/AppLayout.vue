<script setup>
import { storeToRefs } from 'pinia'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebar = useSidebarStore()
const { isCollapsed } = storeToRefs(sidebar)
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--collapsed': isCollapsed }">
    <AppSidebar />
    <div class="app-shell__main">
      <AppTopbar />
      <main class="app-shell__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 28%),
    linear-gradient(180deg, #f7f9fc 0%, var(--color-bg) 40%);
}

.app-shell__main {
  min-height: 100vh;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition);
}

.app-shell--collapsed .app-shell__main {
  margin-left: var(--sidebar-collapsed);
}

.app-shell__content {
  padding: 1.5rem;
  max-width: 1280px;
  width: 100%;
  overflow-x: clip;
}

@media (max-width: 1024px) {
  .app-shell__main,
  .app-shell--collapsed .app-shell__main {
    margin-left: 0;
  }

  .app-shell__content {
    padding: 1rem;
  }
}
</style>
