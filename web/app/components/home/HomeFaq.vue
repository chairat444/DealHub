<template>
  <section
    class="section-card px-4 py-4 mb-2.5"
    aria-labelledby="home-faq-heading"
  >
    <h2 id="home-faq-heading" class="text-xl font-bold text-content flex items-center gap-2">
      <HelpCircle class="w-6 h-6 text-accent shrink-0" aria-hidden="true" />
      คำถามที่พบบ่อย
    </h2>
    <p class="text-sm text-content-muted mt-1">
      เรื่องที่ผู้ใช้ถามบ่อยเกี่ยวกับการเทียบราคาและชุมชนบน DealHub TH
    </p>

    <div class="mt-3 divide-y divide-line border-t border-line">
      <details
        v-for="(item, index) in HOME_FAQ"
        :key="item.question"
        class="faq-item group"
        :open="index === 0"
      >
        <summary class="faq-summary">
          <span class="text-sm font-semibold text-content pr-3">{{ item.question }}</span>
          <ChevronDown
            class="w-4 h-4 text-content-muted shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:text-accent"
            aria-hidden="true"
          />
        </summary>
        <p class="text-sm text-content-muted leading-relaxed pb-3 pt-1">
          {{ item.answer }}
        </p>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronDown, HelpCircle } from 'lucide-vue-next'
import { HOME_FAQ } from '~/constants/faq'
</script>

<style scoped>
.faq-item {
  @apply py-3;
}

.faq-summary {
  @apply flex items-center justify-between cursor-pointer list-none select-none;
}

.faq-summary::-webkit-details-marker {
  display: none;
}
</style>
