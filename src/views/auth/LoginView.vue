<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getHomeRouteByRole } from "@/utils/navigation";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const resolveRedirect = (userRole) => {
  const redirectPath = route.query.redirect;

  if (typeof redirectPath === "string" && redirectPath.startsWith("/")) {
    const clientTryingPanel =
      userRole === "CLIENT" && redirectPath.startsWith("/app");
    const staffTryingClient =
      userRole !== "CLIENT" && redirectPath.startsWith("/cliente");

    if (!clientTryingPanel && !staffTryingClient) {
      return redirectPath;
    }
  }

  return getHomeRouteByRole(userRole);
};

const handleSubmit = async () => {
  error.value = "";
  loading.value = true;

  try {
    const user = await auth.login({
      email: email.value,
      password: password.value,
    });

    await router.push(resolveRedirect(user.role));
  } catch (err) {
    if (
      err?.code === "INVALID_CREDENTIALS" ||
      err?.message === "INVALID_CREDENTIALS" ||
      err?.response?.status === 401
    ) {
      error.value = "E-mail ou senha inválidos.";
    } else {
      error.value = "Não foi possível entrar. Tente novamente.";
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-card">
    <div class="login-card__brand">
      <div class="login-card__logo" aria-hidden="true">AP</div>
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

      <button
        type="submit"
        class="btn btn--primary login-card__submit"
        :disabled="loading"
      >
        {{ loading ? "Entrando..." : "Entrar" }}
      </button>
    </form>
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
  font-family: var(--font-display);
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

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem 1.15rem;
  }

  .login-card__demos div {
    display: grid;
    grid-template-columns: 1fr;
  }

  .login-card__demos .btn {
    width: 100%;
  }
}
</style>
