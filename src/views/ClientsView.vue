<script setup>
import { computed, onMounted, ref } from 'vue'
import ActionButtons from '@/components/common/ActionButtons.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormModal from '@/components/common/FormModal.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import { useTableData } from '@/composables/useTableData'
import { createClient, getClients, removeClient } from '@/services/clientsService'

const clients = ref([])
const loading = ref(true)
const actionLoading = ref(false)
const formLoading = ref(false)
const formError = ref('')
const selectedClient = ref(null)
const showDeleteModal = ref(false)
const showCreateModal = ref(false)

const form = ref({
  name: '',
  phone_number: '',
  company_name: '',
})

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'phone_number', label: 'Telefone' },
  { key: 'company_name', label: 'Empresa' },
  { key: 'options', label: 'Opções', width: '56px' },
]

const {
  search,
  currentPage,
  totalPages,
  totalItems,
  paginatedItems,
  goToPage,
} = useTableData(clients, ['name', 'phone_number', 'company_name'])

const loadClients = async () => {
  loading.value = true
  try {
    const clientList = await getClients()
    clients.value = clientList
  } finally {
    loading.value = false
  }
}

const handleEdit = (client) => {
  window.alert(`Edição de "${client.name}" será integrada à API.`)
}

const requestDelete = (client) => {
  selectedClient.value = client
  showDeleteModal.value = true
}

const closeModal = (force = false) => {
  if (actionLoading.value && !force) return
  showDeleteModal.value = false
  selectedClient.value = null
}

const openCreateModal = () => {
  form.value = {
    name: '',
    phone_number: '',
    company_name: companyOptions.value[0] || '',
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
  if (
    !form.value.name.trim() ||
    !form.value.phone_number.trim() ||
    !form.value.company_name.trim()
  ) {
    formError.value = 'Preencha nome, telefone e empresa.'
    return
  }

  formLoading.value = true
  formError.value = ''

  try {
    const created = await createClient(form.value)
    clients.value = [created, ...clients.value]
    closeCreateModal(true)
  } catch (err) {
    formError.value = 'Não foi possível criar o cliente.'
    console.error(err)
  } finally {
    formLoading.value = false
  }
}

const deleteMessage = computed(() => {
  const name = selectedClient.value?.name ?? 'este cliente'
  return `Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`
})

const confirmDelete = async () => {
  if (!selectedClient.value) return
  actionLoading.value = true
  try {
    await removeClient(selectedClient.value.id)
    clients.value = clients.value.filter(
      (item) => item.id !== selectedClient.value.id,
    )
    closeModal(true)
  } finally {
    actionLoading.value = false
  }
}

onMounted(loadClients)
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h2 class="page__title">Clientes</h2>
        <p class="page__subtitle">Gerencie os clientes das barbearias.</p>
      </div>
      <button type="button" class="btn btn--primary page__action" @click="openCreateModal">
        Novo cliente
      </button>
    </header>

    <div class="panel">
      <div class="panel__toolbar">
        <SearchInput
          v-model="search"
          placeholder="Buscar por nome, telefone ou empresa..."
        />
      </div>

      <DataTable :columns="columns" :rows="paginatedItems" :loading="loading">
        <template #cell-name="{ row }">
          <span>{{ row.first_name }} {{ row.last_name }}</span>
        </template>
        <template #cell-phone_number="{ row }">
          <span class="table__cell--monospace">{{ row.phone_number }}</span>
        </template>
        <template #cell-company_name="{ row }">
          <span>{{ row.enterprise.company_name }}</span>
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
      title="Novo cliente"
      submit-label="Criar cliente"
      :loading="formLoading"
      :error="formError"
      @submit="submitCreate"
      @cancel="closeCreateModal"
    >
      <div class="field">
        <label for="client-name">Nome</label>
        <input
          id="client-name"
          v-model="form.name"
          type="text"
          placeholder="Ex: Ricardo Oliveira"
          required
        />
      </div>

      <div class="field">
        <label for="client-phone">Telefone</label>
        <input
          id="client-phone"
          v-model="form.phone_number"
          type="tel"
          placeholder="Ex: (11) 98765-4321"
          required
        />
      </div>

      <div class="field">
        <label for="client-company">Empresa</label>
        <select id="client-company" v-model="form.company_name" required>
          <option disabled value="">Selecione a empresa</option>
          <option
            v-for="name in companyOptions"
            :key="name"
            :value="name"
          >
            {{ name }}
          </option>
        </select>
      </div>
    </FormModal>

    <ConfirmationModal
      :open="showDeleteModal"
      title="Excluir cliente"
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
