<script setup>
import { computed, onMounted, ref } from 'vue'
import ActionButtons from '@/components/common/ActionButtons.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormModal from '@/components/common/FormModal.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import { useTableData } from '@/composables/useTableData'
import { createService, getServices, removeService } from '@/services/servicesService'
import { formatCurrency, formatDuration } from '@/utils/format'

const services = ref([])
const loading = ref(true)
const actionLoading = ref(false)
const formLoading = ref(false)
const formError = ref('')
const selectedService = ref(null)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)

const form = ref({
  name: '',
  price: '',
  durationMinutes: '',
})

const columns = [
  { key: 'name', label: 'Corte' },
  { key: 'price', label: 'Valor' },
  { key: 'durationMinutes', label: 'Duração' },
  { key: 'options', label: 'Opções', width: '56px' },
]

const {
  search,
  currentPage,
  totalPages,
  totalItems,
  paginatedItems,
  goToPage,
} = useTableData(services, ['name'])

const loadServices = async () => {
  loading.value = true
  try {
    services.value = await getServices()
  } finally {
    loading.value = false
  }
}

const handleEdit = (service) => {
  window.alert(`Edição de "${service.name}" será integrada à API.`)
}

const requestDelete = (service) => {
  selectedService.value = service
  showDeleteModal.value = true
}

const closeModal = (force = false) => {
  if (actionLoading.value && !force) return
  showDeleteModal.value = false
  selectedService.value = null
}

const openCreateModal = () => {
  form.value = {
    name: '',
    price: '',
    durationMinutes: '',
  }
  formError.value = ''
  showCreateModal.value = true
}

const closeCreateModal = (force = false) => {
  if (formLoading.value && !force) return
  showCreateModal.value = false
  formError.value = ''
}

const submitCreate = async () => {
  const price = Number(form.value.price)
  const durationMinutes = Number(form.value.durationMinutes)

  if (!form.value.name.trim()) {
    formError.value = 'Informe o nome do corte.'
    return
  }

  if (!Number.isFinite(price) || price <= 0) {
    formError.value = 'Informe um valor válido.'
    return
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    formError.value = 'Informe a duração em minutos.'
    return
  }

  formLoading.value = true
  formError.value = ''

  try {
    const created = await createService({
      name: form.value.name,
      price,
      durationMinutes,
    })
    services.value = [created, ...services.value]
    closeCreateModal(true)
  } catch (err) {
    formError.value = 'Não foi possível criar o serviço.'
    console.error(err)
  } finally {
    formLoading.value = false
  }
}

const deleteMessage = computed(() => {
  const name = selectedService.value?.name ?? 'este serviço'
  return `Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`
})

const confirmDelete = async () => {
  if (!selectedService.value) return
  actionLoading.value = true
  try {
    await removeService(selectedService.value.id)
    services.value = services.value.filter(
      (item) => item.id !== selectedService.value.id,
    )
    closeModal(true)
  } finally {
    actionLoading.value = false
  }
}

onMounted(loadServices)
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h2 class="page__title">Serviços / Cortes</h2>
        <p class="page__subtitle">Gerencie os serviços oferecidos pelas barbearias.</p>
      </div>
      <button type="button" class="btn btn--primary page__action" @click="openCreateModal">
        Novo serviço
      </button>
    </header>

    <div class="panel">
      <div class="panel__toolbar">
        <SearchInput v-model="search" placeholder="Buscar por corte..." />
      </div>

      <DataTable :columns="columns" :rows="paginatedItems" :loading="loading">
        <template #cell-price="{ row }">
          {{ formatCurrency(row.price) }}
        </template>

        <template #cell-durationMinutes="{ row }">
          {{ formatDuration(row.durationMinutes) }}
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

    <FormModal
      :open="showCreateModal"
      title="Novo serviço"
      submit-label="Criar serviço"
      :loading="formLoading"
      :error="formError"
      @submit="submitCreate"
      @cancel="closeCreateModal"
    >
      <div class="field">
        <label for="service-name">Corte</label>
        <input
          id="service-name"
          v-model="form.name"
          type="text"
          placeholder="Ex: Corte Masculino"
          required
        />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="service-price">Valor (R$)</label>
          <input
            id="service-price"
            v-model="form.price"
            type="number"
            min="1"
            step="0.01"
            placeholder="45"
            required
          />
        </div>

        <div class="field">
          <label for="service-duration">Duração (min)</label>
          <input
            id="service-duration"
            v-model="form.durationMinutes"
            type="number"
            min="5"
            step="5"
            placeholder="30"
            required
          />
        </div>
      </div>
    </FormModal>

    <ConfirmationModal
      :open="showDeleteModal"
      title="Excluir serviço"
      :message="deleteMessage"
      confirm-label="Excluir"
      :loading="actionLoading"
      @confirm="confirmDelete"
      @cancel="closeModal"
    />
  </section>
</template>

<style scoped>
.page__action {
  flex-shrink: 0;
}

.table-pagination {
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .page__action {
    width: 100%;
  }
}
</style>
