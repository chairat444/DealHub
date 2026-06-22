import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class PriceAlertsService {
  constructor(private prisma: PrismaService) {}

  async getUserAlerts(userId: string) {
    return this.prisma.priceAlert.findMany({
      where: { userId, isActive: true },
      include: {
        product: {
          select: { id: true, name: true, slug: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, productId: string, targetPrice: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('ไม่พบสินค้า');

    return this.prisma.priceAlert.create({
      data: { userId, productId, targetPrice },
    });
  }

  async deactivate(userId: string, alertId: string) {
    await this.prisma.priceAlert.updateMany({
      where: { id: alertId, userId },
      data: { isActive: false },
    });
    return { success: true };
  }
}
