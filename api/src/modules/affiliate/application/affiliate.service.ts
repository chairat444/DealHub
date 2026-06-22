import { Injectable } from '@nestjs/common';
import { Marketplace } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  async trackClick(data: {
    productId: string;
    marketplace: Marketplace;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    const click = await this.prisma.affiliateClick.create({ data });

    const listing = await this.prisma.productListing.findFirst({
      where: { productId: data.productId, marketplace: data.marketplace, isAvailable: true },
      orderBy: { price: 'asc' },
    });

    return {
      clickId: click.id,
      redirectUrl: listing?.affiliateUrl || null,
    };
  }

  async getStats(productId?: string) {
    const where = productId ? { productId } : {};
    const [total, byMarketplace] = await Promise.all([
      this.prisma.affiliateClick.count({ where }),
      this.prisma.affiliateClick.groupBy({
        by: ['marketplace'],
        where,
        _count: true,
      }),
    ]);
    return { total, byMarketplace };
  }
}
