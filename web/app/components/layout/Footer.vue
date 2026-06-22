<template>
  <footer class="bg-gray-800 text-gray-300 mt-12">
    <div class="container mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-white font-bold text-lg mb-4">DealHub TH</h3>
          <p class="text-sm leading-relaxed">
            แพลตฟอร์มเทียบราคาสินค้าออนไลน์ รวบรวมสินค้าจาก Shopee, Lazada, TikTok Shop
            เปรียบเทียบราคา ดูประวัติราคา และรับแจ้งเตือนเมื่อราคาลด
          </p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3">บริการ</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/search" class="hover:text-white">ค้นหาสินค้า</NuxtLink></li>
            <li><NuxtLink to="/compare" class="hover:text-white">เปรียบเทียบสินค้า</NuxtLink></li>
            <li><NuxtLink to="/wishlist" class="hover:text-white">รายการโปรด</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3">แพลตฟอร์ม</h4>
          <ul class="space-y-2 text-sm">
            <li>Shopee</li>
            <li>Lazada</li>
            <li>TikTok Shop</li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3">ติดต่อ</h4>
          <p class="text-sm">support@dealhub.th</p>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        © {{ new Date().getFullYear() }} DealHub TH. สงวนลิขสิทธิ์
      </div>
    </div>
  </footer>
</template>
