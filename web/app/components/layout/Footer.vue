<template>
  <footer class="bg-gray-800 dark:bg-[#111111] text-gray-300 mt-6 border-t border-transparent dark:border-line">
    <div class="page-container py-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-white font-bold text-xl mb-3">
            Deal<span class="text-[#FFD600]">Hub</span> TH
          </h3>
          <p class="text-base leading-relaxed">
            แพลตฟอร์มเทียบราคาสินค้าออนไลน์ รวบรวมสินค้าจาก Shopee, Lazada, TikTok Shop
          </p>
        </div>
        <div>
          <h4 class="text-white font-semibold text-base mb-3">เกี่ยวกับเรา</h4>
          <ul class="space-y-2 text-base">
            <li><a href="#" class="hover:text-white">เกี่ยวกับ DealHub</a></li>
            <li><a href="#" class="hover:text-white">ติดต่อเรา</a></li>
            <li><a href="#" class="hover:text-white">นโยบายความเป็นส่วนตัว</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold text-base mb-3">บริการ</h4>
          <ul class="space-y-2 text-base">
            <li><NuxtLink to="/search" class="hover:text-white">ค้นหาสินค้า</NuxtLink></li>
            <li><NuxtLink to="/compare" class="hover:text-white">เปรียบเทียบสินค้า</NuxtLink></li>
            <li><NuxtLink to="/wishlist" class="hover:text-white">รายการโปรด</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold text-base mb-3">Affiliate Disclosure</h4>
          <p class="text-base leading-relaxed">
            DealHub อาจได้รับค่าคอมมิชชั่นจากลิงก์ซื้อสินค้าบน Shopee, Lazada และ TikTok Shop
            โดยไม่มีค่าใช้จ่ายเพิ่มเติมสำหรับผู้ซื้อ
          </p>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-base text-gray-400">
        © {{ new Date().getFullYear() }} DealHub TH. สงวนลิขสิทธิ์
      </div>
    </div>
  </footer>
</template>
