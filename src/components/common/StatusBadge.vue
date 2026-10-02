<script setup>
import { computed } from 'vue'
import { COMPANY_STATUS, COMPANY_STATUS_LABELS } from '@/types/status'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const label = computed(
  () => COMPANY_STATUS_LABELS[props.status] ?? props.status,
)

const variant = computed(() =>
  props.status === COMPANY_STATUS.ACTIVE ? 'success' : 'neutral',
)
</script>

<template>
  <span class="status-badge" :class="`status-badge--${variant}`">
    {{ label }}
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
