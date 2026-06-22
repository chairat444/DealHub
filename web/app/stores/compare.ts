import { defineStore } from 'pinia'
import type { Product } from '~/types'

export const useCompareStore = defineStore('compare', () => {
  const items = ref<Product[]>([])
  const maxItems = 4

  const count = computed(() => items.value.length)
  const isFull = computed(() => items.value.length >= maxItems)

  function add(product: Product) {
    if (items.value.find((p) => p.id === product.id)) return
    if (items.value.length >= maxItems) return
    items.value.push(product)
    saveToStorage()
  }

  function remove(productId: string) {
    items.value = items.value.filter((p) => p.id !== productId)
    saveToStorage()
  }

  function clear() {
    items.value = []
    saveToStorage()
  }

  function saveToStorage() {
    if (import.meta.client) {
      localStorage.setItem('compare', JSON.stringify(items.value))
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      const stored = localStorage.getItem('compare')
      if (stored) items.value = JSON.parse(stored)
    }
  }

  return { items, count, isFull, maxItems, add, remove, clear, loadFromStorage }
})
