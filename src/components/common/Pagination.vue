<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
})

defineEmits(['change'])

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const max = 5

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, current - Math.floor(max / 2))
  let end = start + max - 1

  if (end > total) {
    end = total
    start = end - max + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <div class="pagination">
    <p class="pagination__info">
      <template v-if="totalItems === 0">Nenhum resultado</template>
      <template v-else>
        {{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }}
        · página {{ currentPage }} de {{ totalPages }}
      </template>
    </p>

    <div class="pagination__controls">
      <button
        type="button"
        class="pagination__btn"
        :disabled="currentPage <= 1"
        @click="$emit('change', currentPage - 1)"
      >
        Anterior
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        type="button"
        class="pagination__btn"
        :class="{ 'pagination__btn--active': page === currentPage }"
        @click="$emit('change', page)"
      >
        {{ page }}
      </button>

      <button
        type="button"
        class="pagination__btn"
        :disabled="currentPage >= totalPages"
        @click="$emit('change', currentPage + 1)"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.pagination__info {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.pagination__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.pagination__btn {
  min-width: 2.25rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.pagination__btn:hover:not(:disabled):not(.pagination__btn--active) {
  background: var(--color-bg);
  border-color: var(--color-primary);
}

.pagination__btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination__controls {
    justify-content: center;
  }
}
</style>
