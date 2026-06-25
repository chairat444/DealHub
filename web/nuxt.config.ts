// https://nuxt.com/docs/api/configuration/nuxt-config
import { SEO } from './app/constants/seo'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'th' },
      title: SEO.shortName,
      titleTemplate: '%s | DealHub TH',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: SEO.themeColor },
        { name: 'description', content: SEO.defaultDescription },
        { name: 'keywords', content: SEO.homeKeywords },
        { name: 'author', content: SEO.siteName },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:site_name', content: SEO.siteName },
        { property: 'og:locale', content: SEO.locale },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: SEO.homeTitle },
        { property: 'og:description', content: SEO.homeDescription },
        { property: 'og:image', content: '/og-image.svg' },
        { property: 'og:image:alt', content: SEO.ogImageAlt },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: SEO.homeTitle },
        { name: 'twitter:description', content: SEO.homeDescription },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap' },
      ],
      script: [
        {
          innerHTML: `(function(){try{var m=localStorage.getItem('dealhub-color-scheme');var d=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api/v1',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
})
