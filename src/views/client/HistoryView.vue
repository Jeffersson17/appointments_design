<script setup>
import { onMounted, ref } from 'vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { getBookingHistory } from '@/services/bookingService'
import { useAuthStore } from '@/stores/auth'
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
} from '@/types/status'
import { formatCurrency, formatDateBR, formatDuration } from '@/utils/format'

const auth = useAuthStore()

const history = ref([])
const loading = ref(true)
const error = ref('')

const statusClass = (status) => {
  if (status === APPOINTMENT_STATUS.COMPLETED) return 'history__status--done'
  if (status === APPOINTMENT_STATUS.CANCELLED) return 'history__status--cancelled'
  return ''
}

const loadHistory = async () => {
  loading.value = true
  error.value = ''

  try {
    history.value = await getBookingHistory(auth.user?.id)
  } catch (err) {
    history.value = []
    error.value = 'Não foi possível carregar o histórico.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadHistory)
</script>

<template>
  <section class="history">
    <header class="history__header">
      <h1>Histórico</h1>
      <p>Visualize seus agendamentos anteriores. Esta tela é somente leitura.</p>
    </header>

    <div v-if="loading" class="panel history__loading">
      Carregando histórico...
    </div>

    <p v-else-if="error" class="history__error">{{ error }}</p>

    <EmptyState
      v-else-if="!history.length"
      message="Nenhum agendamento no histórico"
    />

    <ul v-else class="history__list">
      <li v-for="item in history" :key="item.id" class="panel history__item">
        <div class="history__item-top">
          <h2>{{ item.serviceName }}</h2>
          <span class="history__status" :class="statusClass(item.status)">
            {{ APPOINTMENT_STATUS_LABELS[item.status] || item.status }}
          </span>
        </div>

        <dl>
          <div>
            <dt>Data</dt>
            <dd>{{ formatDateBR(item.date) }}</dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>{{ item.time }}</dd>
          </div>
          <div>
            <dt>Duração</dt>
            <dd>{{ formatDuration(item.duration) }}</dd>
          </div>
          <div>
            <dt>Valor</dt>
            <dd>{{ formatCurrency(item.price) }}</dd>
          </div>
        </dl>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history__header h1 {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2rem);
  color: var(--color-primary-dark);
  letter-spacing: -0.02em;
}

.history__header p {
  margin-top: 0.35rem;
  color: var(--color-muted);
}

.history__loading {
  color: var(--color-muted);
  text-align: center;
  padding: 2rem 1rem;
}

.history__error {
  margin: 0;
  color: var(--color-danger);
  font-size: 0.92rem;
}

.history__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.history__item {
  animation: rise 0.22s ease;
}

.history__item-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.history__item h2 {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--color-primary-dark);
}

.history__status {
  flex-shrink: 0;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: #e2e8f0;
  color: #475569;
}

.history__status--done {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.history__status--cancelled {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.history__item dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem 1rem;
  margin: 1rem 0 0;
}

.history__item dt {
  color: var(--color-muted);
  font-size: 0.82rem;
}

.history__item dd {
  margin: 0.15rem 0 0;
  font-weight: 600;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .history__item dl {
    grid-template-columns: 1fr;
  }
}
</style>
