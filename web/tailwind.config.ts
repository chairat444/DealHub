/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/constants/**/*.{js,ts}',
    './app/app.vue',
  ],
  safelist: [
    'aspect-[3/1]',
    'aspect-[4/1]',
    'aspect-[5/1]',
    'aspect-[6/1]',
    'sm:aspect-[5/1]',
    'sm:aspect-[6/1]',
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          DEFAULT: '#EE4D2D',
          dark: '#D73211',
          light: '#FFF6F4',
        },
        page: 'rgb(var(--bg-page) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--bg-surface) / <alpha-value>)',
          muted: 'rgb(var(--bg-surface-muted) / <alpha-value>)',
        },
        content: {
          DEFAULT: 'rgb(var(--text-primary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
        },
        line: 'rgb(var(--border-default) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Noto Sans Thai', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
