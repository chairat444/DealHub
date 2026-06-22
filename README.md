# DealHub TH - Affiliate Product Discovery Platform

แพลตฟอร์มเทียบราคาสินค้าออนไลน์ รวบรวมสินค้าจาก **Shopee, Lazada, TikTok Shop** พร้อมธีมสีส้มแบบ Shopee

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Nuxt 4, Vue 3, TypeScript, TailwindCSS, Pinia, VueUse |
| Backend | NestJS, Prisma, MySQL, Redis, BullMQ, JWT |
| Infra | Docker, Docker Compose, GitHub Actions |

## Quick Start

### Prerequisites
- Node.js 22+
- MySQL (localhost, user: `root`, pass: `456456456`)
- Redis (optional, for caching)

### 1. Database Setup

```bash
# สร้าง database
mysql -u root -p456456456 -e "CREATE DATABASE IF NOT EXISTS dealhub_th CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# หรือใช้ Docker
docker compose up -d mysql redis
```

### 2. Backend (API)

```bash
cd api
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run start:dev
```

API: http://localhost:3001  
Swagger: http://localhost:3001/api/docs

### 3. Frontend (Web)

```bash
cd web
npm install
npm run dev
```

Web: http://localhost:3000

### 4. Docker (All-in-one)

```bash
docker compose up -d
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dealhub.th | admin123456 |
| User | user@dealhub.th | user123456 |

## Project Structure

```
affiliate-discovery-platform/
├── api/                    # NestJS Backend
│   ├── prisma/             # Database schema & seeds
│   └── src/
│       ├── common/         # Guards, decorators, pipes
│       ├── infrastructure/ # Database, Redis, Cache
│       └── modules/        # Feature modules (DDD)
│           ├── auth/
│           ├── products/
│           ├── categories/
│           ├── wishlist/
│           ├── price-alerts/
│           ├── affiliate/
│           ├── admin/
│           └── ai-reviews/
├── web/                    # Nuxt 4 Frontend
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── stores/
├── docs/                   # Architecture documentation
└── docker-compose.yml
```

## Features

- 🔍 ค้นหาสินค้าข้ามแพลตฟอร์ม
- 💰 เทียบราคา Shopee / Lazada / TikTok Shop
- 📊 ประวัติราคาย้อนหลัง
- ❤️ บันทึกรายการโปรด (Wishlist)
- 🔔 แจ้งเตือนราคา (Price Alerts)
- 📊 เปรียบเทียบสินค้า Side-by-side
- 🤖 สรุปรีวิวด้วย AI
- 🔗 Affiliate Click Tracking
- ⚙️ ระบบ Admin Dashboard (RBAC)

## Documentation

ดูรายละเอียดเพิ่มเติมใน [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
