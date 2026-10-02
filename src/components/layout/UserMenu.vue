<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { ROLE_LABELS } from '@/types/roles'
import UserAvatar from './UserAvatar.vue'

const auth = useAuthStore()
const { user, userName, userEmail, role } = storeToRefs(auth)
const router = useRouter()

const open = ref(false)
const root = ref(null)

const toggle = () => {
  open.value = !open.value
}

const close = () => {
  open.value = false
}

const handleLogout = async () => {
  close()
  await auth.logout()
  router.push({ name: 'login' })
}

const onClickOutside = (event) => {
  if (root.value && !root.value.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div ref="root" class="user-menu">
    <button type="button" class="user-menu__trigger" @click="toggle">
      <UserAvatar :name="userName" :src="user?.avatarUrl" />
      <span class="user-menu__meta">
        <span class="user-menu__name">{{ userName }}</span>
        <span class="user-menu__role">{{ ROLE_LABELS[role] || role }}</span>
      </span>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
        />
      </svg>
    </button>

    <div v-if="open" class="user-menu__dropdown">
      <div class="user-menu__header">
        <strong>{{ userName }}</strong>
        <span>{{ userEmail }}</span>
      </div>
      <button type="button" class="user-menu__item" @click="handleLogout">
        Sair
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-menu {
  position: relative;
}

.user-menu__trigger {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.25rem 0.4rem 0.25rem 0.25rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.user-menu__trigger:hover,
.user-menu__trigger:focus-visible {
  background: #f1f5f9;
  border-color: var(--color-border);
  outline: none;
}

.user-menu__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.user-menu__name {
  font-size: 0.9rem;
  font-weight: 600;
}

.user-menu__role {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.user-menu__trigger svg {
  width: 1rem;
  height: 1rem;
  color: var(--color-muted);
}

.user-menu__dropdown {
  position: absolute;
  top: calc(100% + 0.45rem);
  right: 0;
  width: 220px;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  z-index: 50;
  animation: menu-in 0.15s ease;
}

.user-menu__header {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.65rem 0.7rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.35rem;
}

.user-menu__header strong {
  font-size: 0.9rem;
}

.user-menu__header span {
  font-size: 0.78rem;
  color: var(--color-muted);
  word-break: break-all;
}

.user-menu__item {
  width: 100%;
  padding: 0.65rem 0.7rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-danger);
  cursor: pointer;
}

.user-menu__item:hover {
  background: var(--color-danger-soft);
}

@keyframes menu-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .user-menu__meta {
    display: none;
  }
}
</style>
