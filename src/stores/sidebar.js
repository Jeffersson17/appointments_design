import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = ref(false)
  const isCollapsed = ref(false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const close = () => {
    isOpen.value = false
  }

  const open = () => {
    isOpen.value = true
  }

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  return {
    isOpen,
    isCollapsed,
    toggle,
    close,
    open,
    toggleCollapse,
  }
})
