import { PrismaClient, Marketplace, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123456', 12);
  const userPassword = await bcrypt.hash('user123456', 12);

  const admin = await prisma.user.upsert({
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

  const user = await prisma.user.upsert({
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

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'อิเล็กทรอนิกส์', slug: 'electronics', icon: '📱', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: { name: 'แฟชั่น', slug: 'fashion', icon: '👗', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'beauty' },
      update: {},
      create: { name: 'ความงาม', slug: 'beauty', icon: '💄', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'home-living' },
      update: {},
      create: { name: 'บ้านและที่อยู่อาศัย', slug: 'home-living', icon: '🏠', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: { name: 'กีฬาและกลางแจ้ง', slug: 'sports', icon: '⚽', sortOrder: 5 },
    }),
  ]);

  const sampleProducts = [
    {
      name: 'iPhone 15 Pro Max 256GB',
      slug: 'iphone-15-pro-max-256gb',
      brand: 'Apple',
      categoryId: categories[0].id,
      rating: 4.8,
      reviewCount: 1250,
      soldCount: 8500,
      isTrending: true,
      isTopSelling: true,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1c204c3fafb5?w=400',
      searchKeywords: 'iphone 15 pro max apple สมาร์ทโฟน',
      listings: [
        { marketplace: Marketplace.SHOPEE, price: 45900, originalPrice: 48900, externalId: 'shopee-iphone15', shopName: 'Apple Official Store' },
        { marketplace: Marketplace.LAZADA, price: 46500, originalPrice: 48900, externalId: 'lazada-iphone15', shopName: 'Lazada Apple' },
        { marketplace: Marketplace.TIKTOK_SHOP, price: 45200, originalPrice: 48900, externalId: 'tiktok-iphone15', shopName: 'TikTok Apple TH' },
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      brand: 'Samsung',
      categoryId: categories[0].id,
      rating: 4.7,
      reviewCount: 980,
      soldCount: 6200,
      isTrending: true,
      isTopSelling: true,
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      searchKeywords: 'samsung galaxy s24 ultra สมาร์ทโฟน',
      listings: [
        { marketplace: Marketplace.SHOPEE, price: 38900, originalPrice: 42900, externalId: 'shopee-s24', shopName: 'Samsung Official' },
        { marketplace: Marketplace.LAZADA, price: 39500, originalPrice: 42900, externalId: 'lazada-s24', shopName: 'Samsung Lazada' },
      ],
    },
    {
      name: 'เสื้อยืด Oversize คอตตอน 100%',
      slug: 'oversize-cotton-tshirt',
      brand: 'Local Brand',
      categoryId: categories[1].id,
      rating: 4.5,
      reviewCount: 3200,
      soldCount: 15000,
      isTrending: true,
      isTopSelling: true,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      searchKeywords: 'เสื้อยืด oversize แฟชั่น',
      listings: [
        { marketplace: Marketplace.SHOPEE, price: 199, originalPrice: 399, externalId: 'shopee-tshirt', shopName: 'Fashion TH' },
        { marketplace: Marketplace.TIKTOK_SHOP, price: 179, originalPrice: 399, externalId: 'tiktok-tshirt', shopName: 'TikTok Fashion' },
      ],
    },
    {
      name: 'เซรั่มวิตามินซี บำรุงผิว',
      slug: 'vitamin-c-serum',
      brand: 'Beauty Pro',
      categoryId: categories[2].id,
      rating: 4.6,
      reviewCount: 5600,
      soldCount: 22000,
      isTrending: true,
      isTopSelling: false,
      imageUrl: 'https://images.unsplash.com/photo-1620916564558-99ef3043f8c2?w=400',
      searchKeywords: 'เซรั่ม วิตามินซี บำรุงผิว ความงาม',
      listings: [
        { marketplace: Marketplace.SHOPEE, price: 299, originalPrice: 590, externalId: 'shopee-serum', shopName: 'Beauty Store' },
        { marketplace: Marketplace.LAZADA, price: 320, originalPrice: 590, externalId: 'lazada-serum', shopName: 'Lazada Beauty' },
      ],
    },
    {
      name: 'หูฟัง Bluetooth ANC Pro',
      slug: 'bluetooth-anc-headphones',
      brand: 'SoundMax',
      categoryId: categories[0].id,
      rating: 4.4,
      reviewCount: 2100,
      soldCount: 9800,
      isTrending: false,
      isTopSelling: true,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      searchKeywords: 'หูฟัง bluetooth anc ไร้สาย',
      listings: [
        { marketplace: Marketplace.SHOPEE, price: 1290, originalPrice: 2490, externalId: 'shopee-headphone', shopName: 'Audio Shop' },
        { marketplace: Marketplace.LAZADA, price: 1350, originalPrice: 2490, externalId: 'lazada-headphone', shopName: 'Lazada Audio' },
        { marketplace: Marketplace.TIKTOK_SHOP, price: 1190, originalPrice: 2490, externalId: 'tiktok-headphone', shopName: 'TikTok Audio' },
      ],
    },
    {
      name: 'โซฟา 3 ที่นั่ง ผ้ากำมะหยี่',
      slug: 'velvet-sofa-3-seater',
      brand: 'HomeStyle',
      categoryId: categories[3].id,
      rating: 4.3,
      reviewCount: 450,
      soldCount: 1200,
      isTrending: false,
      isTopSelling: false,
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      searchKeywords: 'โซฟา บ้าน เฟอร์นิเจอร์',
      listings: [
        { marketplace: Marketplace.SHOPEE, price: 12900, originalPrice: 18900, externalId: 'shopee-sofa', shopName: 'Home Furniture' },
        { marketplace: Marketplace.LAZADA, price: 13500, originalPrice: 18900, externalId: 'lazada-sofa', shopName: 'Lazada Home' },
      ],
    },
  ];

  for (const p of sampleProducts) {
    const { listings, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: productData,
    });

    for (const listing of listings) {
      await prisma.productListing.upsert({
        where: {
          marketplace_externalId: {
            marketplace: listing.marketplace,
            externalId: listing.externalId,
          },
        },
        update: { price: listing.price },
        create: {
          ...listing,
          productId: product.id,
          title: product.name,
          affiliateUrl: `https://${listing.marketplace.toLowerCase()}.co.th/product/${listing.externalId}?aff=dealhub`,
          currency: 'THB',
        },
      });

      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          price: listing.price,
          recordedAt: new Date(),
        },
      });
    }
  }

  const keywords = ['iphone', 'samsung', 'เสื้อยืด', 'เซรั่ม', 'หูฟัง', 'โซฟา', 'สมาร์ทโฟน', 'แฟชั่น'];
  for (const keyword of keywords) {
    await prisma.trendingKeyword.upsert({
      where: { keyword },
      update: { count: { increment: Math.floor(Math.random() * 100) } },
      create: { keyword, count: Math.floor(Math.random() * 500) + 100 },
    });
  }

  console.log('✅ Seed completed!');
  console.log(`   Admin: admin@dealhub.th / admin123456`);
  console.log(`   User:  user@dealhub.th / user123456`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
