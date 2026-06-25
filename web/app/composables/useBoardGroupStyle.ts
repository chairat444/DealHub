import type { BoardGroup } from '~/data/board-preview'

/** สไตล์การ์ดกลุ่มบอร์ด — light ใช้ pastel, dark ใช้ surface เท่านั้น */
export function useBoardGroupStyle() {
  const { isDark } = useTheme()

  function cardStyle(group: BoardGroup, isActive: boolean) {
    if (isDark.value) {
      return isActive ? { color: 'rgb(var(--accent-display))' } : {}
    }
    return {
      background: group.bg,
      color: isActive ? group.color : undefined,
    }
  }

  function cardClass(isActive: boolean) {
    return [
      'board-group-card',
      isActive ? 'is-active' : '',
    ]
  }

  return { cardStyle, cardClass, isDark }
}
