<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirmar ação',
  },
  message: {
    type: String,
    default: 'Tem certeza que deseja continuar?',
  },
  confirmLabel: {
    type: String,
    default: 'Confirmar',
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar',
  },
  danger: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal" role="dialog" aria-modal="true">
      <div class="modal__backdrop" @click="$emit('cancel')" />
      <div class="modal__panel">
        <h2 class="modal__title">{{ title }}</h2>
        <p class="modal__message">{{ message }}</p>
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
            type="button"
            class="btn"
            :class="danger ? 'btn--danger' : 'btn--primary'"
            :disabled="loading"
            @click="$emit('confirm')"
          >
            {{ loading ? 'Aguarde...' : confirmLabel }}
          </button>
        </div>
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
  width: min(100%, 420px);
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

.modal__message {
  margin-top: 0.65rem;
  color: var(--color-muted);
  line-height: 1.5;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.35rem;
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
    padding: 1.15rem 1rem 1.25rem;
    border-radius: 14px 14px 10px 10px;
  }

  .modal__actions {
    flex-direction: column-reverse;
  }

  .modal__actions .btn {
    width: 100%;
  }
}
</style>
