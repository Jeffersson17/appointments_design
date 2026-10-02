<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import UserMenu from './UserMenu.vue'

const route = useRoute()
const sidebar = useSidebarStore()

const pageTitle = computed(() => route.meta.title || 'Painel')
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <button
        type="button"
        class="topbar__menu"
        aria-label="Abrir menu"
        @click="sidebar.toggle()"
      >
        <span />
        <span />
        <span />
      </button>

      <button
        type="button"
        class="topbar__collapse"
        aria-label="Recolher menu"
        @click="sidebar.toggleCollapse()"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h18v2H3v-2z"
          />
        </svg>
      </button>

      <h1 class="topbar__title">{{ pageTitle }}</h1>
    </div>

    <UserMenu />
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: var(--topbar-height);
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.topbar__title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar__menu,
.topbar__collapse {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.topbar__menu {
  flex-direction: column;
  gap: 4px;
}

.topbar__menu span {
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
}

.topbar__collapse {
  display: none;
}

.topbar__collapse svg {
  width: 1.15rem;
  height: 1.15rem;
}

@media (min-width: 1025px) {
  .topbar__menu {
    display: none;
  }

  .topbar__collapse {
    display: inline-flex;
  }
}

@media (max-width: 640px) {
  .topbar {
    padding: 0.75rem 1rem;
  }
}
</style>
