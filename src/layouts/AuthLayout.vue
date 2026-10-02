<script setup>
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__panel">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background:
    radial-gradient(circle at 15% 20%, rgba(37, 99, 235, 0.22), transparent 32%),
    radial-gradient(circle at 85% 80%, rgba(29, 78, 216, 0.18), transparent 28%),
    linear-gradient(145deg, #0f274f 0%, #1d4ed8 55%, #93c5fd 140%);
}

.auth-layout__panel {
  width: min(100%, 420px);
  animation: fade-up 0.35s ease;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
