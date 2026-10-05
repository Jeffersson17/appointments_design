<script setup>
import { computed, onMounted, ref } from "vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import ConfirmationModal from "@/components/common/ConfirmationModal.vue";
import DataTable from "@/components/common/DataTable.vue";
import FormModal from "@/components/common/FormModal.vue";
import Pagination from "@/components/common/Pagination.vue";
import SearchInput from "@/components/common/SearchInput.vue";
import { useTableData } from "@/composables/useTableData";
import {
  createService,
  getServices,
  removeService,
  updateService,
} from "@/services/servicesService";
import { formatCurrency, formatDuration } from "@/utils/format";

const services = ref([]);
const loading = ref(true);
const actionLoading = ref(false);
const formLoading = ref(false);
const formError = ref("");
const selectedService = ref(null);
const showDeleteModal = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);

const emptyForm = () => ({
  name: "",
  price: "",
  hours: "",
  minutes: "",
  seconds: "",
  duration: "",
  service_image: null,
});

const form = ref(emptyForm());

const padTimePart = (value) => String(value ?? "").padStart(2, "0");

const updateDuration = () => {
  form.value.duration = `${padTimePart(form.value.hours)}:${padTimePart(form.value.minutes)}:${padTimePart(form.value.seconds)}`;
};

const parseDuration = (duration = "") => {
  const [hours = "", minutes = "", seconds = ""] = String(duration).split(":");
  return { hours, minutes, seconds };
};

const onImageChange = (event) => {
  form.value.service_image = event.target.files?.[0] ?? null;
};

const columns = [
  { key: "service_name", label: "Corte" },
  { key: "price", label: "Valor" },
  { key: "duration", label: "Duração" },
  { key: "enterprise", label: "Empresa" },
  { key: "options", label: "Opções", width: "56px" },
];

const {
  search,
  currentPage,
  totalPages,
  totalItems,
  paginatedItems,
  goToPage,
} = useTableData(services, ["service_name"]);

const loadServices = async () => {
  loading.value = true;
  try {
    services.value = await getServices();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const requestDelete = (service) => {
  selectedService.value = service;
  showDeleteModal.value = true;
};

const closeModal = (force = false) => {
  if (actionLoading.value && !force) return;
  showDeleteModal.value = false;
  selectedService.value = null;
};

const openCreateModal = () => {
  form.value = emptyForm();
  formError.value = "";
  showCreateModal.value = true;
};

const openEditModal = (service) => {
  const { hours, minutes, seconds } = parseDuration(service.duration);
  selectedService.value = service;
  form.value = {
    name: service.service_name ?? "",
    price: service.price ?? "",
    hours,
    minutes,
    seconds,
    duration: service.duration ?? "",
    service_image: null,
  };
  formError.value = "";
  showEditModal.value = true;
};

const closeCreateModal = (force = false) => {
  if (formLoading.value && !force) return;
  showCreateModal.value = false;
  formError.value = "";
};

const closeEditModal = (force = false) => {
  if (formLoading.value && !force) return;
  showEditModal.value = false;
  selectedService.value = null;
  formError.value = "";
};

const validateForm = () => {
  const price = Number(form.value.price);
  updateDuration();

  if (!form.value.name.trim()) {
    formError.value = "Informe o nome do corte.";
    return null;
  }

  if (!Number.isFinite(price) || price <= 0) {
    formError.value = "Informe um valor válido.";
    return null;
  }

  if (form.value.duration === "00:00:00") {
    formError.value = "Informe a duração.";
    return null;
  }

  const payload = {
    service_name: form.value.name.trim(),
    price,
    duration: form.value.duration,
  };

  if (form.value.service_image instanceof File) {
    payload.service_image = form.value.service_image;
  }

  return payload;
};

const submitCreate = async () => {
  const payload = validateForm();
  if (!payload) return;

  formLoading.value = true;
  formError.value = "";

  try {
    const createdService = await createService(payload);
    services.value = [createdService, ...services.value];
    closeCreateModal(true);
  } catch (err) {
    console.error(err);
    formError.value = "Ocorreu um erro ao criar o serviço.";
  } finally {
    formLoading.value = false;
  }
};

const submitEdit = async () => {
  if (!selectedService.value) return;

  const payload = validateForm();
  if (!payload) return;

  formLoading.value = true;
  formError.value = "";

  try {
    const updatedService = await updateService(
      selectedService.value.id,
      payload,
    );
    services.value = services.value.map((item) =>
      item.id === updatedService.id ? updatedService : item,
    );
    closeEditModal(true);
  } catch (err) {
    console.error(err);
    formError.value = "Ocorreu um erro ao atualizar este serviço.";
  } finally {
    formLoading.value = false;
  }
};

const deleteMessage = computed(() => {
  const name = selectedService.value?.service_name ?? "este serviço";
  return `Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`;
});

const confirmDelete = async () => {
  if (!selectedService.value) return;
  actionLoading.value = true;
  try {
    await removeService(selectedService.value.id);
    services.value = services.value.filter(
      (item) => item.id !== selectedService.value.id,
    );
    closeModal(true);
  } finally {
    actionLoading.value = false;
  }
};

onMounted(loadServices);
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h2 class="page__title">Serviços / Cortes</h2>
        <p class="page__subtitle">
          Gerencie os serviços oferecidos pelas barbearias.
        </p>
      </div>
      <button
        type="button"
        class="btn btn--primary page__action"
        @click="openCreateModal"
      >
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

        <template #cell-duration="{ row }">
          {{ formatDuration(row.duration) }}
        </template>

        <template #cell-enterprise="{ row }">
          {{ row.enterprise?.company_name || "—" }}
        </template>

        <template #cell-options="{ row }">
          <ActionButtons
            @edit="openEditModal(row)"
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
      <div class="field-row">
        <div class="field">
          <label for="create-service-name">Corte</label>
          <input
            id="create-service-name"
            v-model="form.name"
            type="text"
            placeholder="Ex: Corte Masculino"
            required
          />
        </div>

        <div class="field">
          <label for="create-service-price">Valor (R$)</label>
          <input
            id="create-service-price"
            v-model="form.price"
            type="number"
            min="1"
            step="0.01"
            placeholder="45"
            required
          />
        </div>
      </div>

      <div class="field">
        <span class="field__label">Duração</span>
        <div class="duration-fields">
          <div class="field">
            <label for="create-service-hours">Horas</label>
            <input
              id="create-service-hours"
              v-model="form.hours"
              type="number"
              min="0"
              max="23"
              placeholder="00"
              @input="updateDuration"
            />
          </div>

          <div class="field">
            <label for="create-service-minutes">Minutos</label>
            <input
              id="create-service-minutes"
              v-model="form.minutes"
              type="number"
              min="0"
              max="59"
              placeholder="00"
              @input="updateDuration"
            />
          </div>

          <div class="field">
            <label for="create-service-seconds">Segundos</label>
            <input
              id="create-service-seconds"
              v-model="form.seconds"
              type="number"
              min="0"
              max="59"
              placeholder="00"
              @input="updateDuration"
            />
          </div>
        </div>
      </div>

      <div class="field">
        <label for="create-service-image">Imagem do serviço</label>
        <input
          id="create-service-image"
          type="file"
          accept="image/*"
          @change="onImageChange"
        />
      </div>
    </FormModal>

    <FormModal
      :open="showEditModal"
      title="Editar serviço"
      submit-label="Salvar alterações"
      :loading="formLoading"
      :error="formError"
      @submit="submitEdit"
      @cancel="closeEditModal"
    >
      <div class="field-row">
        <div class="field">
          <label for="edit-service-name">Corte</label>
          <input
            id="edit-service-name"
            v-model="form.name"
            type="text"
            placeholder="Ex: Corte Masculino"
            required
          />
        </div>

        <div class="field">
          <label for="edit-service-price">Valor (R$)</label>
          <input
            id="edit-service-price"
            v-model="form.price"
            type="number"
            min="1"
            step="0.01"
            placeholder="45"
            required
          />
        </div>
      </div>

      <div class="field">
        <span class="field__label">Duração</span>
        <div class="duration-fields">
          <div class="field">
            <label for="edit-service-hours">Horas</label>
            <input
              id="edit-service-hours"
              v-model="form.hours"
              type="number"
              min="0"
              max="23"
              placeholder="00"
              @input="updateDuration"
            />
          </div>

          <div class="field">
            <label for="edit-service-minutes">Minutos</label>
            <input
              id="edit-service-minutes"
              v-model="form.minutes"
              type="number"
              min="0"
              max="59"
              placeholder="00"
              @input="updateDuration"
            />
          </div>

          <div class="field">
            <label for="edit-service-seconds">Segundos</label>
            <input
              id="edit-service-seconds"
              v-model="form.seconds"
              type="number"
              min="0"
              max="59"
              placeholder="00"
              @input="updateDuration"
            />
          </div>
        </div>
      </div>

      <div class="field">
        <label for="edit-service-image">Imagem do serviço</label>
        <input
          id="edit-service-image"
          type="file"
          accept="image/*"
          @change="onImageChange"
        />
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

.field__label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.duration-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

@media (max-width: 640px) {
  .page__action {
    width: 100%;
  }
}
</style>
