#!/usr/bin/env node
import { writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const webPublic = join(root, 'web/public')
const adminPublic = join(root, 'admin/public')

const banners = {
  'hero-banner.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-label="DealHub TH price comparison">
  <defs>
    <linearGradient id="hero-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EE4D2D"/>
      <stop offset="55%" stop-color="#E8451F"/>
      <stop offset="100%" stop-color="#C13515"/>
    </linearGradient>
    <linearGradient id="hero-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFD600" stop-opacity="0"/>
      <stop offset="100%" stop-color="#FFD600" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="400" fill="url(#hero-bg)"/>
  <polygon points="680,0 1200,0 1200,400 520,400" fill="url(#hero-accent)"/>
  <circle cx="1080" cy="80" r="120" fill="#fff" opacity="0.06"/>
  <circle cx="920" cy="320" r="90" fill="#fff" opacity="0.05"/>
  <text x="64" y="148" fill="#FFD600" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="2">DEALHUB TH</text>
  <text x="64" y="210" fill="#ffffff" font-family="Arial,sans-serif" font-size="48" font-weight="700">Compare 3 Marketplaces</text>
  <text x="64" y="258" fill="rgba(255,255,255,0.88)" font-family="Arial,sans-serif" font-size="26">Shopee · Lazada · TikTok Shop in one place</text>
  <rect x="64" y="290" width="220" height="52" rx="10" fill="#FFD600"/>
  <text x="108" y="324" fill="#C13515" font-family="Arial,sans-serif" font-size="22" font-weight="700">Start comparing</text>
  <g transform="translate(720,130)">
    <rect x="0" y="0" width="148" height="56" rx="28" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
    <text x="74" y="36" fill="#fff" font-family="Arial,sans-serif" font-size="20" font-weight="600" text-anchor="middle">Shopee</text>
    <rect x="0" y="76" width="148" height="56" rx="28" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
    <text x="74" y="112" fill="#fff" font-family="Arial,sans-serif" font-size="20" font-weight="600" text-anchor="middle">Lazada</text>
    <rect x="168" y="38" width="168" height="56" rx="28" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
    <text x="252" y="74" fill="#fff" font-family="Arial,sans-serif" font-size="18" font-weight="600" text-anchor="middle">TikTok Shop</text>
  </g>
</svg>`,

  'ads/home-mid-shopee.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="240" viewBox="0 0 1200 240" role="img" aria-label="Shopee Flash Sale">
  <defs>
    <linearGradient id="shopee-bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF6633"/>
      <stop offset="100%" stop-color="#EE4D2D"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="240" fill="url(#shopee-bg)"/>
  <circle cx="1040" cy="120" r="100" fill="#fff" opacity="0.07"/>
  <rect x="40" y="36" width="130" height="32" rx="6" fill="#FFD600"/>
  <text x="56" y="58" fill="#C13515" font-family="Arial,sans-serif" font-size="16" font-weight="700">FLASH SALE</text>
  <text x="40" y="118" fill="#ffffff" font-family="Arial,sans-serif" font-size="44" font-weight="700">Up to 70% OFF</text>
  <text x="40" y="158" fill="rgba(255,255,255,0.9)" font-family="Arial,sans-serif" font-size="24">Month-end deals on Shopee — limited time</text>
  <rect x="40" y="176" width="168" height="44" rx="8" fill="#fff"/>
  <text x="68" y="205" fill="#EE4D2D" font-family="Arial,sans-serif" font-size="20" font-weight="700">Shop now</text>
  <text x="1140" y="200" fill="#ffffff" font-family="Arial,sans-serif" font-size="36" font-weight="700" text-anchor="end">Shopee</text>
</svg>`,

  'ads/home-mid-lazada.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="240" viewBox="0 0 1200 240" role="img" aria-label="Lazada deals">
  <defs>
    <linearGradient id="lazada-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A53F0"/>
      <stop offset="50%" stop-color="#0F146D"/>
      <stop offset="100%" stop-color="#1E0A5C"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="240" fill="url(#lazada-bg)"/>
  <circle cx="1000" cy="120" r="110" fill="#fff" opacity="0.06"/>
  <rect x="40" y="36" width="120" height="32" rx="6" fill="#FF6633"/>
  <text x="56" y="58" fill="#fff" font-family="Arial,sans-serif" font-size="16" font-weight="700">HOT DEAL</text>
  <text x="40" y="118" fill="#ffffff" font-family="Arial,sans-serif" font-size="44" font-weight="700">Lazada 11.11 Warm Up</text>
  <text x="40" y="158" fill="rgba(255,255,255,0.88)" font-family="Arial,sans-serif" font-size="24">Coupons + free shipping nationwide</text>
  <rect x="40" y="176" width="188" height="44" rx="8" fill="#FF6633"/>
  <text x="68" y="205" fill="#fff" font-family="Arial,sans-serif" font-size="20" font-weight="700">View Lazada deals</text>
  <text x="1140" y="200" fill="#ffffff" font-family="Arial,sans-serif" font-size="34" font-weight="700" text-anchor="end">Lazada</text>
</svg>`,

  'ads/search-top.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-label="DealHub compare prices">
  <defs>
    <linearGradient id="search-bg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a100d"/>
      <stop offset="40%" stop-color="#2f1c17"/>
      <stop offset="100%" stop-color="#EE4D2D"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="300" fill="url(#search-bg)"/>
  <circle cx="1050" cy="150" r="130" fill="#FFD600" opacity="0.08"/>
  <g transform="translate(900,75)" opacity="0.9">
    <circle cx="60" cy="60" r="48" fill="none" stroke="#FFD600" stroke-width="8"/>
    <line x1="96" y1="96" x2="130" y2="130" stroke="#FFD600" stroke-width="10" stroke-linecap="round"/>
  </g>
  <text x="56" y="108" fill="#FFD600" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="1.5">DEALHUB TH</text>
  <text x="56" y="162" fill="#ffffff" font-family="Arial,sans-serif" font-size="46" font-weight="700">Compare before you buy</text>
  <text x="56" y="206" fill="rgba(255,255,255,0.82)" font-family="Arial,sans-serif" font-size="24">Find the best price across every marketplace</text>
  <rect x="56" y="232" width="200" height="44" rx="8" fill="#FFD600"/>
  <text x="84" y="261" fill="#C13515" font-family="Arial,sans-serif" font-size="20" font-weight="700">Compare prices</text>
</svg>`,

  'ads/category-top.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-label="Lazada category deals">
  <defs>
    <linearGradient id="cat-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F146D"/>
      <stop offset="60%" stop-color="#1A53F0"/>
      <stop offset="100%" stop-color="#4B7BFF"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="300" fill="url(#cat-bg)"/>
  <polygon points="900,0 1200,0 1200,300 780,300" fill="#fff" opacity="0.05"/>
  <circle cx="1080" cy="240" r="90" fill="#FF6633" opacity="0.25"/>
  <text x="56" y="108" fill="#FFD600" font-family="Arial,sans-serif" font-size="20" font-weight="700">IN THIS CATEGORY</text>
  <text x="56" y="162" fill="#ffffff" font-family="Arial,sans-serif" font-size="46" font-weight="700">Top picks from Lazada</text>
  <text x="56" y="206" fill="rgba(255,255,255,0.85)" font-family="Arial,sans-serif" font-size="24">Best sellers + exclusive category prices</text>
  <rect x="56" y="232" width="176" height="44" rx="8" fill="#FF6633"/>
  <text x="84" y="261" fill="#fff" font-family="Arial,sans-serif" font-size="20" font-weight="700">Browse deals</text>
</svg>`,

  'ads/product-inline.svg': `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="300" viewBox="0 0 900 300" role="img" aria-label="TikTok Shop deals">
  <defs>
    <linearGradient id="tt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0d0d"/>
      <stop offset="50%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
    <linearGradient id="tt-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#25F4EE" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="#FE2C55" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#25F4EE" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="900" height="300" fill="url(#tt-bg)"/>
  <rect width="900" height="300" fill="url(#tt-accent)"/>
  <circle cx="780" cy="150" r="100" fill="#FE2C55" opacity="0.12"/>
  <text x="48" y="108" fill="#25F4EE" font-family="Arial,sans-serif" font-size="18" font-weight="700">TRENDING NOW</text>
  <text x="48" y="158" fill="#ffffff" font-family="Arial,sans-serif" font-size="40" font-weight="700">Shop on TikTok Shop</text>
  <text x="48" y="200" fill="rgba(255,255,255,0.78)" font-family="Arial,sans-serif" font-size="22">Live deals · fast delivery · trending products</text>
  <rect x="48" y="224" width="188" height="44" rx="22" fill="#FE2C55"/>
  <text x="76" y="253" fill="#fff" font-family="Arial,sans-serif" font-size="20" font-weight="700">View TikTok deals</text>
</svg>`,
}

mkdirSync(join(webPublic, 'ads'), { recursive: true })
mkdirSync(join(adminPublic, 'ads'), { recursive: true })

for (const [relPath, content] of Object.entries(banners)) {
  const webPath = join(webPublic, relPath)
  writeFileSync(webPath, content, 'utf8')
  console.log('wrote', webPath)

  const adminPath = join(adminPublic, relPath)
  writeFileSync(adminPath, content, 'utf8')
  console.log('wrote', adminPath)
}

console.log('Done — all banners regenerated as valid UTF-8 SVG')
