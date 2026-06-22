import { Injectable } from '@nestjs/common';
import { Prisma, Marketplace } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CacheService } from '../../../infrastructure/cache/cache.service';

export interface ProductSearchParams {
  q?: string;
  category?: string;
  marketplace?: Marketplace;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'sold' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async search(params: ProductSearchParams) {
    const { q, category, marketplace, minPrice, maxPrice, sort = 'sold', page = 1, limit = 20 } = params;
    const cacheKey = `search:${JSON.stringify(params)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where: Prisma.ProductWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { searchKeywords: { contains: q } },
        { brand: { contains: q } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (marketplace || minPrice || maxPrice) {
      const listingFilter: Prisma.ProductListingWhereInput = {};
      if (marketplace) listingFilter.marketplace = marketplace;
      if (minPrice) listingFilter.price = { gte: minPrice };
      if (maxPrice) listingFilter.price = { ...((listingFilter.price as object) || {}), lte: maxPrice };
      where.listings = { some: listingFilter };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'sold' ? { soldCount: 'desc' }
      : sort === 'rating' ? { rating: 'desc' }
      : sort === 'newest' ? { createdAt: 'desc' }
      : { soldCount: 'desc' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          listings: {
            where: { isAvailable: true },
            orderBy: { price: 'asc' },
            take: 3,
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = {
      items: items.map(this.formatProduct),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };

    await this.cache.set(cacheKey, result, 120);
    if (q) {
      await this.prisma.searchLog.create({ data: { query: q, results: total } });
    }

    return result;
  }

  async findBySlug(slug: string) {
    const cacheKey = `product:${slug}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        listings: { where: { isAvailable: true }, orderBy: { price: 'asc' } },
        priceHistory: {
          orderBy: { recordedAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!product) return null;

    const result = this.formatProductDetail(product);
    await this.cache.set(cacheKey, result, 300);
    return result;
  }

  async getTrending(limit = 12) {
    const cacheKey = `trending:${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const items = await this.prisma.product.findMany({
      where: { isTrending: true },
      orderBy: { soldCount: 'desc' },
      take: limit,
      include: {
        listings: { where: { isAvailable: true }, orderBy: { price: 'asc' }, take: 1 },
      },
    });

    const result = items.map(this.formatProduct);
    await this.cache.set(cacheKey, result, 600);
    return result;
  }

  async getTopSelling(limit = 12) {
    const cacheKey = `top-selling:${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const items = await this.prisma.product.findMany({
      where: { isTopSelling: true },
      orderBy: { soldCount: 'desc' },
      take: limit,
      include: {
        listings: { where: { isAvailable: true }, orderBy: { price: 'asc' }, take: 1 },
      },
    });

    const result = items.map(this.formatProduct);
    await this.cache.set(cacheKey, result, 600);
    return result;
  }

  async getPriceHistory(productId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.prisma.priceHistory.findMany({
      where: { productId, recordedAt: { gte: since } },
      orderBy: { recordedAt: 'asc' },
      select: { price: true, recordedAt: true, listingId: true },
    });
  }

  async compare(productIds: string[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        listings: { where: { isAvailable: true }, orderBy: { price: 'asc' } },
        category: { select: { name: true } },
      },
    });
    return products.map(this.formatProductDetail);
  }

  private formatProduct(product: any) {
    const lowestPrice = product.listings?.[0]?.price;
    const highestPrice = product.listings?.[product.listings.length - 1]?.price;
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      brand: product.brand,
      rating: product.rating ? Number(product.rating) : null,
      reviewCount: product.reviewCount,
      soldCount: product.soldCount,
      isTrending: product.isTrending,
      isTopSelling: product.isTopSelling,
      category: product.category,
      lowestPrice: lowestPrice ? Number(lowestPrice) : null,
      highestPrice: highestPrice ? Number(highestPrice) : null,
      listings: product.listings?.map((l: any) => ({
        id: l.id,
        marketplace: l.marketplace,
        price: Number(l.price),
        originalPrice: l.originalPrice ? Number(l.originalPrice) : null,
        affiliateUrl: l.affiliateUrl,
        shopName: l.shopName,
      })),
    };
  }

  private formatProductDetail(product: any) {
    return {
      ...this.formatProduct(product),
      description: product.description,
      images: product.images,
      aiReviewSummary: product.aiReviewSummary,
      priceHistory: product.priceHistory?.map((p: any) => ({
        price: Number(p.price),
        recordedAt: p.recordedAt,
      })),
    };
  }
}
