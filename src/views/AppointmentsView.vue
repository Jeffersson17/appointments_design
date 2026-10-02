<script setup>
import { computed, onMounted, ref } from 'vue'
import ActionButtons from '@/components/common/ActionButtons.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import { useTableData } from '@/composables/useTableData'
import {
  getAppointments,
  removeAppointment,
} from '@/services/appointmentsService'
import { formatDateBR } from '@/utils/format'

const appointments = ref([])
const loading = ref(true)
const actionLoading = ref(false)
const selectedAppointment = ref(null)
const showDeleteModal = ref(false)

const dateStart = ref('')
const dateEnd = ref('')
const appliedStart = ref('')
const appliedEnd = ref('')

const columns = [
  { key: 'clientName', label: 'Cliente' },
  { key: 'serviceName', label: 'Corte' },
  { key: 'datetime', label: 'Data e Hora' },
  { key: 'options', label: 'Opções', width: '56px' },
]

const dateFiltered = computed(() => {
  return appointments.value.filter((item) => {
    if (appliedStart.value && item.date < appliedStart.value) return false
    if (appliedEnd.value && item.date > appliedEnd.value) return false
    return true
  })
})

const {
  search,
  currentPage,
  totalPages,
  totalItems,
  paginatedItems,
  goToPage,
  resetPage,
} = useTableData(appointments, ['clientName', 'serviceName'], dateFiltered)

const loadAppointments = async () => {
  loading.value = true
  try {
    appointments.value = await getAppointments()
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  appliedStart.value = dateStart.value
  appliedEnd.value = dateEnd.value
  resetPage()
}

const clearFilters = () => {
  search.value = ''
  dateStart.value = ''
  dateEnd.value = ''
  appliedStart.value = ''
  appliedEnd.value = ''
  resetPage()
}

const handleEdit = (appointment) => {
  window.alert(
    `Edição do agendamento de "${appointment.clientName}" será integrada à API.`,
  )
}

const requestDelete = (appointment) => {
  selectedAppointment.value = appointment
  showDeleteModal.value = true
}

const closeModal = (force = false) => {
  if (actionLoading.value && !force) return
  showDeleteModal.value = false
  selectedAppointment.value = null
}

const deleteMessage = computed(() => {
  const name = selectedAppointment.value?.clientName ?? 'este cliente'
  return `Tem certeza que deseja excluir o agendamento de "${name}"?`
})

const confirmDelete = async () => {
  if (!selectedAppointment.value) return
  actionLoading.value = true
  try {
    await removeAppointment(selectedAppointment.value.id)
    appointments.value = appointments.value.filter(
      (item) => item.id !== selectedAppointment.value.id,
    )
    closeModal(true)
  } finally {
    actionLoading.value = false
  }
}

onMounted(loadAppointments)
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h2 class="page__title">Agendamentos</h2>
        <p class="page__subtitle">Visualize e gerencie os agendamentos.</p>
      </div>
    </header>

    <div class="panel">
      <div class="filters">
        <SearchInput
          v-model="search"
          placeholder="Buscar por cliente..."
        />

        <div class="field">
          <label for="date-start">Data inicial</label>
          <input id="date-start" v-model="dateStart" type="date" />
        </div>

        <div class="field">
          <label for="date-end">Data final</label>
          <input id="date-end" v-model="dateEnd" type="date" />
        </div>

        <button type="button" class="btn btn--primary" @click="applyFilters">
          Aplicar
        </button>
        <button type="button" class="btn btn--secondary" @click="clearFilters">
          Limpar filtros
        </button>
      </div>

      <DataTable
        class="appointments-table"
        :columns="columns"
        :rows="paginatedItems"
        :loading="loading"
      >
        <template #cell-datetime="{ row }">
          {{ formatDateBR(row.date) }} às {{ row.time }}
        </template>

        <template #cell-options="{ row }">
          <ActionButtons
            @edit="handleEdit(row)"
            @delete="requestDelete(row)"
          />
        </template>
      </DataTable>

      <Pagination
        v-if="!loading"
        class="table-pagination"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        @change="goToPage"
      />
    </div>

    <ConfirmationModal
      :open="showDeleteModal"
      title="Excluir agendamento"
      :message="deleteMessage"
      confirm-label="Excluir"
      :loading="actionLoading"
      @confirm="confirmDelete"
      @cancel="closeModal"
    />
  </section>
</template>

<style scoped>
.filters {
  margin-bottom: 1.25rem;
}

.appointments-table {
  margin-top: 0.25rem;
}

.table-pagination {
  margin-top: 1rem;
}
</style>
