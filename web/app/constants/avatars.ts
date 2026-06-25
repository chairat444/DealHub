export interface PresetAvatar {
  id: string
  emoji: string
  bg: string
  label: string
}

export const PRESET_AVATARS: PresetAvatar[] = [
  { id: 'preset:deal-hunter', emoji: '🛒', bg: '#EE4D2D', label: 'นักล่าดีล' },
  { id: 'preset:scout', emoji: '🔍', bg: '#26aa99', label: 'สายล่า' },
  { id: 'preset:master', emoji: '👑', bg: '#F57C00', label: 'ปรมาจารย์' },
  { id: 'preset:legend', emoji: '🔥', bg: '#D4006A', label: 'ตำนาน' },
  { id: 'preset:beauty', emoji: '💄', bg: '#E91E63', label: 'ความงาม' },
  { id: 'preset:tech', emoji: '📱', bg: '#1565C0', label: 'ไอที' },
  { id: 'preset:food', emoji: '🍜', bg: '#FF7043', label: 'ของกิน' },
  { id: 'preset:pets', emoji: '🐱', bg: '#7B1FA2', label: 'สัตว์เลี้ยง' },
  { id: 'preset:gamer', emoji: '🎮', bg: '#5C6BC0', label: 'เกมเมอร์' },
  { id: 'preset:home', emoji: '🏡', bg: '#00838F', label: 'บ้าน' },
  { id: 'preset:fit', emoji: '💪', bg: '#558B2F', label: 'ฟิตเนส' },
  { id: 'preset:star', emoji: '⭐', bg: '#FFD600', label: 'ดาวเด่น' },
]

export function getPresetAvatar(id: string | null | undefined) {
  if (!id?.startsWith('preset:')) return null
  return PRESET_AVATARS.find((a) => a.id === id) ?? null
}

export function isPresetAvatar(id: string | null | undefined) {
  return !!id?.startsWith('preset:')
}
