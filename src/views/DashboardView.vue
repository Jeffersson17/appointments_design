<script setup>
</script>

<template>
  <section class="page">
    <header class="page__header">
      <div>
        <h2 class="page__title">Dashboard</h2>
        <p class="page__subtitle">
          Visão geral do sistema. Indicadores serão adicionados quando a API estiver disponível.
        </p>
      </div>
    </header>

    <div class="panel dashboard-placeholder">
      <p>Opção em desenvolvimento</p>
    </div>
  </section>
</template>

<style scoped>
.dashboard-placeholder {
  min-height: 280px;
  display: grid;
  place-items: center;
  text-align: center;
}

.dashboard-placeholder p {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-muted);
}
</style>
