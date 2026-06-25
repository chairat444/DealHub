export interface ShareOptions {
  title: string
  text?: string
  path?: string
}

export function useShare() {
  const config = useRuntimeConfig()
  const route = useRoute()

  const canNativeShare = computed(
    () => import.meta.client && typeof navigator !== 'undefined' && !!navigator.share,
  )

  function resolveUrl(path?: string) {
    const base = (config.public.siteUrl as string).replace(/\/$/, '')
    const target = path ?? route.fullPath
    if (target.startsWith('http')) return target
    return `${base}${target.startsWith('/') ? target : `/${target}`}`
  }

  async function shareNative(options: ShareOptions) {
    const url = resolveUrl(options.path)
    if (!canNativeShare.value) return false
    await navigator.share({
      title: options.title,
      text: options.text,
      url,
    })
    return true
  }

  async function copyLink(path?: string) {
    const url = resolveUrl(path)
    await navigator.clipboard.writeText(url)
    return url
  }

  function facebookShareUrl(path?: string) {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolveUrl(path))}`
  }

  function lineShareUrl(path?: string) {
    return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(resolveUrl(path))}`
  }

  function xShareUrl(options: ShareOptions) {
    const params = new URLSearchParams({
      url: resolveUrl(options.path),
      text: options.text || options.title,
    })
    return `https://twitter.com/intent/tweet?${params.toString()}`
  }

  function openShareWindow(url: string) {
    if (!import.meta.client) return
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520')
  }

  return {
    canNativeShare,
    resolveUrl,
    shareNative,
    copyLink,
    facebookShareUrl,
    lineShareUrl,
    xShareUrl,
    openShareWindow,
  }
}
