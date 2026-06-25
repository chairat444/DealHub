# Database Backup & Dev Setup — DealHub TH

Dev ใหม่มี **2 ทาง** ในการได้ schema + demo data

---

## วิธีที่แนะนำ: Migrate + Seed (จาก Git)

ข้อมูล demo อยู่ใน repo แล้ว — ไม่ต้องส่งไฟล์ SQL แยก

```bash
# 1. สร้าง database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS dealhub_th CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. ตั้งค่า API
cp api/.env.example api/.env
# แก้ DATABASE_URL ใน api/.env

# 3. สร้างตาราง + demo ครบ (สินค้า, หมวด, บอร์ด, ผู้ใช้)
npm run db:setup
```

หรือทีละขั้น:

```bash
cd api
npx prisma migrate deploy   # สร้าง/อัปเดตตารางทั้งหมด
npm run db:seed             # ใส่ demo data
```

### สิ่งที่ seed สร้างให้

| รายการ | จำนวน |
|--------|--------|
| หมวดหมู่ | 5 |
| สินค้า demo | 16 (+ listings) |
| กลุ่มบอร์ด | 8 |
| โพสต์บอร์ด | 12 (+ คอมเมนต์) |
| ผู้ใช้ demo | admin + user + สมาชิกบอร์ด 9 คน |

ไฟล์ seed หลัก:
- `api/prisma/seed.ts` — orchestrator
- `api/prisma/demo-products.ts` — สินค้า
- `api/prisma/demo-board.ts` — บอร์ด

Migrations (schema ทุกตาราง):
- `api/prisma/migrations/20260622144022_init/`
- `api/prisma/migrations/20260622190000_board/`

---

## วิธีทางเลือก: Import SQL dump

ใช้เมื่อต้องการ snapshot DB เต็ม ๆ (เช่น ส่งให้ dev ที่ไม่มี Node)

### ไฟล์ backup

| ไฟล์ | รายละเอียด |
|------|------------|
| `dealhub_th_20260622.sql` | dump เก่า — **ไม่มีตารางบอร์ด** |
| `dealhub_th_YYYYMMDD.sql.gz` | dump ล่าสุด (ถ้ามี) — ส่งไฟล์นี้ให้ dev |

### สร้าง dump ใหม่ (สำหรับคนส่งต่อ)

```bash
mysqldump -u root -p --single-transaction dealhub_th | gzip > backups/dealhub_th_$(date +%Y%m%d).sql.gz
```

### Restore

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS dealhub_th CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
gunzip -c backups/dealhub_th_YYYYMMDD.sql.gz | mysql -u root -p dealhub_th
```

หลัง import แล้ว รัน `npx prisma migrate deploy` ใน `api/` เผื่อ schema ใน Git ใหม่กว่า dump

---

## บัญชี demo

| บทบาท | อีเมล | รหัสผ่าน |
|-------|-------|----------|
| Admin | admin@dealhub.th | admin123456 |
| User | user@dealhub.th | user123456 |
| สมาชิกบอร์ด demo | *@dealhub.th ใน demo-board.ts | user123456 |

---

## หมายเหตุ

- ไฟล์ `.sql` / `.sql.gz` ขนาดใหญ่ **ไม่ commit** ขึ้น Git — ส่งผ่าน Drive/Slack หรือใช้ `npm run db:setup`
- Redis ไม่รวมใน backup — เป็น cache ชั่วคราว
- หลัง seed ถ้า API รันอยู่แล้ว แนะนำ restart เพื่อเคลียร์ cache
