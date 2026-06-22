<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">📊 เปรียบเทียบสินค้า</h1>

    <div v-if="!compareStore.items.length" class="text-center py-20">
      <div class="text-6xl mb-4">📊</div>
      <p class="text-gray-500 mb-4">ยังไม่มีสินค้าในรายการเปรียบเทียบ</p>
      <NuxtLink to="/search" class="btn-primary inline-block">ค้นหาสินค้า</NuxtLink>
    </div>

    <template v-else>
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-500">{{ compareStore.count }}/{{ compareStore.maxItems }} สินค้า</p>
        <button @click="compareStore.clear()" class="text-sm text-red-500 hover:underline">ล้างทั้งหมด</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full card">
          <thead>
            <tr class="border-b">
              <th class="p-4 text-left text-sm text-gray-500 w-32">รายการ</th>
              <th v-for="item in compareStore.items" :key="item.id" class="p-4 text-center min-w-[200px]">
                <button @click="compareStore.remove(item.id)" class="text-red-400 text-xs float-right">✕</button>
                <img :src="item.imageUrl" class="w-24 h-24 object-cover mx-auto rounded-sm mb-2" />
                <NuxtLink :to="`/products/${item.slug}`" class="text-sm font-medium hover:text-[#EE4D2D]">
                  {{ item.name }}
                </NuxtLink>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="p-4 text-sm text-gray-500">ราคาต่ำสุด</td>
              <td v-for="item in compareStore.items" :key="item.id" class="p-4 text-center">
                <span class="text-[#EE4D2D] font-bold">{{ item.lowestPrice ? formatPrice(item.lowestPrice) : '-' }}</span>
              </td>
            </tr>
            <tr class="border-b">
              <td class="p-4 text-sm text-gray-500">คะแนน</td>
              <td v-for="item in compareStore.items" :key="item.id" class="p-4 text-center">
                {{ item.rating ? `⭐ ${item.rating}` : '-' }}
              </td>
            </tr>
            <tr class="border-b">
              <td class="p-4 text-sm text-gray-500">ขายแล้ว</td>
              <td v-for="item in compareStore.items" :key="item.id" class="p-4 text-center">
                {{ item.soldCount?.toLocaleString() || '-' }}
              </td>
            </tr>
            <tr>
              <td class="p-4 text-sm text-gray-500">แพลตฟอร์ม</td>
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

useSeoMeta({ title: 'เปรียบเทียบสินค้า - DealHub TH' })
</script>
