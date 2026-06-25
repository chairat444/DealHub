<template>
  <span
    class="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
    :style="{ background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}44` }"
  >
    <Trophy class="w-3 h-3" />
    {{ meta.th }}
  </span>
</template>

<script setup lang="ts">
import { Trophy } from 'lucide-vue-next'
import { MEMBER_TIER_META } from '~/constants/member'
import type { MemberTier } from '~/types/member'

const props = defineProps<{ tier: MemberTier }>()
const meta = computed(() => MEMBER_TIER_META[props.tier])
</script>
