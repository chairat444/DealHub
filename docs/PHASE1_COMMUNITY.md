# Phase 1 — ระบบสมาชิกและชุมชนบอร์ด

> ต่อยอดจาก monorepo เดิม (Nuxt 4 + NestJS + Prisma + MySQL) — ไม่ได้สร้าง Next.js ใหม่

## สิ่งที่ทำใน Phase 1

### ระบบสมาชิก
- โปรไฟล์: `username`, ชื่อเล่น, bio, avatar, หมวดที่ถนัด
- **Deal Score** สะสมจากการโพสต์ / คอมเมนต์ / ได้รับ upvote
- **Member Tier**: นักล่าดีล → สายล่าดีล → ปรมาจารย์ดีล → ตำนานดีล
- สมัครสมาชิกสร้าง `username` อัตโนมัติ

### บอร์ด (ใช้ 8 กลุ่มเดิม — map กับ spec ได้)
| กลุ่ม DealHub | ใกล้เคียง spec |
|---------------|----------------|
| ดีล & โปรโมชั่น | Hot Deals |
| แนะนำสินค้า | Recommend |
| บอร์ดวาไรตี้ | Variety |
| ถามก่อนซื้อ + เทียบราคา | Ask & Compare |
| ใช้จริงรีวิว | Unboxing / Review |

### โพสต์
- ประเภท: พูดคุย / แชร์ดีล / รีวิว
- สร้าง / แก้ไข / ลบ (เจ้าของ)
- Upvote + คอมเมนต์

## API ใหม่

| Method | Path | รายละเอียด |
|--------|------|------------|
| GET | `/members/me` | โปรไฟล์ของฉัน |
| PUT | `/members/me` | แก้ไขโปรไฟล์ |
| GET | `/members/:username` | โปรไฟล์สาธารณะ |
| GET | `/members/leaderboard` | อันดับ Deal Score |
| PATCH | `/board/posts/:id` | แก้ไขโพสต์ |
| DELETE | `/board/posts/:id` | ลบโพสต์ |

## หน้าเว็บใหม่

- `/profile/[username]` — โปรไฟล์ + ประวัติโพสต์
- `/settings/profile` — ตั้งค่าโปรไฟล์
- `/leaderboard` — อันดับสมาชิก

## รันหลัง pull

```bash
npm run db:setup   # migrate + seed
npm run dev
```

## Phase 2 (ถัดไป)

- Badges, Verified Buyer, Shop Grade
- Follow + Feed
- Report + Moderation
- Weekly Challenge
