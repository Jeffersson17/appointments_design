<script setup>
import { computed } from 'vue'
import { getInitials } from '@/utils/format'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  src: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: 'md',
  },
})

const initials = computed(() => getInitials(props.name))
</script>

<template>
  <div class="user-avatar" :class="`user-avatar--${size}`" :title="name">
    <img v-if="src" :src="src" :alt="name" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  background: linear-gradient(145deg, #2563eb, #1e3a8a);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar--sm {
  width: 2rem;
  height: 2rem;
  font-size: 0.7rem;
}

.user-avatar--md {
  width: 2.4rem;
  height: 2.4rem;
  font-size: 0.78rem;
}

.user-avatar--lg {
  width: 3rem;
  height: 3rem;
  font-size: 0.9rem;
}

.user-avatar--company {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
}
</style>
