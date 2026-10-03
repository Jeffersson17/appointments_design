<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const variant = computed(() =>
  props.status === true ? 'success' : 'neutral',
)
</script>

<template>
  <span class="status-badge" :class="`status-badge--${variant}`">
    {{ props.status === true ? 'Ativa' : 'Inativa' }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.2;
}

.status-badge--success {
  background: var(--color-success-soft);
  color: var(--color-success);
}

.status-badge--neutral {
  background: #e2e8f0;
  color: #475569;
}
</style>
