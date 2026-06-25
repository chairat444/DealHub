<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-content mb-6">📊 เปรียบเทียบสินค้า</h1>

    <div v-if="!compareStore.items.length" class="text-center py-20">
      <div class="text-6xl mb-4">📊</div>
      <p class="text-content-muted mb-4">ยังไม่มีสินค้าในรายการเปรียบเทียบ</p>
      <NuxtLink to="/search" class="btn-primary inline-block">ค้นหาสินค้า</NuxtLink>
    </div>

    <template v-else>
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-content-muted">{{ compareStore.count }}/{{ compareStore.maxItems }} สินค้า</p>
        <button @click="compareStore.clear()" class="text-sm text-red-500 hover:underline">ล้างทั้งหมด</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full card">
          <thead>
            <tr class="border-b border-line">
              <th class="p-4 text-left text-sm text-content-muted w-32">รายการ</th>
              <th v-for="item in compareStore.items" :key="item.id" class="p-4 text-center min-w-[200px]">
                <button @click="compareStore.remove(item.id)" class="text-red-400 text-xs float-right">✕</button>
                <div class="w-24 h-24 mx-auto mb-2 rounded-sm overflow-hidden">
                  <ProductImage
                    :src="item.imageUrl"
                    :alt="item.name"
                    container-class="w-24 h-24"
                    img-class="w-full h-full object-cover"
                  />
                </div>
                <NuxtLink :to="`/products/${item.slug}`" class="text-sm font-medium hover:text-[#EE4D2D]">
                  {{ item.name }}
                </NuxtLink>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-line">
              <td class="p-4 text-sm text-content-muted">ราคาต่ำสุด</td>
              <td v-for="item in compareStore.items" :key="item.id" class="p-4 text-center">
                <span class="text-[#EE4D2D] font-bold">{{ item.lowestPrice ? formatPrice(item.lowestPrice) : '-' }}</span>
              </td>
            </tr>
            <tr class="border-b border-line">
              <td class="p-4 text-sm text-content-muted">คะแนน</td>
              <td v-for="item in compareStore.items" :key="item.id" class="p-4 text-center">
                {{ item.rating ? `⭐ ${item.rating}` : '-' }}
              </td>
            </tr>
            <tr class="border-b border-line">
              <td class="p-4 text-sm text-content-muted">ขายแล้ว</td>
              <td v-for="item in compareStore.items" :key="item.id" class="p-4 text-center">
                {{ item.soldCount?.toLocaleString() || '-' }}
              </td>
            </tr>
            <tr>
              <td class="p-4 text-sm text-content-muted">แพลตฟอร์ม</td>
              <td v-for="item in compareStore.items" :key="item.id" class="p-4 text-center">
                <div class="flex flex-wrap gap-1 justify-center">
                  <span
                    v-for="l in item.listings"
                    :key="l.id"
                    :class="['text-xs px-1.5 py-0.5 rounded', marketplaceColor(l.marketplace)]"
                  >
                    {{ marketplaceLabel(l.marketplace) }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const compareStore = useCompareStore()

useSiteSeo({ title: 'เปรียบเทียบสินค้า', noindex: true })
</script>
