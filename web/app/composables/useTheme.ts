const STORAGE_KEY = 'dealhub-color-scheme'

export function useTheme() {
  const colorMode = useColorMode({
    storageKey: STORAGE_KEY,
    attribute: 'class',
    modes: {
      light: '',
      dark: 'dark',
    },
  })

  const isDark = computed(() => colorMode.value === 'dark')

  function toggleTheme() {
    colorMode.value = isDark.value ? 'light' : 'dark'
  }

  return { colorMode, isDark, toggleTheme }
}
