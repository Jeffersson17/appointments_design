<script setup>
defineProps({
  message: {
    type: String,
    default: 'Nenhum registro encontrado',
  },
})
</script>

<template>
  <div class="empty-state">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-muted);
  font-size: 0.95rem;
}

.empty-state p {
  margin: 0;
}
</style>
