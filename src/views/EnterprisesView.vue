<script setup>
import { onMounted, ref } from 'vue'
import ActionButtons from '@/components/common/ActionButtons.vue'
import ConfirmationModal from '@/components/common/ConfirmationModal.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormModal from '@/components/common/FormModal.vue'
import Pagination from '@/components/common/Pagination.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import UserAvatar from '@/components/layout/UserAvatar.vue'
import { useTableData } from '@/composables/useTableData'
import {
  createCompany,
  getCompanies,
  removeCompany,
  toggleCompanyStatus,
} from '@/services/companiesService'

const companies = ref([])
const loading = ref(true)
const actionLoading = ref(false)
const formLoading = ref(false)
const formError = ref('')
const showCreateModal = ref(false)

const form = ref({
  name: '',
  ownerName: '',
})

const modal = ref({
  open: false,
  type: null,
  company: null,
})

const columns = [
  { key: 'company', label: 'Empresa' },
  { key: 'ownerName', label: 'Proprietário' },
  { key: 'email', label: 'E-mail' },
  { key: 'status', label: 'Status', width: '150px' },
  { key: 'options', label: 'Opções', width: '56px' },
]

const {
  search,
  currentPage,
  totalPages,
  totalItems,
  paginatedItems,
  goToPage,
} = useTableData(companies, ['name', 'ownerName', 'status'])

const loadCompanies = async () => {
  loading.value = true
  try {
    companies.value = await getCompanies()
  } catch (err) {
    console.error('Erro ao carregar empresas:', err)
  } finally {
    loading.value = false
  }
}

const openModal = (type, company) => {
  modal.value = { open: true, type, company }
}

const closeModal = (force = false) => {
  if (actionLoading.value && !force) return
  modal.value = { open: false, type: null, company: null }
}

const openCreateModal = () => {
  form.value = {
    name: '',
    ownerName: '',

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
  if (!form.value.name.trim() || !form.value.ownerName.trim()) {
    formError.value = 'Preencha o nome da empresa e do proprietário.'
    return
  }

  formLoading.value = true
  formError.value = ''

  try {
    const created = await createCompany(form.value)
    companies.value = [created, ...companies.value]
    closeCreateModal(true)
  } catch (err) {
    formError.value = 'Não foi possível criar a empresa.'
    console.error(err)
  } finally {
    formLoading.value = false
  }
}

const handleEdit = (company) => {
  window.alert(`Edição de "${company.name}" será integrada à API.`)
}

const confirmAction = async () => {
  const { type, company } = modal.value
  if (!company) return

  actionLoading.value = true
  try {
    if (type === 'delete') {
      await removeCompany(company.id)
      companies.value = companies.value.filter((item) => item.id !== company.id)
    }

    if (type === 'toggle') {
      const updated = await toggleCompanyStatus(company.id)
      companies.value = companies.value.map((item) =>
        item.id === updated.id ? updated : item,
      )
    }

    closeModal(true)
  } finally {
    actionLoading.value = false
  }
}

const modalTitle = () => {
  if (modal.value.type === 'delete') return 'Excluir empresa'
  if (modal.value.type === 'toggle') {
    return modal.value.company?.status 
      ? 'Desativar empresa'
      : 'Ativar empresa'
  }
  return 'Confirmar ação'
}

const modalMessage = () => {
  const name = modal.value.company?.name ?? 'esta empresa'
  if (modal.value.type === 'delete') {
    return `Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`
  }
  if (modal.value.type === 'toggle') {
    return `Tem certeza que deseja ${
      modal.value.company?.status ? 'desativar' : 'ativar'
    } "${name}"?`
  }
  return 'Tem certeza que deseja continuar?'
}

const toggleLabel = (status) =>
  status === companies.value ? 'Desativar' : 'Ativar'

onMounted(loadCompanies)
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h2 class="page__title">Empresas</h2>
        <p class="page__subtitle">Gerencie as barbearias cadastradas no sistema.</p>
      </div>
      <button type="button" class="btn btn--primary page__action" @click="openCreateModal">
        Nova empresa
      </button>
    </header>

    <div class="panel">
      <div class="panel__toolbar">
        <SearchInput
          v-model="search"
          placeholder="Buscar por empresa ou proprietário..."
        />
      </div>

      <DataTable :columns="columns" :rows="paginatedItems" :loading="loading">
        <template #cell-company="{ row }">
          <div class="company-cell">
            <UserAvatar
              :name="row.company_name"
              :src="row.logoUrl"
              size="company"
            />
            <span>{{ row.company_name }}</span>
          </div>
        </template>

        <template #cell-ownerName="{ row }">
          <span>{{ row.owner_name }}</span>
        </template>

        <template #cell-email="{ row }">
          <span>{{ row.user.email }}</span>
        </template>

        <template #cell-status="{ row }">
          <StatusBadge :status=row.user.is_active />
        </template>

        <template #cell-options="{ row }">
          <ActionButtons
            show-toggle
            :toggle-label="toggleLabel(row.status)"
            @edit="handleEdit(row)"
            @toggle="openModal('toggle', row)"
            @delete="openModal('delete', row)"
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
      title="Nova empresa"
      submit-label="Criar empresa"
      :loading="formLoading"
      :error="formError"
      @submit="submitCreate"
      @cancel="closeCreateModal"
    >
      <div class="field">
        <label for="company-name">Nome da empresa</label>
        <input
          id="company-name"
          v-model="form.name"
          type="text"
          placeholder="Ex: Barbearia Central"
          required
        />
      </div>

      <div class="field">
        <label for="company-owner">Proprietário</label>
        <input
          id="company-owner"
          v-model="form.ownerName"
          type="text"
          placeholder="Ex: Carlos Mendes"
          required
        />
      </div>

      <div class="field">
        <label for="company-status">Status</label>
        <select id="company-status" v-model="form.status">
        
        </select>
      </div>
    </FormModal>

    <ConfirmationModal
      :open="modal.open"
      :title="modalTitle()"
      :message="modalMessage()"
      :confirm-label="modal.type === 'delete' ? 'Excluir' : 'Confirmar'"
      :danger="modal.type === 'delete'"
      :loading="actionLoading"
      @confirm="confirmAction"
      @cancel="closeModal"
    />
  </section>
</template>

<style scoped>
.page__action {
  flex-shrink: 0;
}

.company-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.company-cell span {
  font-weight: 600;
  min-width: 0;
  overflow-wrap: anywhere;
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
