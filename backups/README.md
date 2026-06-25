# Database Backup — DealHub TH

## ไฟล์

| ไฟล์ | รายละเอียด |
|------|------------|
| `dealhub_th_20260622.sql` | MySQL dump (utf8mb4) |
| `dealhub_th_20260622.sql.gz` | ไฟล์บีบอัด — ส่งไฟล์นี้ให้ dev ก็ได้ |

- **Database:** `dealhub_th`
- **Engine:** MySQL 8.0
- **สร้างเมื่อ:** 2026-06-22

## Restore (dev ใหม่)

### 1. สร้าง database

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS dealhub_th CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 2. Import

```bash
# จากไฟล์ .sql
mysql -u root -p dealhub_th < dealhub_th_20260622.sql

# หรือจากไฟล์ .gz
gunzip -c dealhub_th_20260622.sql.gz | mysql -u root -p dealhub_th
```

### 3. ตั้งค่า API

คัดลอก `api/.env.example` → `api/.env` แล้วตั้ง:

```
DATABASE_URL="mysql://root:<password>@localhost:3306/dealhub_th"
```

### 4. (ทางเลือก) รัน migration + seed อีกครั้ง

ถ้า import สำเร็จแล้ว ไม่จำเป็นต้อง seed — ข้อมูลอยู่ใน dump แล้ว

```bash
cd api
npx prisma migrate deploy   # ถ้า DB ว่างและยังไม่มี schema
npx prisma db seed          # ถ้าต้องการ reset ข้อมูล demo
```

## บัญชี demo ใน dump

| บทบาท | อีเมล | รหัสผ่าน |
|-------|-------|----------|
| Admin | admin@dealhub.th | admin123456 |
| User | user@dealhub.th | user123456 |

## หมายเหตุ

- ไฟล์ backup **ไม่ควร commit** ขึ้น Git (มีข้อมูลผู้ใช้)
- Redis ไม่ได้รวมใน backup — เป็น cache ชั่วคราวเท่านั้น
