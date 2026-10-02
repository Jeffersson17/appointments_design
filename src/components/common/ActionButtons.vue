<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  showEdit: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  showToggle: {
    type: Boolean,
    default: false,
  },
  toggleLabel: {
    type: String,
    default: 'Alternar',
  },
  editLabel: {
    type: String,
    default: 'Editar',
  },
  deleteLabel: {
    type: String,
    default: 'Deletar',
  },
})

const emit = defineEmits(['edit', 'delete', 'toggle'])

const open = ref(false)
const root = ref(null)
const dropdown = ref(null)
const menuStyle = ref({})

const updateMenuPosition = async () => {
  await nextTick()
  const trigger = root.value?.querySelector('.action-menu__trigger')
  if (!trigger) return

  const rect = trigger.getBoundingClientRect()
  const menuWidth = 160
  const gutter = 8
  const left = Math.min(
    window.innerWidth - menuWidth - gutter,
    Math.max(gutter, rect.right - menuWidth),
  )

  menuStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 6}px`,
    left: `${left}px`,
    width: `${menuWidth}px`,
  }
}

const toggleMenu = async () => {
  open.value = !open.value
  if (open.value) {
    await updateMenuPosition()
  }
}

const closeMenu = () => {
  open.value = false
}

const onAction = (eventName) => {
  closeMenu()
  emit(eventName)
}

const onClickOutside = (event) => {
  const inTrigger = root.value?.contains(event.target)
  const inDropdown = dropdown.value?.contains(event.target)
  if (!inTrigger && !inDropdown) {
    closeMenu()
  }
}

const onEscape = (event) => {
  if (event.key === 'Escape') closeMenu()
}

const onViewportChange = () => {
  if (open.value) updateMenuPosition()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onEscape)
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEscape)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div ref="root" class="action-menu">
    <button
      type="button"
      class="action-menu__trigger"
      aria-label="Abrir opções"
      :aria-expanded="open"
      @click.stop="toggleMenu"
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        ref="dropdown"
        class="action-menu__dropdown"
        role="menu"
        :style="menuStyle"
        @click.stop
      >
        <button
          v-if="showEdit"
          type="button"
          class="action-menu__item"
          role="menuitem"
          @click="onAction('edit')"
        >
          {{ editLabel }}
        </button>

        <button
          v-if="showToggle"
          type="button"
          class="action-menu__item"
          role="menuitem"
          @click="onAction('toggle')"
        >
          {{ toggleLabel }}
        </button>

        <button
          v-if="showDelete"
          type="button"
          class="action-menu__item action-menu__item--danger"
          role="menuitem"
          @click="onAction('delete')"
        >
          {{ deleteLabel }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.action-menu {
  position: relative;
  display: inline-flex;
  justify-content: flex-end;
}

.action-menu__trigger {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--color-muted);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.action-menu__trigger span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.action-menu__trigger:hover,
.action-menu__trigger:focus-visible,
.action-menu__trigger[aria-expanded='true'] {
  background: var(--color-bg);
  border-color: var(--color-border);
  color: var(--color-text);
  outline: none;
}
</style>

<style>
.action-menu__dropdown {
  z-index: 1200;
  padding: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  animation: action-menu-in 0.14s ease;
}

.action-menu__item {
  display: block;
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.action-menu__item:hover {
  background: #f1f5f9;
}

.action-menu__item--danger {
  color: var(--color-danger);
}

.action-menu__item--danger:hover {
  background: var(--color-danger-soft);
}

@keyframes action-menu-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
