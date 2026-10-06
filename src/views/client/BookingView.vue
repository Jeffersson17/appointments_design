<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import {
  cancelBooking,
  completeBooking,
  createBooking,
  getActiveBooking,
  getAvailableSlots,
  getBookingServices,
} from '@/services/bookingService'
import { useAuthStore } from '@/stores/auth'
import { formatCurrency, formatDateBR, formatDuration } from '@/utils/format'

const auth = useAuthStore()

const today = new Date()
const pad = (value) => String(value).padStart(2, '0')
const minDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

const selectedDate = ref('')
const selectedTime = ref('')
const selectedServiceId = ref(null)

const slots = ref([])
const services = ref([])
const loadingSlots = ref(false)
const loadingServices = ref(false)
const loadingActive = ref(true)
const submitting = ref(false)
const actionLoading = ref(false)
const activeBooking = ref(null)
const error = ref('')
const feedback = ref('')

const modal = ref({
  open: false,
  action: null,
})

const selectedService = computed(() =>
  services.value.find((item) => item.id === selectedServiceId.value) ?? null,
)

const canConfirm = computed(
  () =>
    Boolean(selectedDate.value) &&
    Boolean(selectedTime.value) &&
    Boolean(selectedService.value) &&
    !submitting.value &&
    !activeBooking.value,
)

const loadActiveBooking = async () => {
  loadingActive.value = true
  error.value = ''

  try {
    activeBooking.value = await getActiveBooking(auth.user?.id)
  } catch (err) {
    activeBooking.value = null
    error.value = 'Não foi possível carregar seu agendamento.'
    console.error(err)
  } finally {
    loadingActive.value = false
  }
}

const loadSlots = async (isoDate) => {
  loadingSlots.value = true
  selectedTime.value = ''
  selectedServiceId.value = null
  services.value = []
  error.value = ''

  try {
    slots.value = await getAvailableSlots(isoDate)
  } catch (err) {
    slots.value = []
    error.value = 'Não foi possível carregar os horários.'
    console.error(err)
  } finally {
    loadingSlots.value = false
  }
}

const loadServices = async () => {
  loadingServices.value = true
  selectedServiceId.value = null
  error.value = ''

  try {
    services.value = await getBookingServices()
  } catch (err) {
    services.value = []
    error.value = 'Não foi possível carregar os cortes.'
    console.error(err)
  } finally {
    loadingServices.value = false
  }
}

watch(selectedDate, (value) => {
  if (!value) {
    slots.value = []
    selectedTime.value = ''
    selectedServiceId.value = null
    services.value = []
    return
  }
  loadSlots(value)
})

watch(selectedTime, (value) => {
  if (!value) {
    services.value = []
    selectedServiceId.value = null
    return
  }
  loadServices()
})

const selectTime = (time) => {
  selectedTime.value = time
}

const selectService = (serviceId) => {
  selectedServiceId.value = serviceId
}

const resetFlow = () => {
  selectedDate.value = ''
  selectedTime.value = ''
  selectedServiceId.value = null
  slots.value = []
  services.value = []
  error.value = ''
}

const confirmBooking = async () => {
  if (!canConfirm.value) return

  submitting.value = true
  error.value = ''
  feedback.value = ''

  try {
    activeBooking.value = await createBooking({
      clientName: auth.userName,
      clientId: auth.user?.id,
      serviceId: selectedService.value.id,
      serviceName: selectedService.value.name,
      date: selectedDate.value,
      time: selectedTime.value,
      price: selectedService.value.price,
      duration: selectedService.value.duration,
    })
    resetFlow()
    feedback.value = 'Agendamento confirmado com sucesso.'
  } catch (err) {
    error.value =
      err?.message === 'ACTIVE_BOOKING_EXISTS'
        ? 'Você já possui um agendamento ativo.'
        : 'Não foi possível confirmar o agendamento.'
    console.error(err)
  } finally {
    submitting.value = false
  }
}

const openActionModal = (action) => {
  modal.value = { open: true, action }
}

const closeActionModal = () => {
  if (actionLoading.value) return
  modal.value = { open: false, action: null }
}

const confirmAction = async () => {
  if (!activeBooking.value || !modal.value.action) return

  actionLoading.value = true
  error.value = ''
  feedback.value = ''

  try {
    if (modal.value.action === 'complete') {
      await completeBooking(activeBooking.value.id)
      feedback.value = 'Agendamento concluído.'
    } else {
      await cancelBooking(activeBooking.value.id)
      feedback.value = 'Agendamento cancelado.'
    }

    activeBooking.value = null
    modal.value = { open: false, action: null }
  } catch (err) {
    error.value = 'Não foi possível atualizar o agendamento.'
    console.error(err)
  } finally {
    actionLoading.value = false
  }
}

onMounted(loadActiveBooking)
</script>

<template>
  <section class="booking">
    <header class="booking__header">
      <h1>Olá, {{ auth.userName.split(' ')[0] }}</h1>
      <p v-if="activeBooking">
        Você já tem um agendamento ativo. Conclua ou cancele para marcar outro.
      </p>
      <p v-else>
        Escolha a data, o horário e o corte para finalizar seu agendamento.
      </p>
    </header>

    <p v-if="feedback" class="booking__feedback">{{ feedback }}</p>
    <p v-if="error && (activeBooking || loadingActive)" class="booking__error">
      {{ error }}
    </p>

    <div v-if="loadingActive" class="panel booking__loading-panel">
      Carregando seu agendamento...
    </div>

    <section v-else-if="activeBooking" class="panel booking__active">
      <div class="booking__active-badge">Agendamento ativo</div>
      <h2>{{ activeBooking.serviceName }}</h2>

      <ul>
        <li>
          <span>Data</span>
          <strong>{{ formatDateBR(activeBooking.date) }}</strong>
        </li>
        <li>
          <span>Horário</span>
          <strong>{{ activeBooking.time }}</strong>
        </li>
        <li>
          <span>Duração</span>
          <strong>{{ formatDuration(activeBooking.duration) }}</strong>
        </li>
        <li>
          <span>Valor</span>
          <strong>{{ formatCurrency(activeBooking.price) }}</strong>
        </li>
      </ul>

      <div class="booking__actions">
        <button
          type="button"
          class="btn btn--primary"
          :disabled="actionLoading"
          @click="openActionModal('complete')"
        >
          Concluir agendamento
        </button>
        <button
          type="button"
          class="btn btn--danger"
          :disabled="actionLoading"
          @click="openActionModal('cancel')"
        >
          Cancelar agendamento
        </button>
      </div>
    </section>

    <template v-else>
      <section class="panel booking__step">
        <div class="booking__step-title">
          <span>1</span>
          <h2>Escolha a data</h2>
        </div>

        <div class="field">
          <label for="booking-date">Data</label>
          <input
            id="booking-date"
            v-model="selectedDate"
            type="date"
            :min="minDate"
          />
        </div>
      </section>

      <section v-if="selectedDate" class="panel booking__step">
        <div class="booking__step-title">
          <span>2</span>
          <h2>Horários disponíveis</h2>
        </div>
        <p class="booking__step-hint">
          {{ formatDateBR(selectedDate) }}
        </p>

        <div v-if="loadingSlots" class="booking__loading">Carregando horários...</div>

        <EmptyState
          v-else-if="!slots.length"
          message="Nenhum horário disponível para esta data"
        />

        <div v-else class="booking__slots">
          <button
            v-for="time in slots"
            :key="time"
            type="button"
            class="booking__slot"
            :class="{ 'booking__slot--active': selectedTime === time }"
            @click="selectTime(time)"
          >
            {{ time }}
          </button>
        </div>
      </section>

      <section v-if="selectedTime" class="panel booking__step">
        <div class="booking__step-title">
          <span>3</span>
          <h2>Escolha o corte</h2>
        </div>
        <p class="booking__step-hint">
          Horário selecionado: {{ selectedTime }}
        </p>

        <div v-if="loadingServices" class="booking__loading">Carregando cortes...</div>

        <EmptyState
          v-else-if="!services.length"
          message="Nenhum registro encontrado"
        />

        <div v-else class="booking__services">
          <button
            v-for="service in services"
            :key="service.id"
            type="button"
            class="booking__service"
            :class="{ 'booking__service--active': selectedServiceId === service.id }"
            @click="selectService(service.id)"
          >
            <div>
              <strong>{{ service.name }}</strong>
              <span>{{ formatDuration(service.duration) }}</span>
            </div>
            <em>{{ formatCurrency(service.price) }}</em>
          </button>
        </div>
      </section>

      <section v-if="selectedService" class="panel booking__summary">
        <h2>Resumo</h2>
        <ul>
          <li>
            <span>Data</span>
            <strong>{{ formatDateBR(selectedDate) }}</strong>
          </li>
          <li>
            <span>Horário</span>
            <strong>{{ selectedTime }}</strong>
          </li>
          <li>
            <span>Corte</span>
            <strong>{{ selectedService.name }}</strong>
          </li>
          <li>
            <span>Valor</span>
            <strong>{{ formatCurrency(selectedService.price) }}</strong>
          </li>
        </ul>

        <p v-if="error" class="booking__error">{{ error }}</p>

        <button
          type="button"
          class="btn btn--primary booking__confirm"
          :disabled="!canConfirm"
          @click="confirmBooking"
        >
          {{ submitting ? 'Confirmando...' : 'Confirmar agendamento' }}
        </button>
      </section>
    </template>

    <ConfirmationModal
      :open="modal.open"
      :title="
        modal.action === 'complete'
          ? 'Concluir agendamento'
          : 'Cancelar agendamento'
      "
      :message="
        modal.action === 'complete'
          ? 'Deseja marcar este agendamento como concluído?'
          : 'Tem certeza que deseja cancelar este agendamento?'
      "
      :confirm-label="
        modal.action === 'complete' ? 'Concluir' : 'Cancelar agendamento'
      "
      cancel-label="Voltar"
      :danger="modal.action === 'cancel'"
      :loading="actionLoading"
      @confirm="confirmAction"
      @cancel="closeActionModal"
    />
  </section>
</template>

<style scoped>
.booking {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking__header h1 {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2rem);
  color: var(--color-primary-dark);
  letter-spacing: -0.02em;
}

.booking__header p {
  margin-top: 0.35rem;
  color: var(--color-muted);
}

.booking__step,
.booking__summary,
.booking__active,
.booking__loading-panel {
  animation: rise 0.22s ease;
}

.booking__loading-panel {
  color: var(--color-muted);
  text-align: center;
  padding: 2rem 1rem;
}

.booking__active-badge {
  display: inline-flex;
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
}

.booking__active h2,
.booking__step-title h2,
.booking__summary h2 {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-primary-dark);
}

.booking__active ul,
.booking__summary ul {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.booking__active li,
.booking__summary li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--color-border);
}

.booking__active li:last-child,
.booking__summary li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.booking__active span,
.booking__summary span {
  color: var(--color-muted);
}

.booking__active strong,
.booking__summary strong {
  text-align: right;
}

.booking__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
  margin-top: 1.35rem;
}

.booking__step-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.booking__step-title span {
  width: 1.8rem;
  height: 1.8rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
}

.booking__step-hint {
  margin: -0.35rem 0 1rem;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.booking__loading {
  color: var(--color-muted);
  padding: 1rem 0;
}

.booking__slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 0.55rem;
}

.booking__slot {
  min-height: 2.6rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: #fff;
  color: var(--color-text);
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.booking__slot:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.booking__slot--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.booking__services {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.booking__service {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.booking__service:hover {
  border-color: var(--color-primary);
}

.booking__service--active {
  border-color: var(--color-primary);
  background: #f8fbff;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.booking__service strong {
  display: block;
  font-size: 0.98rem;
  color: var(--color-text);
}

.booking__service span {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.82rem;
  color: var(--color-muted);
}

.booking__service em {
  font-style: normal;
  font-weight: 700;
  color: var(--color-primary-dark);
  white-space: nowrap;
}

.booking__confirm {
  width: 100%;
  margin-top: 1.25rem;
}

.booking__error {
  margin-top: 0.9rem;
  color: var(--color-danger);
  font-size: 0.9rem;
}

.booking__feedback {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--color-success-soft);
  color: var(--color-success);
  font-size: 0.92rem;
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

@media (max-width: 540px) {
  .booking__actions {
    grid-template-columns: 1fr;
  }
}
</style>
