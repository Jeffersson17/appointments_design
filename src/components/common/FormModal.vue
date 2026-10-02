<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Novo registro',
  },
  submitLabel: {
    type: String,
    default: 'Salvar',
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['submit', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal" role="dialog" aria-modal="true">
      <div class="modal__backdrop" @click="$emit('cancel')" />
      <div class="modal__panel">
        <h2 class="modal__title">{{ title }}</h2>

        <form class="modal__form" @submit.prevent="$emit('submit')">
          <div class="modal__fields">
            <slot />
          </div>

          <p v-if="error" class="modal__error">{{ error }}</p>

          <div class="modal__actions">
            <button
              type="button"
              class="btn btn--secondary"
              :disabled="loading"
              @click="$emit('cancel')"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="submit"
              class="btn btn--primary"
              :disabled="loading"
            >
              {{ loading ? 'Salvando...' : submitLabel }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
}

.modal__panel {
  position: relative;
  width: min(100%, 480px);
  max-height: min(90vh, 720px);
  overflow: auto;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  animation: modal-in 0.18s ease;
}

.modal__title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-primary-dark);
}

.modal__form {
  margin-top: 1.15rem;
}

.modal__fields {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.modal__error {
  margin: 0.9rem 0 0;
  color: var(--color-danger);
  font-size: 0.9rem;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.35rem;
}

.modal__fields :deep(.field-row) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 540px) {
  .modal {
    padding: 0.65rem;
    align-items: end;
  }

  .modal__panel {
    width: 100%;
    max-height: min(92vh, 100%);
    padding: 1.15rem 1rem 1.25rem;
    border-radius: 14px 14px 10px 10px;
  }

  .modal__actions {
    flex-direction: column-reverse;
  }

  .modal__actions .btn {
    width: 100%;
  }

  .modal__fields :deep(.field-row) {
    grid-template-columns: 1fr;
  }
}
</style>
