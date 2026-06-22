<template>
  <div class="container mx-auto px-4 py-6">
    <div v-if="pending" class="text-center py-20 text-gray-400">กำลังโหลด...</div>
    <div v-else-if="!product" class="text-center py-20">
      <p class="text-gray-500">ไม่พบสินค้า</p>
    </div>
    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Image -->
        <div class="card p-4">
          <img
            :src="product.imageUrl || '/placeholder-product.svg'"
            :alt="product.name"
            class="w-full aspect-square object-cover rounded-sm"
          />
        </div>

        <!-- Info -->
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span v-if="product.rating">⭐ {{ product.rating }} ({{ product.reviewCount }} รีวิว)</span>
            <span>ขายแล้ว {{ product.soldCount?.toLocaleString() }}</span>
            <span v-if="product.brand">แบรนด์: {{ product.brand }}</span>
          </div>

          <!-- Price comparison -->
          <div class="bg-[#FFF6F4] border border-orange-100 rounded-sm p-4 mb-6">
            <h2 class="font-bold text-gray-800 mb-3">💰 เปรียบเทียบราคา</h2>
            <div class="space-y-3">
              <div
                v-for="listing in product.listings"
                :key="listing.id"
                class="flex items-center justify-between bg-white p-3 rounded-sm border"
              >
                <div class="flex items-center gap-3">
                  <span :class="['text-xs px-2 py-1 rounded font-medium', marketplaceColor(listing.marketplace)]">
                    {{ marketplaceLabel(listing.marketplace) }}
                  </span>
                  <div>
                    <div class="text-[#EE4D2D] font-bold text-xl">{{ formatPrice(listing.price) }}</div>
                    <div v-if="listing.originalPrice" class="text-xs text-gray-400 line-through">
                      {{ formatPrice(listing.originalPrice) }}
                    </div>
                  </div>
                </div>
                <button @click="handleBuy(listing)" class="btn-primary text-sm px-4 py-2">
                  ซื้อเลย
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mb-6">
            <button @click="addToCompare" class="btn-outline flex-1" :disabled="compareStore.isFull">
              📊 เทียบสินค้า
            </button>
            <button @click="addToWishlist" class="btn-outline flex-1" :disabled="!authStore.isLoggedIn">
              ❤️ บันทึก
            </button>
            <button @click="showAlertModal = true" class="btn-outline flex-1" :disabled="!authStore.isLoggedIn">
              🔔 แจ้งเตือนราคา
            </button>
          </div>

          <!-- AI Review Summary -->
          <div v-if="aiSummary" class="card p-4 mb-6">
            <h2 class="font-bold text-gray-800 mb-2">🤖 สรุปรีวิวด้วย AI</h2>
            <p class="text-sm text-gray-600 whitespace-pre-line">{{ aiSummary }}</p>
          </div>
        </div>
      </div>

      <!-- Price History -->
      <section v-if="product.priceHistory?.length" class="mt-10">
        <h2 class="text-xl font-bold text-gray-800 mb-4">📈 ประวัติราคา (30 วันล่าสุด)</h2>
        <div class="card p-6">
          <div class="flex items-end gap-1 h-40">
            <div
              v-for="(point, i) in product.priceHistory"
              :key="i"
              class="flex-1 bg-[#EE4D2D]/20 hover:bg-[#EE4D2D]/40 rounded-t transition-colors relative group"
              :style="{ height: `${getBarHeight(point.price)}%` }"
            >
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {{ formatPrice(point.price) }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Price Alert Modal -->
    <div v-if="showAlertModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAlertModal = false">
      <div class="bg-white rounded-sm p-6 w-full max-w-md mx-4">
        <h3 class="font-bold text-lg mb-4">ตั้งแจ้งเตือนราคา</h3>
        <input v-model.number="alertPrice" type="number" placeholder="ราคาที่ต้องการ" class="input-field mb-4" />
        <div class="flex gap-3">
          <button @click="showAlertModal = false" class="flex-1 py-2 border rounded-sm">ยกเลิก</button>
          <button @click="createAlert" class="flex-1 btn-primary">ตั้งแจ้งเตือน</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductListing } from '~/types'

const route = useRoute()
const { apiFetch } = useApi()
const authStore = useAuthStore()
const compareStore = useCompareStore()

const slug = route.params.slug as string
const showAlertModal = ref(false)
const alertPrice = ref<number>()

const { data: product, pending } = await useAsyncData(
  `product-${slug}`,
  () => apiFetch<Product>(`/products/${slug}`).catch(() => null),
)

const { data: aiSummary } = await useAsyncData(
  `ai-${product.value?.id}`,
  () => product.value?.id
    ? apiFetch<string>(`/ai-reviews/${product.value.id}`).catch(() => null)
    : null,
  { watch: [() => product.value?.id] },
)

useSeoMeta({
  title: () => product.value?.name || 'สินค้า',
  description: () => product.value?.description || '',
  ogImage: () => product.value?.imageUrl,
})

const maxPrice = computed(() => {
  if (!product.value?.priceHistory?.length) return 1
  return Math.max(...product.value.priceHistory.map((p) => p.price))
})

function getBarHeight(price: number) {
  return Math.max(10, (price / maxPrice.value) * 100)
}

function addToCompare() {
  if (product.value) compareStore.add(product.value)
}

async function addToWishlist() {
  if (!product.value || !authStore.isLoggedIn) return
  await apiFetch('/wishlist', { method: 'POST', body: { productId: product.value.id } })
}

async function createAlert() {
  if (!product.value || !alertPrice.value) return
  await apiFetch('/price-alerts', {
    method: 'POST',
    body: { productId: product.value.id, targetPrice: alertPrice.value },
  })
  showAlertModal.value = false
}

async function handleBuy(listing: ProductListing) {
  if (!product.value) return
  const result = await apiFetch<{ redirectUrl: string }>('/affiliate/click', {
    method: 'POST',
    body: { productId: product.value.id, marketplace: listing.marketplace },
  })
  if (result.redirectUrl) window.open(result.redirectUrl, '_blank')
}
</script>
