import { BannerPlacement, PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { demoProducts } from './demo-products';
import { boardDemoUsers, boardGroupDefs, boardPostSeeds } from './demo-board';
import { DEMO_AD_SEEDS, DEMO_AD_CAROUSEL } from './demo-ads';
import { generateUniqueUsername, resolveTier } from '../src/modules/members/constants/member.constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123456', 12);
  const userPassword = await bcrypt.hash('user123456', 12);

  await prisma.user.upsert({
    where: { email: 'admin@dealhub.th' },
    update: { username: 'admin' },
    create: {
      email: 'admin@dealhub.th',
      passwordHash: adminPassword,
      name: 'ผู้ดูแลระบบ',
      username: 'admin',
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

  console.log('📋 Seeding board...');

  const demoPassword = await bcrypt.hash('user123456', 12);
  const somchai = await prisma.user.findUnique({ where: { email: 'user@dealhub.th' } });
  const userByEmail: Record<string, { id: string }> = {};
  if (somchai) {
    userByEmail['user@dealhub.th'] = somchai;
    if (!somchai.username) {
      await prisma.user.update({
        where: { id: somchai.id },
        data: { username: await generateUniqueUsername(prisma, 'somchai') },
      });
    }
  }

  for (const demoUser of boardDemoUsers) {
    const emailLocal = demoUser.email.split('@')[0]!;
    const username = await generateUniqueUsername(prisma, emailLocal);
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: { name: demoUser.name, username },
      create: {
        email: demoUser.email,
        passwordHash: demoPassword,
        name: demoUser.name,
        username,
        role: UserRole.USER,
        emailVerified: true,
      },
    });
    userByEmail[demoUser.email] = user;
  }

  const groupBySlug: Record<string, { id: string }> = {};
  for (const group of boardGroupDefs) {
    const row = await prisma.boardGroup.upsert({
      where: { slug: group.slug },
      update: {
        name: group.name,
        icon: group.icon,
        description: group.description,
        color: group.color,
        bg: group.bg,
        sortOrder: group.sortOrder,
      },
      create: group,
    });
    groupBySlug[group.slug] = row;
  }

  await prisma.boardComment.deleteMany();
  await prisma.boardPostUpvote.deleteMany();
  await prisma.boardPost.deleteMany();

  const productBySlug = Object.fromEntries(
    (await prisma.product.findMany({ select: { id: true, slug: true } })).map((p) => [p.slug, p.id]),
  );

  for (const seed of boardPostSeeds) {
    const author = userByEmail[seed.authorEmail];
    const group = groupBySlug[seed.groupSlug];
    if (!author || !group) continue;

    const createdAt = new Date(Date.now() - seed.hoursAgo * 60 * 60 * 1000);
    const commentCount = seed.seedComments?.length ?? seed.commentCount;

    const post = await prisma.boardPost.create({
      data: {
        groupId: group.id,
        userId: author.id,
        productId: seed.productSlug ? productBySlug[seed.productSlug] : undefined,
        title: seed.title,
        excerpt: seed.excerpt,
        body: seed.body,
        upvoteCount: seed.upvoteCount,
        commentCount,
        isHot: seed.isHot ?? seed.upvoteCount >= 150,
        createdAt,
        updatedAt: createdAt,
      },
    });

    if (seed.seedComments?.length) {
      for (const comment of seed.seedComments) {
        const commentAuthor = userByEmail[comment.authorEmail];
        if (!commentAuthor) continue;
        await prisma.boardComment.create({
          data: {
            postId: post.id,
            userId: commentAuthor.id,
            body: comment.body,
            createdAt: new Date(Date.now() - comment.hoursAgo * 60 * 60 * 1000),
          },
        });
      }
    }
  }

  const userProfileBoost: Record<string, { dealScore: number; nickname?: string; bio?: string; expertiseTags?: string[] }> = {
    'dealhunter@dealhub.th': {
      dealScore: 920,
      nickname: 'Deal Hunter',
      bio: 'ล่าดีลทุกแพลตฟอร์ม — แชร์ทุกวัน',
      expertiseTags: ['deals', 'electronics'],
    },
    'arpakorn@dealhub.th': {
      dealScore: 680,
      nickname: 'อาภากร',
      bio: 'สายหูฟังและอิเล็กทรอนิกส์',
      expertiseTags: ['electronics', 'compare'],
    },
    'nattaya@dealhub.th': {
      dealScore: 540,
      nickname: 'ณัฐญา',
      bio: 'สกินแคร์และความงาม',
      expertiseTags: ['beauty', 'recommend'],
    },
    'user@dealhub.th': {
      dealScore: 85,
      nickname: 'สมชาย',
      bio: 'มือใหม่หัดช้อปออนไลน์',
      expertiseTags: ['newbie'],
    },
  };

  for (const [email, profile] of Object.entries(userProfileBoost)) {
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u) continue;
    await prisma.user.update({
      where: { id: u.id },
      data: { ...profile, expertiseTags: profile.expertiseTags },
    });
  }

  const usersWithoutUsername = await prisma.user.findMany({ where: { username: null } });
  for (const u of usersWithoutUsername) {
    const username = await generateUniqueUsername(prisma, u.email.split('@')[0]!);
    await prisma.user.update({ where: { id: u.id }, data: { username } });
  }

  // อัปเดต tier หลังสร้างโพสต์
  const seededUsers = await prisma.user.findMany({ where: { username: { not: null } } });
  for (const u of seededUsers) {
    const postCount = await prisma.boardPost.count({ where: { userId: u.id } });
    await prisma.user.update({
      where: { id: u.id },
      data: { tier: resolveTier(u.dealScore, postCount) },
    });
  }

  console.log('📢 Seeding demo ads...');
  for (const ad of DEMO_AD_SEEDS) {
    const existing = await prisma.banner.findFirst({
      where: { placement: ad.placement, sortOrder: ad.sortOrder },
      orderBy: { createdAt: 'asc' },
    });
    if (existing) {
      await prisma.banner.update({
        where: { id: existing.id },
        data: {
          title: ad.title,
          sponsorName: ad.sponsorName,
          imageUrl: ad.imageUrl,
          linkUrl: ad.linkUrl,
          altText: ad.altText,
          isActive: true,
        },
      });
    } else {
      await prisma.banner.create({
        data: { ...ad, isActive: true },
      });
    }
  }

  // โฆษณาตัวที่ 2 สำหรับ HOME_MID (carousel demo)
  for (const ad of DEMO_AD_CAROUSEL) {
    const existing = await prisma.banner.findFirst({
      where: { placement: ad.placement, sortOrder: ad.sortOrder },
    });
    if (existing) {
      await prisma.banner.update({
        where: { id: existing.id },
        data: {
          title: ad.title,
          sponsorName: ad.sponsorName,
          imageUrl: ad.imageUrl,
          linkUrl: ad.linkUrl,
          altText: ad.altText,
          isActive: true,
        },
      });
    } else {
      await prisma.banner.create({
        data: { ...ad, isActive: true },
      });
    }
  }

  console.log('✅ Seed completed!');
  console.log(`   Ads: ${DEMO_AD_SEEDS.length} placements + HOME_MID carousel`);
  console.log(`   Products: ${demoProducts.length} (${trendingCount} trending, ${topSellingCount} top-selling)`);
  console.log(`   Board: ${boardGroupDefs.length} groups, ${boardPostSeeds.length} posts`);
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
