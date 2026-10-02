<script setup>
import EmptyState from './EmptyState.vue'

defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: 'Nenhum registro encontrado',
  },
})
</script>

<template>
  <div class="data-table">
    <div v-if="loading" class="data-table__loading">Carregando...</div>

    <template v-else>
      <div v-if="!rows.length" class="data-table__empty">
        <slot name="empty">
          <EmptyState :message="emptyMessage" />
        </slot>
      </div>

      <div v-else class="data-table__wrap">
        <table>
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="{ 'is-options': column.key === 'options' }"
                :style="column.width ? { width: column.width } : undefined"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row[rowKey]">
              <td
                v-for="column in columns"
                :key="column.key"
                :class="{ 'is-options': column.key === 'options' }"
                :data-label="column.label"
              >
                <div class="data-table__cell">
                  <slot :name="`cell-${column.key}`" :row="row">
                    {{ row[column.key] }}
                  </slot>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.data-table {
  width: 100%;
}

.data-table__loading,
.data-table__empty {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.data-table__wrap {
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  padding: 0.85rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

th {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-muted);
  background: #f8fafc;
}

th.is-options,
td.is-options {
  width: 56px;
  text-align: right;
}

td {
  font-size: 0.92rem;
  color: var(--color-text);
}

.data-table__cell {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

td.is-options .data-table__cell {
  display: flex;
  justify-content: flex-end;
  overflow: visible;
}

tbody tr:hover {
  background: #f8fbff;
}

tbody tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .data-table__wrap {
    overflow: visible;
  }

  table {
    display: block;
    width: 100%;
    table-layout: auto;
  }

  thead {
    display: none;
  }

  tbody {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  tr {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    width: 100%;
    margin: 0;
    padding: 1rem 3rem 1rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  tbody tr:hover {
    background: var(--color-surface);
  }

  td {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
    width: 100%;
    padding: 0;
    border: none;
  }

  td::before {
    content: attr(data-label);
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-muted);
    line-height: 1.2;
  }

  td.is-options {
    position: absolute;
    top: 0.55rem;
    right: 0.45rem;
    width: auto;
    padding: 0;
    gap: 0;
  }

  td.is-options::before {
    display: none;
  }

  td.is-options .data-table__cell {
    width: auto;
  }

  .data-table__cell {
    width: 100%;
    line-height: 1.35;
  }

  .data-table__cell :deep(.company-cell) {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
  }

  .data-table__cell :deep(.company-cell span) {
    flex: 1;
    min-width: 0;
  }

  .data-table__cell :deep(.status-badge) {
    align-self: flex-start;
  }
}
</style>
