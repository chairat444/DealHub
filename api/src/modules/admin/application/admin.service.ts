import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [users, products, clicks, alerts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.affiliateClick.count(),
      this.prisma.priceAlert.count({ where: { isActive: true } }),
    ]);

    const recentClicks = await this.prisma.affiliateClick.findMany({
      take: 10,
      orderBy: { clickedAt: 'desc' },
      include: { product: { select: { name: true } } },
    });

    const topProducts = await this.prisma.product.findMany({
      take: 10,
      orderBy: { soldCount: 'desc' },
      select: { id: true, name: true, soldCount: true, slug: true },
    });

    return { stats: { users, products, clicks, alerts }, recentClicks, topProducts };
  }

  async getUsers(page = 1, limit = 20) {
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, email: true, name: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { items, meta: { total, page, limit } };
  }
}
