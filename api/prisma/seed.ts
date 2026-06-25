import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { demoProducts } from './demo-products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123456', 12);
  const userPassword = await bcrypt.hash('user123456', 12);

  await prisma.user.upsert({
    where: { email: 'admin@dealhub.th' },
    update: {},
    create: {
      email: 'admin@dealhub.th',
      passwordHash: adminPassword,
      name: 'ผู้ดูแลระบบ',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@dealhub.th' },
    update: {},
    create: {
      email: 'user@dealhub.th',
      passwordHash: userPassword,
      name: 'สมชาย ใจดี',
      role: UserRole.USER,
      emailVerified: true,
    },
  });

  const categoryDefs = [
    { slug: 'electronics', name: 'อิเล็กทรอนิกส์', icon: '📱', sortOrder: 1, description: 'เทียบราคาสมาร์ทโฟน แท็บเล็ต หูฟัง และอุปกรณ์อิเล็กทรอนิกส์ จาก Shopee Lazada TikTok Shop หาราคาดีที่สุดก่อนซื้อ' },
    { slug: 'fashion', name: 'แฟชั่น', icon: '👗', sortOrder: 2, description: 'แฟชั่นและเสื้อผ้าแบรนด์ดัง เปรียบเทียบราคาจากทุกแพลตฟอร์ม อัปเดตโปรโมชั่นและดีลล่าสุดทุกวัน' },
    { slug: 'beauty', name: 'ความงาม', icon: '💄', sortOrder: 3, description: 'สกินแคร์ เครื่องสำอาง และผลิตภัณฑ์บำรุงความงาม เทียบราคาจากร้านค้าออนไลน์ชั้นนำในที่เดียว' },
    { slug: 'home-living', name: 'บ้านและที่อยู่อาศัย', icon: '🏠', sortOrder: 4, description: 'เฟอร์นิเจอร์ ของใช้ในบ้าน และเครื่องใช้ไฟฟ้า เลือกซื้อในราคาคุ้มค่าจากหลายแพลตฟอร์ม' },
    { slug: 'sports', name: 'กีฬาและกลางแจ้ง', icon: '⚽', sortOrder: 5, description: 'อุปกรณ์กีฬาและกิจกรรมกลางแจ้ง เทียบราคาและโปรโมชั่นจาก Shopee Lazada TikTok Shop' },
  ];

  const categories = await Promise.all(
    categoryDefs.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          icon: cat.icon,
          sortOrder: cat.sortOrder,
          description: cat.description,
        },
        create: cat,
      }),
    ),
  );

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  for (const p of demoProducts) {
    const { listings, categorySlug, ...rest } = p;
    const categoryId = categoryBySlug[categorySlug].id;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: rest.name,
        brand: rest.brand,
        categoryId,
        rating: rest.rating,
        reviewCount: rest.reviewCount,
        soldCount: rest.soldCount,
        isTrending: rest.isTrending,
        isTopSelling: rest.isTopSelling,
        imageUrl: rest.imageUrl,
        searchKeywords: rest.searchKeywords,
      },
      create: {
        ...rest,
        categoryId,
      },
    });

    for (const listing of listings) {
      await prisma.productListing.upsert({
        where: {
          marketplace_externalId: {
            marketplace: listing.marketplace,
            externalId: listing.externalId,
          },
        },
        update: {
          price: listing.price,
          originalPrice: listing.originalPrice,
          title: product.name,
        },
        create: {
          ...listing,
          productId: product.id,
          title: product.name,
          affiliateUrl: `https://${listing.marketplace.toLowerCase()}.co.th/product/${listing.externalId}?aff=dealhub`,
          currency: 'THB',
        },
      });
    }
  }

  const keywords = ['iphone', 'samsung', 'เสื้อยืด', 'เซรั่ม', 'หูฟัง', 'โซฟา', 'สมาร์ทโฟน', 'แฟชั่น', 'ps5', 'stanley', 'dyson', 'air fryer'];
  for (const keyword of keywords) {
    await prisma.trendingKeyword.upsert({
      where: { keyword },
      update: { count: { increment: Math.floor(Math.random() * 50) } },
      create: { keyword, count: Math.floor(Math.random() * 500) + 200 },
    });
  }

  const trendingCount = demoProducts.filter((p) => p.isTrending).length;
  const topSellingCount = demoProducts.filter((p) => p.isTopSelling).length;

  console.log('✅ Seed completed!');
  console.log(`   Products: ${demoProducts.length} (${trendingCount} trending, ${topSellingCount} top-selling)`);
  console.log(`   Homepage: Flash Sale 6 · มาแรง 6 · ขายดี 10 · แนะนำ 3`);
  console.log(`   Admin: admin@dealhub.th / admin123456`);
  console.log(`   User:  user@dealhub.th / user123456`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
