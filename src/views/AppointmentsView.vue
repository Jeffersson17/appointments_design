<script setup>
import { computed, onMounted, ref } from 'vue'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import { useTableData } from '@/composables/useTableData'
import { getAppointments } from '@/services/appointmentsService'
import { APPOINTMENT_STATUS_LABELS } from '@/types/status'
import { formatDateTimeBR } from '@/utils/format'

const appointments = ref([])
const loading = ref(true)

const dateStart = ref('')
const dateEnd = ref('')
const appliedStart = ref('')
const appliedEnd = ref('')

const columns = [
  { key: 'clientName', label: 'Cliente' },
  { key: 'serviceName', label: 'Corte' },
  { key: 'datetime', label: 'Data e Hora' },
  { key: 'status', label: 'Status do agendamento' },
]

const getAppointmentDate = (item) =>
  String(item.scheduled_at ?? '').slice(0, 10)

const dateFiltered = computed(() => {
  return appointments.value.filter((item) => {
    const itemDate = getAppointmentDate(item)
    if (appliedStart.value && itemDate < appliedStart.value) return false
    if (appliedEnd.value && itemDate > appliedEnd.value) return false
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

const normalizeAppointment = (item) => ({
  ...item,
  clientName: `${item.client?.first_name ?? ''} ${item.client?.last_name ?? ''}`.trim(),
  serviceName: item.service?.service_name ?? '',
})

const loadAppointments = async () => {
  loading.value = true
  try {
    const data = await getAppointments()
    const list = Array.isArray(data) ? data : data?.results ?? []
    appointments.value = list.map(normalizeAppointment)
  } catch {
    window.alert('Erro ao carregar os agendamentos.')
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

const formatStatusAppointments = (status) => {
  return APPOINTMENT_STATUS_LABELS[status] ?? status
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
        <template #cell-clientName="{ row }">
          {{ row.clientName || '—' }}
        </template>
        <template #cell-serviceName="{ row }">
          {{ row.serviceName || '—' }}
        </template>
        <template #cell-datetime="{ row }">
          {{ formatDateTimeBR(row.scheduled_at) }}
        </template>
        <template #cell-status="{ row }">
          {{ formatStatusAppointments(row.status) }}
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
