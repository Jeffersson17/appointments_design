import { computed, ref, watch } from 'vue'

const PAGE_SIZE = 10

/**
 * Busca + paginação reutilizável para tabelas do painel.
 * @param {import('vue').Ref<Array<Record<string, unknown>>>} source
 * @param {string[]} searchKeys
 * @param {import('vue').Ref<Array<Record<string, unknown>>> | null} [extraFilter]
 */
export const useTableData = (source, searchKeys = [], extraFilter = null) => {
  const search = ref('')
  const currentPage = ref(1)

  const filteredItems = computed(() => {
    const items = extraFilter ? extraFilter.value : source.value
    const term = search.value.trim().toLowerCase()
    if (!term) return items

    return items.filter((item) =>
      searchKeys.some((key) =>
        String(item[key] ?? '')
          .toLowerCase()
          .includes(term),
      ),
    )
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredItems.value.length / PAGE_SIZE)),
  )

  const totalItems = computed(() => filteredItems.value.length)

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    return filteredItems.value.slice(start, start + PAGE_SIZE)
  })

  watch(search, () => {
    currentPage.value = 1
  })

  if (extraFilter) {
    watch(extraFilter, () => {
      currentPage.value = 1
    })
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const resetPage = () => {
    currentPage.value = 1
  }

  return {
    search,
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    pageSize: PAGE_SIZE,
    goToPage,
    resetPage,
  }
}
