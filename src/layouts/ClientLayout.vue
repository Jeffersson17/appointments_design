<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import UserAvatar from "@/components/layout/UserAvatar.vue";
import { useAuthStore } from "@/stores/auth";
import { ROLE_LABELS } from "@/types/roles";

const auth = useAuthStore();
const { user, userName, role } = storeToRefs(auth);
const router = useRouter();

const handleLogout = async () => {
  await auth.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <div class="client-shell">
    <header class="client-shell__header">
      <div class="client-shell__brand">
        <div class="client-shell__logo" aria-hidden="true">A</div>
        <div>
          <strong>AgendaPro</strong>
          <span>Agendamento online</span>
        </div>
      </div>

      <nav class="client-shell__nav" aria-label="Menu do cliente">
        <RouterLink
          :to="{ name: 'client-booking' }"
          class="client-shell__nav-link"
        >
          Agendar
        </RouterLink>
        <RouterLink
          :to="{ name: 'client-history' }"
          class="client-shell__nav-link"
        >
          Histórico
        </RouterLink>
      </nav>

      <div class="client-shell__user">
        <div class="client-shell__user-meta">
          <span class="client-shell__user-name">{{ userName }}</span>
          <span class="client-shell__user-role">{{
            ROLE_LABELS[role] || role
          }}</span>
        </div>
        <UserAvatar :name="userName" :src="user?.avatarUrl" />
        <button
          type="button"
          class="btn btn--secondary btn--sm"
          @click="handleLogout"
        >
          Sair
        </button>
      </div>
    </header>

    <main class="client-shell__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.client-shell {
  min-height: 100vh;
  font-family: var(--font-display);
  background:
    radial-gradient(
      circle at top right,
      rgba(37, 99, 235, 0.12),
      transparent 30%
    ),
    linear-gradient(180deg, #f7f9fc 0%, var(--color-bg) 45%);
}

.client-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 72px;
  padding: 0.9rem 1.25rem;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.client-shell__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.client-shell__logo {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: linear-gradient(145deg, #2563eb, #1e3a8a);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
}

.client-shell__brand strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--color-primary-dark);
}

.client-shell__brand span {
  display: block;
  font-size: 0.78rem;
  color: var(--color-muted);
}

.client-shell__nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.client-shell__nav-link {
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  color: var(--color-muted);
  font-size: 0.92rem;
  font-weight: 600;
  transition:
    background 0.15s,
    color 0.15s;
}

.client-shell__nav-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.client-shell__nav-link.router-link-active {
  color: var(--color-primary);
  background: var(--color-primary-soft);
}

.client-shell__user {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.client-shell__user-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
}

.client-shell__user-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.client-shell__user-role {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.client-shell__content {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 1.5rem 1rem 2.5rem;
}

@media (max-width: 720px) {
  .client-shell__header {
    flex-wrap: wrap;
    padding: 0.8rem 1rem;
  }

  .client-shell__nav {
    order: 3;
    width: 100%;
  }

  .client-shell__user-meta {
    display: none;
  }

  .client-shell__content {
    padding: 1rem 0.85rem 2rem;
  }
}
</style>
