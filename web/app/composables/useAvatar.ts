import { getPresetAvatar } from '~/constants/avatars'

const AVATAR_COLORS = ['#EE4D2D', '#26aa99', '#7B1FA2', '#F57C00', '#5C6BC0']

export function useAvatar() {
  const config = useRuntimeConfig()

  function resolveAvatarUrl(avatar: string | null | undefined) {
    if (!avatar || avatar.startsWith('preset:')) return null
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar
    const origin = (config.public.apiBase as string).replace(/\/api\/v1\/?$/, '')
    return `${origin}${avatar.startsWith('/') ? avatar : `/${avatar}`}`
  }

  function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  function getFallbackColor(seed: string) {
    let hash = 0
    for (const ch of seed) hash = (hash + ch.charCodeAt(0)) % AVATAR_COLORS.length
    return AVATAR_COLORS[hash]!
  }

  function getPreset(avatar: string | null | undefined) {
    return getPresetAvatar(avatar)
  }

  return { resolveAvatarUrl, getInitials, getFallbackColor, getPreset }
}
