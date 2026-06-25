#!/usr/bin/env bash
# สร้าง schema + demo data สำหรับ dev ใหม่ (สินค้า, หมวดหมู่, บอร์ด, สมาชิก demo)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
API="$ROOT/api"

if [[ ! -f "$API/.env" ]]; then
  echo "⚠️  ไม่พบ api/.env"
  echo "   cp api/.env.example api/.env  แล้วแก้ DATABASE_URL"
  exit 1
fi

cd "$API"

echo "📦 prisma generate..."
npx prisma generate

echo "🗄️  prisma migrate deploy..."
npx prisma migrate deploy

echo "🌱 seed demo data..."
npm run db:seed

echo ""
echo "✅ DB พร้อมแล้ว"
echo "   Admin: admin@dealhub.th / admin123456"
echo "   User:  user@dealhub.th / user123456"
echo "   Board demo users: รหัสผ่าน user123456 (ดู api/prisma/demo-board.ts)"
