<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <MemberAvatar
        :avatar="modelValue"
        :name="displayName"
        :user-id="userId"
        size="xl"
      />
      <div class="text-sm text-content-muted">
        <p class="font-medium text-content">รูปโปรไฟล์</p>
        <p>เลือกอวาตาร์สำเร็จรูป หรืออัปโหลดรูปของคุณ</p>
      </div>
    </div>

    <div>
      <p class="text-sm font-medium text-content mb-2">อวาตาร์สำเร็จรูป</p>
      <div class="grid grid-cols-4 sm:grid-cols-6 gap-2">
        <button
          v-for="preset in PRESET_AVATARS"
          :key="preset.id"
          type="button"
          class="aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all hover:scale-105"
          :class="modelValue === preset.id
            ? 'border-shopee ring-2 ring-shopee/30 scale-105'
            : 'border-line hover:border-shopee/40'"
          :style="{ background: `${preset.bg}22` }"
          :title="preset.label"
          @click="selectPreset(preset.id)"
        >
          <span class="text-2xl">{{ preset.emoji }}</span>
          <span class="text-[10px] text-content-muted mt-0.5 truncate w-full text-center px-1">{{ preset.label }}</span>
        </button>
      </div>
    </div>

    <div>
      <p class="text-sm font-medium text-content mb-2">อัปโหลดรูปของคุณ</p>
      <label
        class="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-line rounded-xl cursor-pointer hover:border-shopee/50 hover:bg-shopee/5 transition-colors"
        :class="uploading ? 'opacity-60 pointer-events-none' : ''"
      >
        <Upload class="w-8 h-8 text-content-muted" />
        <span class="text-sm text-content-muted">คลิกเพื่อเลือกรูป JPG/PNG/WebP (สูงสุด 2MB)</span>
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onFileChange"
        >
      </label>
      <p v-if="uploadError" class="text-sm text-red-600 mt-2">{{ uploadError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload } from 'lucide-vue-next'
import { PRESET_AVATARS } from '~/constants/avatars'

const props = defineProps<{
  modelValue: string | null | undefined
  displayName: string
  userId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  uploaded: [profile: unknown]
}>()

const { uploadAvatar } = useMember()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

function selectPreset(id: string) {
  emit('update:modelValue', id)
}

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'ไฟล์ใหญ่เกิน 2MB'
    return
  }

  uploading.value = true
  uploadError.value = ''
  try {
    const profile = await uploadAvatar(file)
    emit('update:modelValue', (profile as { avatar: string }).avatar)
    emit('uploaded', profile)
  }
  catch {
    uploadError.value = 'อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง'
  }
  finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>
