<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/types/roles'
import { getHomeRouteByRole } from '@/utils/navigation'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('joao@agendapro.com')
const password = ref('senha123')
const loading = ref(false)
const error = ref('')

const demoAccounts = [
  { label: 'Admin', email: 'joao@agendapro.com' },
  { label: 'Empresa', email: 'empresa@agendapro.com' },
  { label: 'Cliente', email: 'cliente@agendapro.com' },
]

const useDemoAccount = (demoEmail) => {
  email.value = demoEmail
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    const user = await auth.login(email.value, password.value)
    const home = getHomeRouteByRole(user.role)

    if (typeof route.query.redirect === 'string') {
      const redirectPath = route.query.redirect
      const clientTryingPanel =
        user.role === ROLES.CLIENT && redirectPath.startsWith('/app')
      const staffTryingClient =
        user.role !== ROLES.CLIENT && redirectPath.startsWith('/cliente')

      if (!clientTryingPanel && !staffTryingClient) {
        await router.push(redirectPath)
        return
      }
    }

    await router.push(home)
  } catch (err) {
    error.value = 'Não foi possível entrar. Tente novamente.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-card">
    <div class="login-card__brand">
      <div class="login-card__logo" aria-hidden="true">A</div>
      <div>
        <h1>AgendaPro</h1>
        <p>Acesse com o seu perfil</p>
      </div>
    </div>

    <form class="login-card__form" @submit.prevent="handleSubmit">
      <div class="field">
        <label for="email">E-mail</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="username"
          required
        />
      </div>

      <div class="field">
        <label for="password">Senha</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="error" class="login-card__error">{{ error }}</p>

      <button type="submit" class="btn btn--primary login-card__submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <div class="login-card__demos">
      <p>Acesso rápido para testes:</p>
      <div>
        <button
          v-for="account in demoAccounts"
          :key="account.email"
          type="button"
          class="btn btn--secondary btn--sm"
          @click="useDemoAccount(account.email)"
        >
          {{ account.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  padding: 2rem 1.75rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.22);
}

.login-card__brand {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.75rem;
}

.login-card__logo {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(145deg, #2563eb, #1e3a8a);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
}

.login-card__brand h1 {
  font-family: var(--font-display);
  font-size: 1.7rem;
  color: var(--color-primary-dark);
  letter-spacing: -0.02em;
}

.login-card__brand p {
  margin-top: 0.2rem;
  color: var(--color-muted);
  font-size: 0.92rem;
}

.login-card__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-card__submit {
  width: 100%;
  margin-top: 0.35rem;
}

.login-card__error {
  margin: 0;
  color: var(--color-danger);
  font-size: 0.88rem;
}

.login-card__demos {
  margin-top: 1.35rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--color-border);
}

.login-card__demos p {
  margin: 0 0 0.65rem;
  color: var(--color-muted);
  font-size: 0.8rem;
}

.login-card__demos div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
</style>
